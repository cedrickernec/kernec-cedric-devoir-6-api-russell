import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors/apiError.js";

export const authMiddleware = (req, res, next) => {
    try {
        // 1) Vérification header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new ApiError(401, "Accès refusé: aucun token fourni.");
        }

        // 2) Extraction du token
        const token = authHeader.split(" ")[1];

        if (!token) {
            throw new ApiError(401, "Accès refusé: aucun token fourni.");
        }

        // 3) Vérification et décodage du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // 4) Attachement du user à req
        req.user = decoded;

        // 5) Validation
        next();

    } catch (error) {

        //Token expiré
        if (error.name ===  "TokenExpiredError") {
            return next(
                new ApiError(401, "Token expiré. Veuillez vous reconnecter.")
            );
        }

        // Token invalide
        if (error.name === "JsonWebTokenError") {
            return next(
                new ApiError(401, "Accès refusé: token invalide.")
            );
        }

        next(error);
    }
};