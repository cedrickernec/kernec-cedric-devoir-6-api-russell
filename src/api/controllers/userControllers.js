import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validateUserUpdate, validatePassword, validateUserCreate } from "../utils/validators/userValidators.js";

// =========================================
// RÉCUPÉRER TOUTES LES UTLISATEURS
// =========================================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// =========================================
// RÉCUPÉRER UN UTILISATEUR PAR ID
// =========================================
export const getUserById = async (req, res) => {
    try {
        const {id} = req.params;

        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// =========================================
// CRÉER UN UTILISATEUR (ADMIN)
// =========================================
export const createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1) Validation
        const errors = validateUserCreate({ username, email, password });

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Données invalides", errors });
        }

        // 2) Vérification → Email déjà utilisé ?
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Un utilisateur avec cet email existe déjà."
            });
        }

        // 3) Hash du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4) Création
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // 5) Réponse
        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// =========================================
// MODIFIER UN UTILISATEUR
// (password non modifiable)
// =========================================
export const updateUser = async (req, res) => {
    try {
        const {id} = req.params;

        // 1) Empêcher la modification du password
        if (req.body.password) {
            return res.status(400).json({ message: "La modification du mot de passe doit se faire via la route dédiée."});
        }

        // 2) Validations (username + email)
        const errors = validateUserUpdate(req.body);
        if (Object.keys(errors).length > 0) {
            return res.status(400).json({ message: "Données invalides", errors })
        }

        // 3) Mise à jour
        const updated = await User.findByIdAndUpdate(
            id,
            req.body, {
                new: true,
                runValidators: true,
        }).select("-password")

        if (!updated) {
            return res.status(400).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json({
            message: "Utilisateur mis à jour.",
            user: updated
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}

// =========================================
// MODIFIER LE MOT DE PASSE
// =========================================
export const updatePassword = async (req, res) => {
    try {
        const {id} = req.params;
        const { newPassword } = req.body;

        // 1) Vérifier l'existence de l'utilisateur
        const user = await User.findById(id);
        if (!user) return res.status(400).json({ message: "Utilisateur introuvable."});

        // 2) Vérifier si le nouveau mot de passe est présent
        if (!newPassword) {
            return res.status(400).json({ message: "Le nouveau mot de passe est requis."});
        }

        // 3) Valider le mot de passe
        const validation = validatePassword(newPassword);
        if (!validation.valid) {
            return res.status(400).json({
                message: "Mot de passe invalide.",
                errors: validation.errors
            });
        }

        // Hash du mot de passe
        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;

        await user.save();

        res.status(200).json({ message: "Nouveau mot de passe enregistré." });

    } catch (error) {
        res.status(500).json({ message: "Serveur erreur", error: error.message });
    }
};

// =========================================
// SUPPRIMER UN UTILISATEUR
// =========================================
export const deleteUser = async (req, res) => {
    try {
        const {id} = req.params;

        const deleted = await User.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(400).json({ message: "Utilisateur introuvables." });
        }

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
}