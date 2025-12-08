import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";

import catwayRoutes from "./routes/catwayRoutes.js";
import reservationGlobalRoutes from "./routes/reservationGlobalRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationGlobalRoutes);
app.use("/api/users", userRoutes);

// Route d'accueil pour vérification du serveur
app.get("/", (req, res) => {
    res.send("API Russell - Serveur opérationnel");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});