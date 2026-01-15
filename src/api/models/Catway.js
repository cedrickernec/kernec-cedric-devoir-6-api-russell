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
    isOutOfService: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
}
);

export default mongoose.model("Catway", CatwaySchema);