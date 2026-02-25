/**
 * ===================================================================
 * EXPRESS SESSION CONFIGURATION
 * ===================================================================
 * - Configure express-session
 * - Stockage MongoDB via connect-mongo
 * - Sécurisation des cookies selon l'environnement
 * - Durée de session centralisée
 * ===================================================================
 */

import session from "express-session";
import MongoStore from "connect-mongo";
import ms from "ms";

// ==================================================
// ENVIRONMENT DETECTION
// ==================================================

const isProduction = process.env.NODE_ENV === "production";

// ==================================================
// ENVIRONMENT SAFETY CHECK
// ==================================================

// Clé secrète de session
if (!process.env.SESSION_SECRET) {
    const msg = "SESSION_SECRET manquant dans .env";
    if (process.env.NODE_ENV === "production") throw new Error(msg);
    console.warn(msg);
}

// Connexion MongoDB
if (!process.env.MONGO_URI) {
    const msg = "MONGO_URI manquant dans .env";
    if (isProduction) throw new Error(msg);
    console.warn(msg);
}

// ==================================================
// SESSION TIMING
// ==================================================

const SESSION_DURATION = ms(process.env.SESSION_DURATION || "1h");

// ==================================================
// SESSION MIDDLEWARE
// ==================================================
/**
 * Middleware Express de gestion de session.
 *
 * - Configure express-session
 * - Stocke les sessions en base MongoDB via connect-mongo
 * - Sécurise les cookies selon l'environnement (production / dev)
 * - Centralise la durée de session
 * - Active le mode "rolling" (renouvellement à chaque requête)
 *
 * @type {import("express").RequestHandler}
 */
export const sessionMiddleware = session({
    name: "russell.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions",
    }),
    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "strict" : "lax",
        maxAge: SESSION_DURATION,
    },
    // Renouvellement de la durée à chaque requête
    rolling: true
})

// ==================================================
// SHARED EXPORTS
// ==================================================
/**
 * Informations liées à l'environnement d'exécution.
 *
 * - isProduction : indique si l'application tourne en production
 *
 * @type {{ isProduction: boolean }}
 */
export const environment = {
    isProduction,
};

/**
 * Durée maximale d'une session (en millisecondes).
 *
 * Utilisée pour synchroniser la logique côté serveur et côté client.
 *
 * @type {number}
 */
export const sessionMaxAge = SESSION_DURATION;