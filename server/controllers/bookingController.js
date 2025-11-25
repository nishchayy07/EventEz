import { inngest } from "../inngest/index.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js"
import stripe from 'stripe'


// Function to check availability of selected seats for a movie
const checkSeatsAvailability = async (showId, selectedSeats)=>{
    try {
        const showData = await Show.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const createBooking = async (req, res)=>{
    try {
        const {userId} = req.auth();
        const {showId, selectedSeats} = req.body;
        const { origin } = req.headers;

        // Check if the seat is available for the selected show
        const isAvailable = await checkSeatsAvailability(showId, selectedSeats)

        if(!isAvailable){
            return res.json({success: false, message: "Selected Seats are not available."})
        }

        // Get the show details
        const showData = await Show.findById(showId).populate('movie');

        // Create a new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice * selectedSeats.length,
            bookedSeats: selectedSeats
        })

        selectedSeats.map((seat)=>{
            showData.occupiedSeats[seat] = userId;
        })

        showData.markModified('occupiedSeats');

        await showData.save();

         // Stripe Gateway Initialize
         const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

         // Creating line items to for Stripe
         const line_items = [{
            price_data: {
                currency: 'inr',
                product_data:{
                    name: showData.movie.title
                },
                unit_amount: Math.floor(booking.amount) * 100
            },
            quantity: 1
         }]

         const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            line_items: line_items,
            mode: 'payment',
            locale: 'auto',
            payment_method_types: ['card'],
            metadata: {
                bookingId: booking._id.toString()
            },
            expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // Expires in 30 minutes
         })

         booking.paymentLink = session.url
         await booking.save()

         // Run Inngest Sheduler Function to check payment status after 10 minutes
         await inngest.send({
            name: "app/checkpayment",
            data: {
                bookingId: booking._id.toString()
            }
         })

         res.json({success: true, url: session.url})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

export const getOccupiedSeats = async (req, res)=>{
    try {
        
        const {showId} = req.params;
        const showData = await Show.findById(showId)

        const occupiedSeats = Object.keys(showData.occupiedSeats)

        res.json({success: true, occupiedSeats})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

const buildEventDetails = (booking) => {
    const base = {
        type: booking.type,
        seats: booking.bookedSeats,
        amount: booking.amount,
        qrUsed: booking.qrUsed,
        qrUsedAt: booking.qrUsedAt,
        bookedAt: booking.createdAt
    };

    if (booking.type === 'sport' && booking.sportEvent) {
        return {
            ...base,
            title: booking.sportEvent.title,
            venue: booking.sportEvent.venue,
            date: booking.sportEvent.showDateTime,
        };
    }

    if (booking.type === 'nightlife' && booking.nightlifeEvent) {
        return {
            ...base,
            title: booking.nightlifeEvent.title,
            venue: booking.nightlifeEvent.venue,
            date: booking.nightlifeEvent.showDateTime,
        };
    }

    if (booking.show) {
        return {
            ...base,
            title: booking.show.movie?.title,
            venue: 'Movie Auditorium',
            date: booking.show.showDateTime,
        };
    }

    return base;
}

// Verify QR token and mark as used (single-use)
export const verifyQrToken = async (req, res) => {
    try {
        const { token } = req.params;
        const booking = await Booking.findOne({ qrToken: token })
            .populate({ path: 'show', populate: { path: 'movie', model: 'Movie' } })
            .populate('sportEvent')
            .populate('nightlifeEvent')
            .populate('user');

        if (!booking) return res.status(404).json({ success: false, message: 'Invalid QR' });
        if (!booking.isPaid) return res.status(400).json({ success: false, message: 'Payment pending' });
        if (booking.isCancelled) return res.status(400).json({ success: false, message: 'Booking has been cancelled' });
        if (booking.qrUsed) {
            return res.status(400).json({
                success: false,
                message: 'QR already used',
                data: {
                    booking: buildEventDetails(booking),
                    attendee: booking.user ? {
                        name: booking.user.name,
                        email: booking.user.email
                    } : null
                }
            });
        }
        booking.qrUsed = true;
        booking.qrUsedAt = new Date();
        await booking.save();
        res.json({
            success: true,
            data: {
                booking: buildEventDetails(booking),
                attendee: booking.user ? {
                    name: booking.user.name,
                    email: booking.user.email
                } : null
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Cancel booking with 50% refund
export const cancelBooking = async (req, res) => {
    try {
        const { userId } = req.auth();
        const { bookingId } = req.params;

        const booking = await Booking.findById(bookingId)
            .populate('show')
            .populate('sportEvent')
            .populate('nightlifeEvent');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        // Verify ownership
        if (booking.user.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Check if already cancelled
        if (booking.isCancelled) {
            return res.status(400).json({ success: false, message: 'Booking already cancelled' });
        }

        // Check if payment is completed
        if (!booking.isPaid) {
            return res.status(400).json({ success: false, message: 'Cannot cancel unpaid booking' });
        }

        // Check if QR already used (ticket already scanned)
        if (booking.qrUsed) {
            return res.status(400).json({ success: false, message: 'Cannot cancel: Ticket already used at entry' });
        }

        // Calculate 50% refund
        const refundAmount = Math.floor(booking.amount * 0.5 * 100) / 100; // Round to 2 decimals

        // Release seats based on event type
        if (booking.type === 'movie' && booking.show) {
            const show = booking.show;
            booking.bookedSeats.forEach(seat => {
                delete show.occupiedSeats[seat];
            });
            show.markModified('occupiedSeats');
            await show.save();
        } else if (booking.type === 'sport' && booking.sportEvent) {
            const event = booking.sportEvent;
            const isChess = event.sport?.toLowerCase() === 'chess';
            if (!isChess && event.occupiedSeats) {
                booking.bookedSeats.forEach(seat => {
                    delete event.occupiedSeats[seat];
                });
                event.markModified('occupiedSeats');
                await event.save();
            }
        } else if (booking.type === 'nightlife' && booking.nightlifeEvent) {
            const event = booking.nightlifeEvent;
            if (Array.isArray(event.occupiedSeats)) {
                event.occupiedSeats = event.occupiedSeats.filter(seat => !booking.bookedSeats.includes(seat));
                await event.save();
            } else if (typeof event.occupiedSeats === 'object') {
                booking.bookedSeats.forEach(seat => {
                    delete event.occupiedSeats[seat];
                });
                event.markModified('occupiedSeats');
                await event.save();
            }
        }

        // Mark booking as cancelled
        booking.isCancelled = true;
        booking.cancelledAt = new Date();
        booking.refundAmount = refundAmount;
        await booking.save();

        res.json({
            success: true,
            message: 'Booking cancelled successfully',
            data: {
                bookingId: booking._id,
                originalAmount: booking.amount,
                refundAmount: refundAmount,
                deduction: booking.amount - refundAmount
            }
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}