/**
 * ===================================================================
 * DOUCMENTATION ROUTE (WEB)
 * ===================================================================
 */

import { Router } from "express";
import { getDocumentation } from "../controllers/docController.js";
import { publicPage } from "../middlewares/publicPage.js";

const router = Router();

router.get("/", publicPage, getDocumentation);

export default router;