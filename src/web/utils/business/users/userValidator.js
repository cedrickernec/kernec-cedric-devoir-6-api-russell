/**
 * ===================================================================
 * VALIDATION RULE - USER PASSWORD
 * ===================================================================
 * Règles de validation du mot de passe utilisateur.
 *
 * - Liste utilisée pour affichage UI
 * - Doit correspondre aux règles de validation backend
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