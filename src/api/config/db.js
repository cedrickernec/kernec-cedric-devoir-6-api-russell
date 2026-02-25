/**
 * ===================================================================
 * DATABASE CONNECTION
 * ===================================================================
 * - Initialise la connexion MongoDB via Mongoose
 * ===================================================================
 * Responsabilité :
 *      - Établir la connexion à la base de donnée
 *      - Logger le statut de connexion
 *      - Stopper l'application en cas d'échec critique
 * ===================================================================
 * Utilisation :
 *      - Appelé au démarrage du serveur
 * ===================================================================
 */

import mongoose from "mongoose";

/**
 * Initialise la connexion MongoDB via Mongoose.
 *
 * - Utilise la variable d'environnement MONGO_URI
 * - Log le statut de connexion
 * - Stoppe le processus en cas d'échec critique
 *
 * @async
 * @function connectDB
 *
 * @returns {Promise<void>}
 */
export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.info("🌐 Connexion MongoDB réussie")
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB", error.message);
        process.exit(1);
    }
};

export default connectDB;