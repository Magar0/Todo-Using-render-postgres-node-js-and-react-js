import express from "express";
import { getUsers, getUser } from "../controllers/user";
import authMiddleware from "../middleware/middleware";

const router = express.Router();
router.get("/", authMiddleware, getUsers);
router.get("/:id", getUser);

export default router;
