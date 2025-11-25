import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    user: {type: String, required: true, ref: 'User'},
    show: {type: String, ref: 'Show'},
    sportEvent: {type: String, ref: 'SportEvent'},
    nightlifeEvent: {type: mongoose.Schema.Types.ObjectId, ref: 'NightlifeEvent'},
    type: {type: String, enum: ['movie', 'sport', 'nightlife'], default: 'movie'},
    amount: {type: Number, required: true},
    bookedSeats: {type: Array, required: true},
    isPaid: {type: Boolean,  default:false},
    paymentLink: {type: String},
    qrToken: {type: String},
    qrUsed: {type: Boolean, default: false},
    qrUsedAt: {type: Date},
    isCancelled: {type: Boolean, default: false},
    cancelledAt: {type: Date},
    refundAmount: {type: Number},
},{timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;