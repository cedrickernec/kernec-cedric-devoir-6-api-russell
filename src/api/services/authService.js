/**
 * ============================================================
 * AUTH SERVICE
 * ============================================================
 * - Décide si une action métier est autorisée :
 *      - Contient la logique métier de l'application
 *      - Applique les règles fonctionnelles
 *      - Appelle les validators, les rules et les repositories
 * ============================================================
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";

import {
    findUserByEmailWithPassword
} from "../repositories/userRepo.js";

// ===============================================
// LOGIN
// ===============================================

export async function loginService(email, password) {

    const user = await findUserByEmailWithPassword(email);

    if (!user) {
        throw new ApiError(401, "Email ou mot de passe incorrect.");
    }

    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordValid) {
        throw new ApiError(401, "Email ou mot de passe incorrect.");
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    return { token, user };
}