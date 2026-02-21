/**
 * ===================================================================
 * HOME ROUTES (WEB)
 * ===================================================================
 */

import express from "express";
import { getHomeView } from "../controllers/homeViewController.js";
import { publicPage } from "../middlewares/ui/publicPage.js";

const router = express.Router();

router.get("/", publicPage, getHomeView);
router.get("/login", publicPage, getHomeView);

export default router;