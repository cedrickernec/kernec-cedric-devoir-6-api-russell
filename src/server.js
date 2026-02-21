/**
 * ===================================================================
 * APPLICATION ENTRY POINT
 * ===================================================================
 * - Initialise l'application Express
 * - Configure la base de données
 * - Enregistre les middlewares globaux
 * - Monte les routes WEB et API
 * - Centralise la gestion des erreurs
 * ===================================================================
 */

// ============================================
// BOOTSTRAP & ENV.
// ============================================

import "dotenv/config";

// ============================================
// DATABASE
// ============================================

import { connectDB } from "./api/config/db.js";
connectDB();

// ============================================
// CORE DEPENDENCIES
// ============================================

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";

// ============================================
// APPLICATION MIDDLEWARE
// ============================================

import sidebarClock from "./web/middlewares/ui/sidebarClock.js";
import { sessionMiddleware } from "./web/configs/sessionConfig.js";
import { exposeSessionData } from "./web/middlewares/session/sessionExpose.js";
import { rememberLastPath } from "./web/middlewares/session/rememberLastPath.js";
import { normalizeRequest } from "./web/middlewares/request/normalizeRequest.js";
import { exposeFlash } from "./web/middlewares/ui/flashExpose.js";

// ============================================
// ROUTES
// ============================================

import { registerWebRoutes } from "./web/routes/index.js";
import { registerApiRoutes } from "./api/routes/index.js";

// ============================================
// ERROR HANDLING
// ============================================

import { webNotFoundHandler, webErrorHandler } from "./web/middlewares/errors/webErrorHandler.js";
import { apiNotFoundHandler, apiErrorHandler } from "./api/middlewares/apiErrorHandler.js";

// ============================================
// APP INIT.
// ============================================

const app = express();

// ============================================
// PROXY CONFIG. (prod.)
// ============================================

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
}

// ============================================
// TEMPLATE ENGINE CONFIG.
// ============================================

app.use(expressLayouts);
app.set("layout", "layouts/appLayout"); // → Layout par défaut

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "web/views"));

// ============================================
// GLOBAL MIDDLEWARES
// ============================================

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(normalizeRequest);
app.use(express.static("public")); // Fichier statique → accessible via /css, /js, /images
app.use(sidebarClock);

// ============================================
// SESSION & UI MIDDLEWARES
// ============================================

app.use(sessionMiddleware);
app.use(exposeSessionData);
app.use(rememberLastPath);
app.use(exposeFlash);

// ============================================
// ROUTES
// ============================================

registerWebRoutes(app);
registerApiRoutes(app);

// ============================================
// ERROR HANDLERS
// ============================================

/* app.use("/api", apiNotFoundHandler); // 404 - route inexistante
app.use("/api", apiErrorHandler); // 500 - Erreur serveur
app.use(webNotFoundHandler); // 404 - route inexistante
app.use(webErrorHandler); // 500 - Erreur serveur */

// ============================================
// SERVER START
// ============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.info(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});