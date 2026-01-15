import express from "express";
import { postCreateCatway, postEditCatway } from "../../controllers/catways/catwaysFormController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateCatway);
router.post("/:id/edit", authGuard, postEditCatway);

export default router;