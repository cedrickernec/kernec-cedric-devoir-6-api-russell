import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const catwaysData = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/catways.json"), "utf-8"));
const reservationsData = JSON.parse(fs.readFileSync(path.join(__dirname, "../../data/reservations.json"), "utf-8"));

export const seedDatabase = async () => {
    try {
        console.log("Début du script de seed..."),

        console.log("Seed terminé !");
        process.exit();
    } catch (error) {
        console.error("Erreur lors du seed :", error.message);
        process.exit(1);
    } 
};

import { connectDB } from "../config/db";
import dotenv from "dotenv";

dotenv.config();
connectDB();

seedDatabase();