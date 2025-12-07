import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "employe"],
        default: "employe",
    },
});

// Préparation au futur hash du password
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    //futur hash ici

    next()
})

export default mongoose.model("User", UserSchema);