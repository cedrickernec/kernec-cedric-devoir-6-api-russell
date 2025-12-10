import { Router } from "express";
import { getDocumentation } from "../controllers/documentationController.js";

const router = Router();

router.get("/", getDocumentation);

export default router;