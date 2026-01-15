/**
 * ===================================================================
 * FORM CONTROLLER - RESERVATIONS
 * ===================================================================
 * - Gestion des erreurs de formulaire
 * - Redirections + flash messages
 * ===================================================================
 */

import Reservation from "../../../api/models/Reservation.js";
import Catway from "../../../api/models/Catway.js";
import { RESERVATION_MESSAGES } from "../../../../public/js/messages/reservationMessage.js";
import { getReservationConflicts } from "../../utils/reservations/reservationConflict.js";
import { getAvailableCatways } from "../../utils/reservations/getAvailableCatway.js";
import {
    mapAvailabilityToTable,
    mapReservationToList,
    mapReservationEdit
} from "../../utils/reservations/reservationMapper.js";
import { normalizeDateRange } from "../../utils/normalizeDateRange.js";
import { validateReservationDates } from "../../utils/reservations/validateReservationDates.js";

// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

const renderCreateReservationPage = (res, {
    step = "client",
    errors = {},
    formData = {},
    hasSearched = false,
    availableCatways = []
}) => {
    res.render("reservations/reservationCreate", {
        title: "Création d'une réservation",
        activePage: "reservations",
        step,
        errors,
        formData,
        hasSearched,
        availableCatways
    });
};


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

        // Validation client
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

            req.session.reservationDraft = {
                clientName,
                boatName
            }

            return renderCreateReservationPage(res, {
                step: "dates",
                formData: req.session.reservationDraft
            });
        }

        // Validation dates
        const dateCheck = validateReservationDates({
            startDate,
            endDate,
            messages: {
                DATES_REQUIRED: RESERVATION_MESSAGES.DATES_REQUIRED,
                INVALID_DATES: RESERVATION_MESSAGES.INVALID_DATES
            }
        });

        if (!dateCheck.isValid) {
            return renderCreateReservationPage(res, {
                step: "dates",
                errors: dateCheck.errors,
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

                // Réservation complète
                if (parts.length === 1) {
                    const catwayNumber = Number(parts[0]);

                    const catway = await Catway.findOne({ catwayNumber });
                    if (!catway) {
                        throw new Error(`Catway ${catwayNumber} introuvable`);
                    }

                    const reservation = await Reservation.create({
                        clientName,
                        boatName,
                        catwayNumber: catway.catwayNumber,
                        catwayType: catway.catwayType,
                        startDate,
                        endDate
                    });

                    createdReservations.push(reservation);
                    continue;
                }

                // Réservation partielle
                const [catwayNumberRaw, from, to] = parts;
                const catwayNumber = Number(catwayNumberRaw);

                const catway = await Catway.findOne({ catwayNumber });
                if (!catway) {
                    throw new Error(`Catway ${catwayNumber} introuvable`);
                }

                const reservation = await Reservation.create({
                    clientName,
                    boatName,
                    catwayNumber: catway.catwayNumber,
                    catwayType: catway.catwayType,
                    startDate: new Date(from),
                    endDate: new Date(to)
                });

                createdReservations.push(reservation);
            }

            req.session.flash = {
                type: "success",
                message: `${createdReservations.length} réservation(s) créée(s) avec succès`,
                highlightIds: createdReservations.map(r => r._id.toString())
            };

            delete req.session.reservationDraft;
            return res.redirect("/reservations");
        }

        // Recherche
        const normalizedStart = normalizeDateRange(startDate, "start");
        const normalizedEnd = normalizeDateRange(endDate, "end");

        const allowPartialBool = allowPartial === "on";

        const relevantReservations = await Reservation.find({
            startDate: { $lte: new Date(normalizedEnd) },
            endDate: { $gte: new Date(normalizedStart) }
        });

        const allCatways = await Catway.find().sort({ catwayNumber: 1 });

        const availableCatways = getAvailableCatways({
            catways: allCatways,
            reservations: relevantReservations,
            startDate: normalizedStart,
            endDate: normalizedEnd,
            allowPartial: allowPartialBool,
            selectedType
        });

        const mappedCatways = availableCatways.map(({ catway, compatibility }) =>
            mapAvailabilityToTable({
                catway,
                compatibility
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