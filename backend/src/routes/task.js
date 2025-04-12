"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = require("../controllers/task");
const router = express_1.default.Router();
router.get("/", task_1.read);
router.post("/", task_1.create);
router.delete("/:taskId", task_1.deleteTask);
router.put("/:taskId", task_1.update);
exports.default = router;
