/**
 * EXPRESS SESSION CONFIGURATION
 * =========================================================================================
 * Configure la gestion de session Express.
 *
 * Responsabilités :
 * - Initialiser express-session
 * - Stocker les sessions en MongoDB (connect-mongo)
 * - Sécuriser les cookies selon l'environnement
 * - Centraliser la durée de session
 *
 * Exports :
 * - sessionMiddleware : middleware de session prêt à brancher sur app.use()
 * - environment      : informations d'environnement (ex: isProduction)
 * - sessionMaxAge    : durée de session (ms), utile pour synchroniser le front
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
 * Paramétrage :
 * - Store MongoDB via connect-mongo
 * - Cookies sécurisés en production
 * - "rolling" activé : prolonge la session à chaque requête
 *
 * @type {Function}
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
 * Informations d'environnement.
 *
 * @type {{ isProduction: boolean }}
 */

export const environment = {
    isProduction,
};

/**
 * Durée maximale d'une session (ms).
 *
 * @type {number}
 */

export const sessionMaxAge = SESSION_DURATION;