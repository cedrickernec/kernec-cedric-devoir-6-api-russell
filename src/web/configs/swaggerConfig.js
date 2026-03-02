/**
 * SWAGGER CONFIGURATION
 * =========================================================================================
 * @module swaggerConfig
 *
 * Configure Swagger UI avec support multi-fichiers OpenAPI.
 *
 * Responsabilités :
 * - Charger le fichier openapi.yaml
 * - Résoudre tous les $ref (multi-fichiers)
 * - Exposer l’interface Swagger à /api-docs
 *
 * Dépendances :
 * - swagger-ui-express
 * - yamljs
 * - @apidevtools/swagger-parser
 *
 * Effets de bord :
 * - Expose la documentation interactive Swagger
 */

import path from "path";
import { fileURLToPath } from "url";
import swaggerUi from "swagger-ui-express";
import SwaggerParser from "@apidevtools/swagger-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const openapiPath = path.join(__dirname, "../../docs/openapi.yaml");

export async function setupSwagger(app) {

    // Bundle tous les $ref (multi-fichiers)
    const bundledSpec = await SwaggerParser.bundle(openapiPath);

    // Expose Swagger
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(bundledSpec)
    );
}