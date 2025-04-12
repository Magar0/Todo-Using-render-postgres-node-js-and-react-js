"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const task_1 = __importDefault(require("./routes/task"));
const middleware_1 = __importDefault(require("./middleware/middleware"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: "*" }));
app.get("/", (req, res) => {
    res.status(200).json({ message: "This is a Todo app backend" });
});
app.use("/api/auth", auth_1.default);
app.use("/api/task", middleware_1.default, task_1.default);
app.use("/", (err, req, res, next) => {
    res.status(500).json("Something Went Wrong");
});
app.listen(PORT, () => {
    console.log("server is running on port:", PORT);
});
