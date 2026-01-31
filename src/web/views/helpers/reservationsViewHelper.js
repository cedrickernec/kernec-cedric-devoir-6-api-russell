// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

export const renderCreateReservationPage = (res, {
    errors = {},
    globalError = null,
    formData = {},
    step = "client",
    availableCatways = []
}) => {
    res.render("catways/catwayCreate", {
        title: "Création d'une réservation",
        activePage : "reservations",
        step,
        errors,
        globalError,
        formData,
        availableCatways
    });
};

// ==================================================
// VIEW HELPER - EDIT PAGE RENDER
// ==================================================

export const renderEditReservationPage = (res, {
    reservation,
    otherReservations = [],
    errors = {},
    globalError = null,
    formData = {}
}) => {
    res.render("catways/catwayEdit", {
        title: "Édition d'une réservation",
        activePage : "reservations",
        reservation,
        otherReservations,
        errors,
        globalError,
        formData
    });
};