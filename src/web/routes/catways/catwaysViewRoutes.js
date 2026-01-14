import express from "express";
import {
    getCatwaysPage,
    getCatwayByNumber,
    getCatwayPanel,
    getCreateCatwayPage,
    getEditCatwayPage
} from "../../controllers/catways/catwaysViewController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getCatwaysPage);
router.get("/create", authGuard, getCreateCatwayPage);

router.get("/:catwayNumber/edit", authGuard, getEditCatwayPage);
router.get("/:catwayNumber/panel", authGuard, getCatwayPanel);
router.get("/:catwayNumber", authGuard, getCatwayByNumber);

export default router;