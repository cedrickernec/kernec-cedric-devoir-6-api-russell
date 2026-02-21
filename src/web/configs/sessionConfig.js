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

const SESSION_DURATION = ms(process.env.SESSION_DURATION || "30m");

// ==================================================
// SESSION MIDDLEWARE
// ==================================================

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

export const environment = {
    isProduction,
};

export const sessionMaxAge = SESSION_DURATION;