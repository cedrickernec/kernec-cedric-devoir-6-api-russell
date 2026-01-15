import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "../config/db.js";
import Catway from "../models/Catway.js";
import Reservation from "../models/Reservation.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/catways.json"), "utf-8"));
const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/reservations.json"), "utf-8"));

const seedDatabase = async () => {
    try {
        console.log("🌐 Connexion à MongoDB...");
        await connectDB();

        console.log("🧹 Nettoyage des collections...");
        await Catway.deleteMany();
        await Reservation.deleteMany();

        console.log("📥 Insertion des Catways...");
        await Catway.insertMany(catwaysData);

        console.log("📥 Insertion des Reservations...");
        await Reservation.insertMany(reservationsData);

        console.log("✅ Base de donnée remplie avec succès !");
        process.exit();
    } catch (error) {
        console.error("❌ Erreur lors du seed :", error.message);
        process.exit(1);
    }
};

seedDatabase();