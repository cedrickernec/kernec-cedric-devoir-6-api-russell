import express from "express";
import { postLoginView, getLogoutView } from "../controllers/authViewController.js";

const router = express.Router();

router.post("/login", postLoginView);
router.get("/logout", getLogoutView);

export default router;