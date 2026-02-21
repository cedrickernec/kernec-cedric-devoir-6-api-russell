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
    res.render("reservations/create", {
        title: "Création d'une réservation",
        activePage : "reservations",
        bodyClass: "scroll-components create-page",
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
    res.render("reservations/edit", {
        title: "Édition d'une réservation",
        activePage : "reservations",
        bodyClass: "scroll-components edit-page",
        reservation,
        otherReservations,
        errors,
        globalError,
        formData
    });
};