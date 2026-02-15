/**
 * ===================================================================
 * DOUCMENTATION ROUTE (WEB)
 * ===================================================================
 */

import { Router } from "express";
import { getDocumentation } from "../controllers/docViewController.js";
import { publicPage } from "../middlewares/ui/publicPage.js";

const router = Router();

router.get("/", publicPage, getDocumentation);

export default router;