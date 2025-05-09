import express from "express";
import {
  getTaskCreatedByUser,
  deleteTask,
  updateTask,
  getTasksAssignedToUser,
  createTask,
} from "../controllers/task";

const router = express.Router();

router.get("/", getTaskCreatedByUser);
router.get("/assignedTask", getTasksAssignedToUser);
router.post("/", createTask);
router.delete("/:taskId", deleteTask);
router.put("/:taskId", updateTask);

export default router;
