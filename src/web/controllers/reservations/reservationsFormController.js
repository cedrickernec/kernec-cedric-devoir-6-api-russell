/**
 * ===================================================================
 * FORM CONTROLLER - RESERVATIONS
 * ===================================================================
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 * ===================================================================
 */

import { handleAuthExpired } from "../../middlewares/authExpiredHandler.js";

import {
    createReservation,
    deleteReservation,
    fetchReservationAvailability,
    fetchReservationById,
    updateReservation
} from "../../services/api/reservationApi.js";

import {
    renderCreateReservationPage,
    renderEditReservationPage
} from "../../views/helpers/reservationsViewHelper.js";

import {
    mapAvailabilityToTable,
    mapReservationEdit
} from "../../utils/reservations/reservationMapper.js";

import { handleApiError } from "../../utils/apiErrorHandler.js";
import { loadOtherReservations } from "../../utils/reservations/loadOtherReservations.js";

import { RESERVATION_MESSAGES } from "../../../../public/js/messages/reservationMessage.js";
import { COMMON_MESSAGES } from "../../../../public/js/messages/commonMessages.js";

// ==================================================
// CREATE RESERVATION
// ==================================================

export const postCreateReservation = async (req, res, next) => {
    try {
        const {
            step,
            clientName,
            boatName,
            catwayType,
            startDate,
            endDate,
            allowPartial,
            catways
        } = req.body;

        const errors = {};

        const selectedType = catwayType && catwayType !== "all"
            ? catwayType
            : null;

        // STEP 1 : Validation client
        if (step === "client") {
            if (!clientName?.trim()) {
                errors.clientName = RESERVATION_MESSAGES.CLIENT_REQUIRED;
            }

            if (!boatName?.trim()) {
                errors.boatName = RESERVATION_MESSAGES.BOAT_REQUIRED;
            }

            if (Object.keys(errors).length > 0) {
                return renderCreateReservationPage(res, {
                    step: "client",
                    errors,
                    formData: req.body
                });
            }

            // Sauvegarde brouillon
            req.session.reservationDraft = {
                clientName,
                boatName
            }

            return renderCreateReservationPage(res, {
                step: "dates",
                formData: req.session.reservationDraft
            });
        }

        // STEP 2 : Dates
        if (!startDate || !endDate) {
            return renderCreateReservationPage(res, {
                step: "dates",
                errors: {
                    date: RESERVATION_MESSAGES.DATES_REQUIRED
                },
                formData: req.body,
                hasSearched: false,
                availableCatways: []
            });
        }

        // Création
        if (Array.isArray(catways) && catways.length > 0) {
            const createdReservations = [];

            for (const rawSelection of catways) {
                const parts = rawSelection.split("|");

                let catwayNumber;
                let payload;

                // Réservation complète
                if (parts.length === 1) {
                    catwayNumber = Number(parts[0]);

                    payload = {
                        clientName,
                        boatName,
                        startDate,
                        endDate
                    };
                }

                // Réservation partielle
                else {
                    const [number, from, to] = parts;

                    catwayNumber = Number(number);

                    payload = {
                        clientName,
                        boatName,
                        startDate: from,
                        endDate: to
                    };
                }

                const apiData = await createReservation(catwayNumber, payload, req, res);

                if (handleAuthExpired(apiData, req, res)) return;

                if (apiData.success === false) {

                    // Erreur de champs
                    if (apiData.errors && Object.keys(apiData.errors).length > 0) {
                        return renderCreateReservationPage(res, {
                            step: "dates",
                            errors: apiData.errors,
                            formData: req.body,
                            hasSearched: true,
                            availableCatways: []
                        });
                    }

                    // Erreur métier
                    if (apiData.message) {
                        return renderCreateReservationPage(res, {
                            step: "dates",
                            globalError: apiData.message,
                            formData: req.body,
                            hasSearched: true,
                            availableCatways: []
                        });
                    }

                    // Fallback sécurité
                    return renderCreateReservationPage(res, {
                        step: "dates",
                        globalError: "Erreur lors de la création de la réservation.",
                        formData: req.body,
                        hasSearched: true,
                        availableCatways: []
                    });
                }

                createdReservations.push(apiData.data.reservation);
            }

            req.session.flash = {
                type: "success",
                message: `${createdReservations.length} réservation(s) créée(s) avec succès`,
                highlightIds: createdReservations.map(r => r.id.toString())
            };

            delete req.session.reservationDraft;
            return res.redirect("/reservations");
        }

        // Recherche
        const availabilityPayload = {
            startDate,
            endDate,
            catwayType: selectedType ?? "all",
            allowPartial : allowPartial === "on"
        }

        const apiData = await fetchReservationAvailability(availabilityPayload, req, res);

        if (handleAuthExpired(apiData, req, res)) return;

        if (!apiData.success) {
            return renderCreateReservationPage(res, {
                step: "dates",
                formData: req.body,
                hasSearched: false,
                errors: {},
                globalError: apiData.message || "Erreur lors de la recherche de disponibilité."
            })
        }

        const mappedCatways = apiData.data.map(item =>
            mapAvailabilityToTable({
                catway: item.catway,
                availability: item.availability
            })
        );

        return renderCreateReservationPage(res, {
            step: "dates",
            formData: req.body,
            hasSearched: true,
            availableCatways: mappedCatways
        });

    } catch (error) {
        next(error);
    }
};

// ==================================================
// CANCEL CREATE RESERVATION
// ==================================================

export const cancelCreateReservation = (req, res) => {
    // Nettoyage complet du brouillon
    delete req.session.reservationDraft;

    res.redirect("/reservations");
};

// ==================================================
// EDIT RESERVATION
// ==================================================

export const postEditReservation = async (req, res, next) => {
    try {
        const { id, catwayNumber } = req.params;

        const { clientName, boatName, startDate, endDate } = req.body;

        const payload = {
            clientName,
            boatName,
            startDate,
            endDate
        };
        
        const apiData = await updateReservation(
            catwayNumber,
            id,
            payload,
            req,
            res
        );

        if (handleAuthExpired(apiData, req, res)) return;

        if (apiData.success === true) {

            req.session.flash = {
                type: "success",
                message: RESERVATION_MESSAGES.UPDATE_SUCCESS
            };

            return res.redirect(`/catways/${catwayNumber}/reservations/${id}`);
        }

        // ===== GESTION DES ERREURS =====

        const apiReservation = await fetchReservationById(catwayNumber, id, req, res);

        if (handleAuthExpired(apiReservation, req, res)) return;

        const otherReservations = await loadOtherReservations(catwayNumber, id, req, res);

        if (!apiReservation.success || !apiReservation.data) {
            return next(new Error(RESERVATION_MESSAGES.NOT_FOUND));
        }

        const reservationView = mapReservationEdit(apiReservation.data);

        const reservation = {
            ...reservationView,
            clientName: req.body.clientName,
            boatName: req.body.boatName,
            startDateISO: req.body.startDate,
            endDateISO: req.body.endDate    
        }

        const errors = apiData.errors || {};

        // Erreur de champs
        if (Object.keys(errors).length > 0) {
            return renderEditReservationPage(res, {
                reservation,
                errors,
                otherReservations
            });
        }

        // Erreur métier
        if (apiData.message) {
            let businessErrors = {};

            if (reservation.isStartDateLocked) {
                businessErrors = {
                    endDate: apiData.message
                };
            } else {
                businessErrors = {
                    startDate: apiData.message,
                    endDate: apiData.message,
                };
            }

            return renderEditReservationPage(res, {
                reservation,
                errors: businessErrors,
                globalError: apiData.message,
                otherReservations
            });
        }

        // Fallback sécurité
        return renderEditReservationPage(res, {
            reservation,
            globalError: COMMON_MESSAGES.SERVER_ERROR_LONG,
            otherReservations
        });

    } catch (error) {
        next(error);
    }
};

// ==================================================
// DELETE RESERVATION
// ==================================================

export const deleteReservationAction = async (req, res, next) => {
    try {
        const { id, catwayNumber } = req.params;
        const password = req.body?.password || null;

        const apiResponse = await deleteReservation(catwayNumber, id, req, res, password);

        if (handleAuthExpired(apiResponse, req, res)) return;

        if (!handleApiError(apiResponse, req, res)) return;

        // MODE AJAX
        if (req.headers.accept?.includes("application/json")) {
            return res.status(200).json({
                success: true
            });
        }

        // MODE CLASSIQUE HTML
        req.session.flash = {
            type: "success",
            message: RESERVATION_MESSAGES.DELETE_SUCCESS,
        };

        return res.redirect("/reservations");

    } catch (error) {
        next(error);
    }
};