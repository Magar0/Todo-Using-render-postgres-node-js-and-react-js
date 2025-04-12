import express from "express";
import { create, deleteTask, update, read } from "../controllers/task";

const router = express.Router();

router.get("/", read);
router.post("/", create);
router.delete("/:taskId", deleteTask);
router.put("/:taskId", update);

export default router;
