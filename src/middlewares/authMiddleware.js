import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        // 1) Vérification header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Accès refusé: aucun token fourni."
            });
        }

        // 2) Extraction du token
        const token = authHeader.split(" ")[1];

        // 3) Vérification et décodage du token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN)

        // 4) Attachement du user à req
        req.user = decoded;

        // 5) Validation
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Token invalide.",
            error: error.message
        });
    }
};