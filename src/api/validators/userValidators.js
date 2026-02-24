/**
 * ===================================================================
 * USER VALIDATORS
 * ===================================================================
 * - Validation username, email et password
 * - Validation création et mise à jour utilisateur
 * ===================================================================
 */

// =====================================
// USERNAME VALIDATION
// =====================================
/**
 * Valide un nom d'utilisateur.
 *
 * @function validateUsername
 *
 * @param {string} username
 *
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

  if (!username) {
    return "Le nom d'utilisateur est requis.";
  }

  if (!usernameRegex.test(username)) {
    return "Le nom d'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres, - ou _).";
  }

  return null;
};

// =====================================
// EMAIL VALIDATION
// =====================================
/**
 * Valide un email.
 *
 * @function validateEmail
 *
 * @param {string} email
 *
 * @returns {string|null} - Message d'erreur ou null si valide
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return "L'email est requis.";
  }

  if (!emailRegex.test(email)) {
    return "Format d'email invalide (ex : nom@domaine.com).";
  }

  return null;
};

// =====================================
// PASSWORD VALIDATION
// =====================================
/**
 * Valide un mot de passe selon les règles de sécurité définies.
 *
 * Règles :
 * - 8 caractères minimum
 * - 1 majuscule
 * - 1 minuscule
 * - 1 chiffre
 * - 1 caractère spécial
 *
 * @function validatePassword
 *
 * @param {string} password
 *
 * @returns {{
 *   valid: boolean,
 *   errors: Object|string|null
 * }}
 */
export const validatePassword = (password) => {
  const errors = {
    minLength: "8 caractères minimum requis",
    uppercase: "1 lettre majuscule requise",
    lowercase: "1 lettre minuscule requise",
    number: "1 chiffre requis",
    special: "1 caractère spécial requis"
  };

  if (!password) {
    return { valid: false, errors: "Le mot de passe est requis." };
  }

  const validations = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()\-_=+[\]{};:,.?]/.test(password)
  };

  // Filtrer les règles échouées
  const failedRules = Object.keys(validations).filter(
    (rule) => !validations[rule]
  );

  if (failedRules.length === 0) {
    return { valid: true, errors: null };
  }

  const detailedErrors = {};
  failedRules.forEach((rule) => {
    detailedErrors[rule] = errors[rule];
  });

  return { valid: false, errors: detailedErrors };
};

// =====================================
// USER UPDATE VALIDATION
// =====================================
/**
 * Valide les champs modifiés lors d'une mise à jour utilisateur.
 *
 * @function validateUserUpdate
 *
 * @param {Object} body
 *
 * @returns {Object} errors
 */
export function validateUserUpdate(body) {
  const errors = {};

  const { username, email, password } = body;

  // Username modifié ?
  if (username !== undefined) {
    const usernameError = validateUsername(username);
    if (usernameError) errors.username = usernameError;
  }

  // Email modifié ?
  if (email !== undefined) {
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
  }

  // Password modifié ?
  if (password !== undefined) {
    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;
  }

  return errors
};

// =====================================
// USER CREATE VALIDATION
// =====================================
/**
 * Valide les données de création d'un utilisateur.
 *
 * @function validateUserCreate
 *
 * @param {Object} options
 * @param {string} options.username
 * @param {string} options.email
 * @param {string} options.password
 *
 * @returns {Object} errors
 */
export function validateUserCreate({ username, email, password }) {
  const errors = {};

  // Username
  const usernameError = validateUsername(username);
  if (usernameError) {
    errors.username = usernameError;
  }
  // Email
  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }
  // Password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.errors;
  }

  return errors;
};