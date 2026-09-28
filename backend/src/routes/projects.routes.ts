import { Router } from "express";
import { ProjectsController } from "../controllers/projects.controller";

const router = Router();

router.get("/", ProjectsController.getProjects);
router.get("/:id", ProjectsController.getProjectById);
router.get("/:id/case-study", ProjectsController.getCaseStudy);
router.post("/", ProjectsController.createProject);
router.post("/:id/case-study", ProjectsController.updateCaseStudy);
router.put("/:id", ProjectsController.updateProject);
router.put("/:id/case-study", ProjectsController.updateCaseStudy);
router.delete("/:id", ProjectsController.deleteProject);

export default router;
