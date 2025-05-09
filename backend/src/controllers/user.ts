import { Request, Response } from "express";
import { users } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { db } from "../db/drizzle";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const data = await db
      .select({ id: users.id, email: users.email, username: users.username })
      .from(users)
      .orderBy(desc(users.createdAt));
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};
export const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "User ID is required" });
    return;
  }
  try {
    const data = await db
      .select({ id: users.id, email: users.email, username: users.username })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    if (data.length === 0 || !data[0]) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(data[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
};
