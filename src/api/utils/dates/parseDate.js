/**
 * ===================================================================
 * PARSE DATE
 * ===================================================================
 * - Sécurise les entrées de type date :
 *      - Convertit une date fournie en objet date
 *      - Vérifie le format
 *      - Rejète les dates invalides
 * ===================================================================
 */

import { ApiError } from "../errors/apiError.js";

const RESERVATION_HOUR = 6;

export const parseDate = (dateStr) => {

    // 1) Type
    if (typeof dateStr !== "string") {
        throw ApiError.validation(
            "Format de date invalide. Format attendu : YYYY-MM-DD."
        );
    }

    const raw = dateStr.trim();

    // 2) Format strict
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = raw.match(regex);

    if (!match) {
        throw ApiError.validation(
            "Format de date invalide. Format attendu : YYYY-MM-DD."
        );
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
        let message = "Date invalide : ";

        if (errors.length === 1) {
            message += `le ${errors[0]} est incorrect.`;
        } else {
            message += "le mois et le jour sont incorrects.";
        }

        throw ApiError.validation(
            message
        );
    }

    // 6) Date valide
    return new Date(Date.UTC(year, month - 1, day, RESERVATION_HOUR));
};