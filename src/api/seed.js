/**
 * DATABASE SEED SCRIPT
 * =========================================================================================
 * @module seed
 *
 * Initialise la base MongoDB avec des données de test.
 *
 * Responsabilités :
 * - Charger des fichiers JSON locaux (catways / reservations)
 * - Se connecter à MongoDB
 * - Purger les collections ciblées
 * - Insérer les données (insertMany)
 *
 * Effets de bord :
 * - Écriture en base (suppression + insertion)
 * - Arrêt du process via process.exit()
 *
 * Pré-requis :
 * - Variables d’environnement chargées (dotenv)
 * - connectDB fonctionnelle
 * - Fichiers JSON accessibles aux chemins attendus
 */


import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/databaseConnection.js";
import Catway from "./models/Catway.js";
import Reservation from "./models/Reservation.js";

dotenv.config();

// =====================================
// PATH RESOLUTION
// =====================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =====================================
// DATA LOADING
// =====================================

const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, "../api/data/catways.json"), "utf-8"));
const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../api/data/reservations.json"), "utf-8"));

/**
 * SEED EXECUTION
 * =========================================================================================
 * Exécute le seed de la base de données.
 *
 * Étapes :
 * 1) Connexion MongoDB
 * 2) Suppression des collections (Catway, Reservation)
 * 3) Insertion des données depuis JSON
 * 4) Arrêt du process (0 si OK, 1 si KO)
 *
 * @async
 * @function seedDatabase
 *
 * @returns {Promise<void>}
 *
 * @throws {Error} Toute erreur de lecture JSON, connexion DB, ou écriture Mongo.
 */
const seedDatabase = async () => {
    try {
        console.info("🌐 Connexion à MongoDB...");
        await connectDB();

        console.info("🧹 Nettoyage des collections...");
        await Reservation.deleteMany();
        await Catway.deleteMany();

        console.info("📥 Insertion des Catways...");
        await Catway.insertMany(catwaysData);

        console.info("📥 Insertion des Reservations...");
        await Reservation.insertMany(reservationsData);

        console.info("✅ Base de donnée remplie avec succès !");
        process.exit();
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error.message);
        process.exit(1);
    }
};

seedDatabase();