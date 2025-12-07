import mongoose from "mongoose";

const CatwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: Number,
        required: true,
        unique: true
    },
    catwayType: {
        type: String,
        required: true,
    },
    catwayState: {
        type: String,
        required: true,
    },
});

export default mongoose.model("Catway", CatwaySchema);