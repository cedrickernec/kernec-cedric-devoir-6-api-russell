/**
 * VIEW HELPER - CREATE PAGE RENDER
 * =========================================================================================
 * Rend la page de création d'une réservation.
 *
 * - Gère le système multi-step
 * - Injecte les résultats de recherche de disponibilité
 * - Centralise les erreurs et données formulaire
 *
 * @function renderCreateReservationPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {string} [params.step="client"]
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 * @param {Object} [params.formData]
 * @param {boolean} [params.hasSearched=false]
 * @param {Object[]} [params.availableCatways]
 * @param {Object|null} [params.preselectedCatway]
 *
 * @returns {void}
 */

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

/**
 * VIEW HELPER - EDIT PAGE RENDER
 * =========================================================================================
 * Rend la page d'édition d'une réservation.
 *
 * - Injecte la réservation principale
 * - Injecte les autres réservations associées
 * - Centralise erreurs et données formulaire
 *
 * @function renderEditReservationPage
 *
 * @param {Object} res - Réponse Express
 * @param {Object} params
 * @param {Object} params.reservation
 * @param {Object[]} [params.otherReservations]
 * @param {Object} [params.errors]
 * @param {string|null} [params.globalError]
 * @param {Object} [params.formData]
 *
 * @returns {void}
 */

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