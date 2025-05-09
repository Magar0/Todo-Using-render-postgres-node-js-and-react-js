import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/drizzle";
import { notifications } from "../db/schema";
import { Response, Request } from "express";

interface CreateNotification {
  userId: string;
  taskId: string;
  message: string;
  type: "assignment" | "update" | "reminder";
}

export const createNotification = async ({
  userId,
  taskId,
  message,
  type,
}: CreateNotification) => {
  console.log("Creating notification");
  const [notification] = await db
    .insert(notifications)
    .values({
      userId,
      taskId,
      message,
      type,
      isRead: false,
    })
    .returning();
  // console.log("Notification created", notification);
  return notification;
};

export const markReadNotification = async (req: Request, res: Response) => {
  const { notificationId } = req.body;
  if (!notificationId) {
    res.status(400).json({ message: "Notification Id is missing" });
    return;
  }
  const userId = req.userId;
  if (!userId) {
    return;
  }
  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, userId)
        )
      );

    res.status(200).json({ message: "Succesfully updated notifications" });
  } catch (err) {
    res.status(500).json({ message: "Error Updating notification" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "User Id is missing" });
    return;
  }
  try {
    const notificationsList = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));

    res.status(200).json(notificationsList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
