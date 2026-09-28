import { Router } from "express";
import { ExperiencesController } from "../controllers/experiences.controller";

const router = Router();

router.get("/", ExperiencesController.getExperiences);
router.post("/", ExperiencesController.createExperience);
router.put("/:id", ExperiencesController.updateExperience);
router.delete("/:id", ExperiencesController.deleteExperience);

export default router;
