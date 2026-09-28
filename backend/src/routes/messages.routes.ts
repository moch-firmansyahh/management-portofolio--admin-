import { Router } from "express";
import { MessagesController } from "../controllers/messages.controller";

const router = Router();

router.get("/", MessagesController.getMessages);
router.patch("/:id/read", MessagesController.markAsRead);
router.delete("/:id", MessagesController.deleteMessage);

export default router;
