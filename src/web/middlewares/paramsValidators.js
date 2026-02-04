export function validateMongoIdParam(paramName = "id") {
    return (req, res, next) => {
        const value = req.params[paramName];

        const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

        if (!mongoIdRegex.test(value)) {
            return res.status(400).render("errors/400", {
                message: "Identifiant invalide."
            });
        }

        next();
    };
}

export function validateNumberParam(paramName = "catwayNumber") {
    return (req, res, next) => {
        const value = req.params[paramName];

        if (!/^\d+$/.test(value)) {
            return res.status(400).render("errors/400", {
                message: "Paramètre numérique invalide."
            });
        }

        next();
    };
}