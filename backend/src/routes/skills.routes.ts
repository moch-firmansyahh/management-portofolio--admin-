import { Router } from "express";
import { SkillsController } from "../controllers/skills.controller";

const router = Router();

router.get("/", SkillsController.getSkills);
router.post("/", SkillsController.createSkill);
router.post("/category", SkillsController.createCategory);
router.put("/:id", SkillsController.updateSkill);
router.delete("/:id", SkillsController.deleteSkill);
router.delete("/category/:category", SkillsController.deleteByCategory);

export default router;
