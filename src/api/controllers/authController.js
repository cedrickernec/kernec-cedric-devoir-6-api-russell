import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

import { validateUsername, validateEmail, validatePassword } from "../utils/validators/userValidators.js";

// ===============================================
// INSCRIPTION
// ===============================================
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1) Vérification → Email déjà utilisé ?
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Un utilisateur avec cet email existe déjà."
            });
        }

        // 2) Vérification champs obligatoires
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Tous les champs sont obligatoires."
            })
        }

        // 3) Validation du nom d'utilisateur
        const usernameError = validateUsername(username);

        if (usernameError) {
            return res.status(400).json({ message: usernameError });
        }

        // 4) Validation de l'email
        const emailError = validateEmail(email);

        if (emailError) {
            return res.status(400).json({ message: emailError });
        }

        // 5) Validation du password
        const passwordValidation = validatePassword(password);

        if (!passwordValidation.valid) {
            return res.status(400).json({
                message: "Le mot de passe ne respecte pas les règles de sécurité.",
                error: passwordValidation.errors
            });
        }

        // 6) Hash du password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 7) Création du nouvel utilisateur
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        })

        // 8) Réponse → succès
        res.status(201).json({
            message: "Utilisateur créé avec succès.",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ===============================================
// CONNEXION
// ===============================================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1) Vérification → utilisateur existant ?
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // 2) Vérification du mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // 3) Génération du token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        // 4) Réponse
        res.status(200).json({
            message: "Connexion réussi.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
};

// ===============================================
// DÉCONNEXION
// ===============================================
export const logout = async (req, res) => {
    try {
        return res.status(200).json({ message: "Déconnecté avec succès."});
    } catch (error) {
        res.status(500).json({ message: "Serveur erreur", error: error.message });
    }
};