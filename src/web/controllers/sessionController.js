/**
 * ===================================================================
 * SESSION CONTROLLER
 * ===================================================================
 * - Prolonge la session express si utilisateur actif
 * ===================================================================
 */

import { tryRefreshToken } from "../utils/refreshToken.js";

export async function keepAlive(req, res) {

    await tryRefreshToken(req);

    req.session.touch?.();

    return res.sendStatus(204);
};