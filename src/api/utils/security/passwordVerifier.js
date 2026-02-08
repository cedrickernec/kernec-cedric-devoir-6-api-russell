import bcrypt from "bcrypt";
import User from "../../models/User.js";

export const verifyUserPassword = async (userId, plainPassword) => {

    const user = await User.findById(userId);
    if (!user) return false;

    return bcrypt.compare(plainPassword, user.password);
};