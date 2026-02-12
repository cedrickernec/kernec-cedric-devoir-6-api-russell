// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

export const renderCreateReservationPage = (res, {
    step = "client",
    errors = {},
    globalError = null,
    formData = {},
    hasSearched = false,
    availableCatways = [],
    preselectedCatway = null
}) => {
    res.render("reservations/reservationCreate", {
        title: "Création d'une réservation",
        activePage : "reservations",
        step,
        errors,
        globalError,
        formData,
        hasSearched,
        availableCatways,
        preselectedCatway
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
    res.render("reservations/reservationEdit", {
        title: "Édition d'une réservation",
        activePage : "reservations",
        reservation,
        otherReservations,
        errors,
        globalError,
        formData
    });
};