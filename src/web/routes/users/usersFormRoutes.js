import express from "express";
import { postCreateUser, postEditUser } from "../../controllers/users/usersFormController.js";
import { authGuard } from "../../middlewares/authGuard.js";

const router = express.Router();

router.post("/create", authGuard, postCreateUser);
router.post("/:id/edit", authGuard, postEditUser);

export default router;