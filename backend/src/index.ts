import cors from "cors";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task";
import authMiddleware from "./middleware/middleware";
import express, { Request, Response, NextFunction } from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "This is a Todo app backend" });
});

app.use("/api/auth", authRoutes);
app.use("/api/task", authMiddleware, taskRoutes);

app.use("/", (err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json("Something Went Wrong");
});

app.listen(PORT, () => {
  console.log("server is running on port:", PORT);
});
