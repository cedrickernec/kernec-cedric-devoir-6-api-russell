import { tryRefreshToken } from "../utils/api/refreshToken.js";

/**
 * SESSION KEEP ALIVE
 * =========================================================================================
 * Maintient la session active côté serveur.
 *
 * - Tente un refresh du token JWT si nécessaire
 * - Rafraîchit la session Express
 *
 * @async
 * @function keepAlive
 *
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 *
 * @returns {Promise<void>}
 */
export async function keepAlive(req, res) {

    await tryRefreshToken(req);

    req.session.touch?.();

    return res.sendStatus(204);
};