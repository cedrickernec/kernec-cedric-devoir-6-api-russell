export function validateReservationData(body) {
    const errors = {};
    const { catwayNumber, clientName, boatName, startDate, endDate } = body;

    // Champs obligatoires
    if (catwayNumber === undefined || catwayNumber === null)
        errors.catwayNumber = "Champ obligatoire manquant : Numéro de catway";

    if (!clientName)
        errors.clientName = "Champ obligatoire manquant : Nom du client";

    if (!boatName)
        errors.boatName = "Champ obligatoire manquant : Nom du bateau";

    if (!startDate)
        errors.startDate = "Champ obligatoire manquant : Date d'entrée";

    if (!endDate)
        errors.endDate = "Champ obligatoire manquant : Date de sortie";

    // Numéro de catway = Numérique
    if (catwayNumber !== undefined && isNaN(Number(catwayNumber)))
        errors.catwayNumber = "Le numéro de catway doit être un nombre.";

    // Format des dates
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (startDate && isNaN(sDate))
        errors.startDate = "Format de la date d'entrée invalide.";

    if (endDate && isNaN(eDate))
        errors.endDate = "Format de la date de sortie invalide.";

    // cohérence start < end
    if (startDate && endDate && !isNaN(sDate) && !isNaN(eDate) && sDate >= eDate)
        errors.dateOrder = "La date d'entrée doit être antérieure à la date de sortie.";

    return errors;
}