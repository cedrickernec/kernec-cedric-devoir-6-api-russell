/**
 * ===================================================================
 * SESSION CONTROLLER
 * ===================================================================
 * - Maintient la session active côté serveur
 * - Tente un refresh JWT si nécessaire
 * ===================================================================
 */

import { tryRefreshToken } from "../utils/api/refreshToken.js";

// ==================================================
// SESSION KEEP ALIVE
// ==================================================

export async function keepAlive(req, res) {

    await tryRefreshToken(req);

    req.session.touch?.();

    return res.sendStatus(204);
};