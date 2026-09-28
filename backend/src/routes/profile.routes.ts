import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";

const router = Router();

router.get("/", ProfileController.getProfile);
router.put("/", ProfileController.updateProfile);
router.post("/", ProfileController.updateProfile); // Dukungan fallback method POST

export default router;
