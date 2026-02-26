/**
 * SESSION AJAX ROUTES (WEB)
 * =========================================================================================
 * @module sessionAjaxRoutes
 *
 * Routeur AJAX lié à la gestion de session.
 *
 * - Permet le rafraîchissement manuel de session
 * - Utilisé par le système d’expiration côté client
 * - Protégé par authGuard
 *
 * Route :
 * POST /refresh-session
 */

import express from "express";
import { authGuard } from "../middlewares/auth/authGuard.js";

const router = express.Router();

router.post("/refresh-session", authGuard, (req, res) => {
    if (!req.session) {
        return res.status(400).json({ ok: false });
    }

    req.session.touch();

    return res.json({ ok: true });
});