import mongoose from "mongoose";

const nightlifeEventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true }, // 'Rooftop Bar', 'Live Music', 'Dance Club', etc.
        venue: { type: String, required: true },
        description: { type: String },
        showDateTime: { type: Date, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        occupiedSeats: { type: Object, default: {} },
    },
    { minimize: false, timestamps: true }
)

const NightlifeEvent = mongoose.model("NightlifeEvent", nightlifeEventSchema);

export default NightlifeEvent;
