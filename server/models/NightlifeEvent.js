import mongoose from "mongoose";

const nightlifeEventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true }, // 'Concerts', 'Comedy Shows', 'Theatre Shows', 'Qawali Night', etc.
        venue: { type: String, required: true },
        location: { type: String, required: true }, // City/Region like 'Delhi/NCR', 'Mumbai', etc.
        description: { type: String },
        showDateTime: { type: Date, required: true },
        price: { type: String, required: true }, // Store as string to support formats like '₹2999' or '₹99 onwards'
        image: { type: String }, // Portrait/poster image
        landscapeImage: { type: String }, // Wide banner image for event details
        artist: { type: String }, // Artist/performer name
        artistImage: { type: String }, // Artist profile image
        duration: { type: String }, // Event duration like '2 hours', '3 hours'
        ageRestriction: { type: String }, // Age restriction like '18+', '21+'
        occupiedSeats: { type: Object, default: {} },
    },
    { minimize: false, timestamps: true }
)

const NightlifeEvent = mongoose.model("NightlifeEvent", nightlifeEventSchema);

export default NightlifeEvent;
