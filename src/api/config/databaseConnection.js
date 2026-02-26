/**
 * DATABASE CONNECTION
 * =========================================================================================
 * @module databaseConnection
 *
 * Gère l'initialisation de la connexion MongoDB via Mongoose.
 *
 * Responsabilités :
 * - Établir la connexion à la base de données
 * - Journaliser le statut de connexion
 * - Stopper le processus en cas d'échec critique
 *
 * Déclenché par :
 * - Le bootstrap serveur au démarrage de l'application
 *
 * Sécurité :
 * - Utilise la variable d'environnement MONGO_URI
 *
 * Effets de bord :
 * - Ouverture d'une connexion réseau vers MongoDB
 * - Arrêt complet du processus Node.js en cas d'échec
 */

import mongoose from "mongoose";

/**
 * CONNECT DATABASE
 * =========================================================================================
 * Initialise la connexion MongoDB.
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