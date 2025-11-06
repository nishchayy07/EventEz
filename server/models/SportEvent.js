import mongoose from "mongoose";

const sportEventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        sport: { type: String, required: true },
        venue: { type: String },
        showDateTime: { type: Date, required: true },
        price: { type: Number, required: true },
        image: { type: String },
        occupiedSeats: { type: Object, default: {} },
    },
    { minimize: false }
)

const SportEvent = mongoose.model("SportEvent", sportEventSchema);

export default SportEvent;

