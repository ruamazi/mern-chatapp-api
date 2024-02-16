import { Router } from "express";
import { getMessages, sendMsg } from "../controllers/messages.js";
import { protectRoute } from "../middlewere/protectRoute.js";

const router = Router();

router.post("/send/:receiverId", protectRoute, sendMsg);
router.get("/:receiverId", protectRoute, getMessages);

export default router;
