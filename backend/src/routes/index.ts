import { Router } from "express";
import authRoutes from "./auth.routes";
import profileRoutes from "./profile.routes";
import projectsRoutes from "./projects.routes";
import skillsRoutes from "./skills.routes";
import experiencesRoutes from "./experiences.routes";
import messagesRoutes from "./messages.routes";

const router = Router();

// Mount all modular routes
router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/projects", projectsRoutes);
router.use("/skills", skillsRoutes);
router.use("/experiences", experiencesRoutes);
router.use("/messages", messagesRoutes);

// Health check endpoint
router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Portfolio Management REST API Server",
  });
});

export default router;
