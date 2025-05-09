import express from "express";
import {
  markReadNotification,
  getNotifications,
} from "../controllers/notification";

const router = express.Router();

router.put("/", markReadNotification);
router.get("/", getNotifications);

export default router;
