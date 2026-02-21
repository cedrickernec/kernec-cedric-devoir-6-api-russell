/**
 * ===================================================================
 * DATABASE SEED SCRIPT
 * ===================================================================
 * - Initialise la base MongoDB avec des données de test
 * - Supprime les collections existantes
 * - Insère catways et réservations
 * ===================================================================
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
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

// =====================================
// SEED EXECUTION
// =====================================

const seedDatabase = async () => {
    try {
        console.info("🌐 Connexion à MongoDB...");
        await connectDB();

        console.info("🧹 Nettoyage des collections...");
        await Catway.deleteMany();
        await Reservation.deleteMany();

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