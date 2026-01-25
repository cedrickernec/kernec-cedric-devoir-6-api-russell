import express from "express";
import {
    getCatwaysPage,
    getCatwayByNumber,
    getCatwayPanel,
    getCreateCatwayPage,
    getEditCatwayByNumber
} from "../../controllers/catways/catwaysViewController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getCatwaysPage);
router.get("/create", authGuard, getCreateCatwayPage);
router.get("/:catwayNumber", authGuard, getCatwayByNumber);
router.get("/:catwayNumber/edit", authGuard, getEditCatwayByNumber);
router.get("/:catwayNumber/panel", authGuard, getCatwayPanel);

export default router;