import { ApiError } from "./apiError.js";

export const pickAllowedFields = (body, allowedFields) => {
  const receivedFields = Object.keys(body);

  const invalidFields = receivedFields.filter(
    field => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    throw new ApiError(
      400,
      `Champ(s) non autorisé(s) : ${invalidFields.join(", ")}.`
    );
  }

  // Retourner seulement les champs autorisés
  return Object.fromEntries(
    Object.entries(body).filter(([key]) =>
      allowedFields.includes(key)
    )
  );
};