/**
 * USER PASSWORD RULES (WEB)
 * =========================================================================================
 * @module userValidator
 *
 * Règles de validation du mot de passe côté Web.
 *
 * Responsabilités :
 * - Fournir la liste des règles affichées en UI
 * - Rester synchronisé avec la validation backend
 */

/**
 * PASSWORD_RULES
 * =========================================================================================
 * Liste des règles de mot de passe affichées côté interface.
 *
 * @constant {string[]}
 */

export const PASSWORD_RULES = [
  "8 caractères minimum requis",
  "1 lettre majuscule requise",
  "1 lettre minuscule requise",
  "1 chiffre requis",
  "1 caractère spécial requis"
];