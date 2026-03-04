/**
 * PARSE DATE
 * =========================================================================================
 * @module parseDate
 *
 * Sécurise les entrées de type date (format strict YYYY-MM-DD).
 *
 * Fonctionnalités :
 * - Validation du type et du format
 * - Validation de cohérence mois/jour
 * - Retourne une Date UTC normalisée (heure fixée pour cohérence métier)
 *
 * Dépendances :
 * - ApiError (erreurs normalisées)
 *
 * Sécurité :
 * - Rejette toute entrée non conforme (validation stricte)
 *
 * Effets de bord :
 * - Peut lever une ApiError en cas de format invalide
 */

import { ApiError } from "../errors/apiError.js";

const RESERVATION_HOUR = 6;

/**
 * PARSE DATE
 * =========================================================================================
 * Parse et valide une date au format strict YYYY-MM-DD.
 *
 * @function parseDate
 *
 * @param {string} dateStr Date au format YYYY-MM-DD
 *
 * @returns {Date}
 *
 * @throws {ApiError} 400 Format invalide ou date incohérente
 */

export const parseDate = (dateStr) => {

    // 1) Type
    if (typeof dateStr !== "string") {
        throw ApiError.validation({
            dates: "Format de date invalide. Format attendu : YYYY-MM-DD."
        });
    }

    const raw = dateStr.trim();

    // 2) Format strict
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = raw.match(regex);

    if (!match) {
        throw ApiError.validation({
            dates: "Format de date invalide. Format attendu : YYYY-MM-DD."
        });
    }

    // 3) Extraction
    const year  = Number(match[1]);
    const month = Number(match[2]);
    const day   = Number(match[3]);

    // 4) Validation date
    const errors = [];

    if (month < 1 || month > 12) {
        errors.push("mois");
    }

    const daysInMonth =
        month >= 1 && month <= 12
        ? new Date(year, month, 0).getDate()
        : 31;

    if (day < 1 || day > daysInMonth) {
        errors.push("jour");
    }

    // 5) Date invalide
    if (errors.length > 0) {

        if (errors.length === 1) {
            throw ApiError.validation({
                dates: `Le ${errors[0]} est incorrect.`
            });
        } else {
            throw ApiError.validation({
                dates: "Le mois et le jour sont incorrects."
            });
        }
    }

    // 6) Date valide
    return new Date(Date.UTC(year, month - 1, day, RESERVATION_HOUR));
};