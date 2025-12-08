import Catway from "../models/Catway.js";
import { validateCatwayData } from "../utils/validators/catwayValidators.js";
import mongoose from "mongoose";

// ===============================
// RÉCUPÉRER TOUS LES CATWAYS
// ===============================
export const getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ===============================
// RÉCUPÉRER UN CATWAY UNIQUE PAR ID
// ===============================
export const getCatwayById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Catway introuvable."});
        }
        
        const catway = await Catway.findById(id);

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable." });
        }

        res.status(200).json(catway);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ===============================
// CRÉER UN CATWAY
// ===============================
export const createCatway = async (req, res) => {
    try {
        // 1) Validation
        const errors = validateCatwayData(req.body);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Données invalides", errors });
        }

        // 2) Création
        const newCatway = await Catway.create(req.body);

        // 3) Réponse → Succès
        res.status(201).json({
            message: "Catway créé avec succès.",
            catway: newCatway
        });

    } catch (error) {
        // Numéro de catway déjà utilisé
        if (error.code === 11000 && error.keyPattern?.catwayNumber) {

            // Récupérer le catway existant
            const existing = await Catway.findOne({ catwayNumber: req.body.catwayNumber });

            return res.status(400).json({
                message: "Un catway avec ce numéro existe déjà.",
                existingCatway: existing
            });
        }

        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ===============================
// MODIFIER UN CATWAY
// ===============================
export const updateCatway = async (req, res) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Catway introuvable."});
        }

        // 1) Empêcher la modification du numéro et du type
        if(req.body.catwayNumber !== undefined || req.body.catwayType !== undefined) {
            return res.status(400).json({ message: "Le numéro et le type de catway ne peuvent être modifiés."});
        }

        // 2) Filtrer les champs autorisés
        const updates = {};
        if (req.body.catwayState)
            updates.catwayState = req.body.catwayState;

        // 3) Mise à jour
        const updated = await Catway.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Catway introuvable."});
        };

        // 4) Réponse → Succès
        res .status(200).json({
            message: "Catway mis à jour.",
            catway: updated
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ===============================
// SUPPRIMER UN CATWAY
// ===============================
export const deleteCatway = async (req, res) => {
    try{
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: "Catway introuvable."});
        }

        const deleted = await Catway.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Catway introuvable." });
        }

        res.status(200).json({ message: "Catway supprimé avec succès." });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};