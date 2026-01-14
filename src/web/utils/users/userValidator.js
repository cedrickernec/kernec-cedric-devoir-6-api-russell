/**
 * --------------------------------------------------------------------
 * Règle de validation - Mot de passe utilisateur
 * --------------------------------------------------------------------
 * - Liste centralisée des règles de sécurité du mot de passe
 * - Utilisé côté serveur et côté client
 * - Garantit la cohérence des messages de validation
 */

export const PASSWORD_RULES = [
  "8 caractères minimum requis",
  "1 lettre majuscule requise",
  "1 lettre minuscule requise",
  "1 chiffre requis",
  "1 caractère spécial requis"
];