import { Response, Request } from "express";
import { db } from "../db/drizzle";
import { tasks } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const read = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(400).json({ message: "userId is missing" });
  }
  try {
    const data = await db.select().from(tasks).where(eq(tasks.userId, userId));
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching tasks", error: err });
  }
};
export const create = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const userId = req.userId;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and descriptions are required" });
  }
  if (!userId) {
    return res.status(400).json({ message: "userId is missing" });
  }
  try {
    const data = await db
      .insert(tasks)
      .values({ title, description, userId })
      .returning();
    return res.status(201).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating tasks", error: err });
  }
};
export const update = async (req: Request, res: Response) => {
  const { title, description, done } = req.body;
  const { taskId } = req.params;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId is missing" });
  }
  if (!taskId) {
    return res.status(400).json({ message: "taskId is missing" });
  }
  try {
    const data = await db
      .update(tasks)
      .set({ title, description, userId, done, updatedAt: new Date() })
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating tasks", error: err });
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.userId;
  if (!taskId) {
    return res.status(400).json({ message: "taskId is missing" });
  }
  if (!userId) {
    return res.status(400).json({ message: "userId is missing" });
  }
  try {
    const data = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)))
      .returning();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error Deleting tasks", error: err });
  }
};
