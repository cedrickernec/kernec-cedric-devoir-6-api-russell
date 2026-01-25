import express from "express";
import { getHome } from "../controllers/homeController.js";
import { publicPage } from "../middlewares/publicPage.js";

const router = express.Router();

router.get("/", publicPage, getHome);
router.get("/login", publicPage, getHome);

export default router;