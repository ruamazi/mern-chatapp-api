import { Router } from "express";
import { getUsers, getUsersForSidebar } from "../controllers/user.js";
import { protectRoute } from "../middlewere/protectRoute.js";

const router = Router();

router.get("/test", getUsers);
router.get("/", protectRoute, getUsersForSidebar);

export default router;
