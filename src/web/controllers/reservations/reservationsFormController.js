/**
 * ===================================================================
 * FORM CONTROLLER - RESERVATIONS
 * ===================================================================
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 * ===================================================================
 */

import Reservation from "../../../api/models/Reservation.js";

import {
    mapAvailabilityToTable,
    mapReservationToList,
    mapReservationEdit
} from "../../utils/reservations/reservationMapper.js";

import { createReservation, fetchReservationAvailability } from "../../services/api/reservationApi.js";
import { normalizeDateRange } from "../../utils/normalizeDateRange.js";
import { validateReservationDates } from "../../utils/reservations/validateReservationDates.js";
import { RESERVATION_MESSAGES } from "../../../../public/js/messages/reservationMessage.js";
import { renderCreateReservationPage } from "../../views/helpers/reservationsViewHelper.js";

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

                if (apiData?.authExpired) return;

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

        if (apiData?.authExpired) return;

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
        const { id } = req.params;
        const { clientName, boatName, startDate, endDate } = req.body;

        const errors = {};

        const reservation = await Reservation.findById(id);
        if (!reservation) {
            return next(new Error(RESERVATION_MESSAGES.NOT_FOUND));
        }

        const now = new Date();
        const originalStartDate = reservation.startDate
        ? new Date(reservation.startDate)
        : null;

        const isStartDateLocked =
        originalStartDate && originalStartDate <= now;

        const effectiveStartDate = isStartDateLocked ? reservation.startDate : startDate;

        // Validations
        if (!clientName?.trim()) {
            errors.clientName = RESERVATION_MESSAGES.CLIENT_REQUIRED;
        }

        if (!boatName?.trim()) {
            errors.boatName = RESERVATION_MESSAGES.BOAT_REQUIRED;
        }

        const dateCheck = validateReservationDates({
            startDate: effectiveStartDate,
            endDate,
            originalStartDate: reservation.startDate,
            now: new Date(),
            messages: {
                DATES_REQUIRED: RESERVATION_MESSAGES.DATES_REQUIRED,
                INVALID_DATES: RESERVATION_MESSAGES.INVALID_DATES
            }
        });

        if (!dateCheck.isValid) {
            Object.assign(errors, dateCheck.errors);
        }
        
        const isShorteningReservation =
        isStartDateLocked &&
        reservation.endDate &&
        new Date(endDate) <= new Date(reservation.endDate);

        // Conflit de réservation
        if (!errors.startDate && !errors.endDate && !isShorteningReservation) {
            const conflicts = await getReservationConflicts({
                catwayNumber: reservation.catwayNumber,
                startDate: isStartDateLocked
                ? reservation.startDate
                : startDate,
                endDate,
                excludeId: id
            });

            if (conflicts.length > 0) {
                const start = normalizeDateRange(isStartDateLocked
                    ? reservation.startDate
                    : startDate,
                    "start"
                );
                const end = normalizeDateRange(endDate, "end");

                const startConflict =
                conflicts.some(r =>
                    start >= new Date(r.startDate) &&
                    start <= new Date(r.endDate)
                );
                const endConflict =
                conflicts.some(r =>
                    end >= new Date(r.startDate) &&
                    end <= new Date(r.endDate)
                );

                if (startConflict) {
                    errors.startDate = RESERVATION_MESSAGES.DATE_CONFLICT;
                }

                if (endConflict) {
                    errors.endDate = RESERVATION_MESSAGES.DATE_CONFLICT;
                }

                if (!startConflict && !endConflict) {
                    errors.endDate = RESERVATION_MESSAGES.DATE_CONFLICT;
                }
            }
        }

        // Erreurs → retour formulaire
        if (Object.keys(errors).length > 0) {
            const otherReservations = await Reservation.find({
                catwayNumber: reservation.catwayNumber,
                _id: {$ne: reservation._id}
            }).sort({ startDate: 1 });

            return res.render("reservations/reservationEdit", {
                title: "Éditer une réservation",
                activePage: "reservations",

                reservation: mapReservationEdit(reservation),
                otherReservations: otherReservations.map(mapReservationToList),

                errors,
                formData: req.body
            });
        }

        // update
        reservation.clientName = clientName;
        reservation.boatName = boatName;
        reservation.endDate = endDate;

        if (!isStartDateLocked) {
            reservation.startDate = startDate;
        }

        await reservation.save();

        // Flash + redirect
        req.session.flash = {
            type: "success",
            message: RESERVATION_MESSAGES.UPDATE_SUCCESS
        };

        res.redirect("/reservations");

    } catch (error) {
        next(error);
    }
};