import { Router } from "express";
import {
    googleLogin,
    getMe,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/google", googleLogin);

router.get("/me", verifyToken, getMe);

export default router;