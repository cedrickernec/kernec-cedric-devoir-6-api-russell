/**
 * ===================================================================
 * SESSION AJAX ROUTES (WEB)
 * ===================================================================
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

export default router;