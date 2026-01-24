import express from "express";
import {
    getCatwaysPage,
    /* getCatwayById, */
    getCatwayByNumber,
    getCatwayPanel,
    getCreateCatwayPage,
    /* getEditCatwayById, */
    getEditCatwayByNumber
} from "../../controllers/catways/catwaysViewController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.get("/", authGuard, getCatwaysPage);
router.get("/create", authGuard, getCreateCatwayPage);
router.get("/number/:catwayNumber", authGuard, getCatwayByNumber);
router.get("/number/:catwayNumber/edit", authGuard, getEditCatwayByNumber);
router.get("/:id/panel", authGuard, getCatwayPanel);
/* router.get("/:id/edit", authGuard, getEditCatwayById);
router.get("/:id", authGuard, getCatwayById); */

export default router;