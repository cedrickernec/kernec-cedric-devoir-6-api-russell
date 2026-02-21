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