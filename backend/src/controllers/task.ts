import { Response, Request } from "express";
import { db } from "../db/drizzle";
import { tasks } from "../db/schema";
import { and, desc, eq } from "drizzle-orm";
import { createNotification } from "./notification";

export const getTaskCreatedByUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  try {
    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.createdById, userId))
      .orderBy(desc(tasks.updatedAt));
    res.status(200).json(data);
    return;
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
    return;
  }
};

export const getTasksAssignedToUser = async (req: Request, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  try {
    const data = await db
      .select()
      .from(tasks)
      .where(eq(tasks.assignedToId, userId))
      .orderBy(desc(tasks.updatedAt));
    res.status(200).json(data);
    return;
  } catch (err) {
    res.status(500).json({ message: "Error fetching tasks", error: err });
    return;
  }
};

export const createTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, status, assignedToId } =
    req.body;
  const userId = req.userId;

  console.log({ assignedToId });
  if (!title || !description) {
    res.status(400).json({ message: "Title and descriptions are required" });
    return;
  }
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  try {
    const data = await db
      .insert(tasks)
      .values({
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
        priority,
        status,
        createdById: userId,
        assignedToId: assignedToId || null,
      })
      .returning();

    // create notification on assigning task to someone
    if (assignedToId && assignedToId !== userId) {
      const notification = await createNotification({
        userId: assignedToId,
        taskId: data[0].id,
        type: "assignment",
        message: `You have been assigned a new task: ${title}`,
      });

      req.io.to(`user-${assignedToId}`).emit("new-notification", notification);

      res.status(201).json(data);
    }
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating tasks", error: err });
  }
};
export const updateTask = async (req: Request, res: Response) => {
  const { title, description, dueDate, priority, status, assignedToId } =
    req.body;
  const { taskId } = req.params;
  const userId = req.userId;

  console.log({ title, description, dueDate, priority, status, assignedToId });
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  if (!taskId) {
    res.status(400).json({ message: "taskId is missing" });
    return;
  }
  try {
    // First get the current task to compare changes
    const [currentTask] = await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, taskId))
      .limit(1);

    if (!currentTask) {
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Check if user is either creator or assignee
    const isCreator = currentTask.createdById === userId;
    const isAssignee = currentTask.assignedToId === userId;

    if (!isCreator && !isAssignee) {
      res.status(403).json({ message: "Unauthorized to update this task" });
      return;
    }

    // Prepare update data based on user role
    let updateData = {
      updatedAt: new Date(),
    };

    if (isCreator) {
      // Creator can update all fields
      Object.assign(updateData, {
        title,
        description,
        dueDate: new Date(dueDate),
        priority,
        status,
        assignedToId,
      });
    } else {
      // Assignee can only update status and their own assignment
      Object.assign(updateData, {
        status,
        assignedToId:
          assignedToId === userId ? assignedToId : currentTask.assignedToId,
      });
    }

    // Perform the update
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning();

    // Handle notifications for assignment changes
    if (
      assignedToId !== undefined &&
      assignedToId !== currentTask.assignedToId
    ) {
      const notification = await createNotification({
        userId: assignedToId,
        taskId,
        message: `You've been assigned to task: ${updatedTask.title}`,
        type: "assignment",
      });

      req.io.to(`user-${assignedToId}`).emit("new-notification", notification);
    }

    res.status(200).json(updatedTask);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating tasks", error: err });
    return;
  }
};
export const deleteTask = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const userId = req.userId;
  if (!taskId) {
    res.status(400).json({ message: "taskId is missing" });
    return;
  }
  if (!userId) {
    res.status(400).json({ message: "userId is missing" });
    return;
  }
  try {
    const data = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.createdById, userId)))
      .returning();
    res.status(200).json(data);
    return;
  } catch (err) {
    res.status(500).json({ message: "Error Deleting tasks", error: err });
    return;
  }
};

// handle task assignment

// export const assignTask = async (req: Request, res: Response) => {
//   const { taskId, assigneeId } = req.body;
//   const userId = req.userId;
//   if (!taskId || !assigneeId) {
//     res.status(400).json({ message: "taskId or assigneeId is missing" });
//     return;
//   }
//   if (!userId) {
//     res.status(400).json({ message: "userId is missing" });
//     return;
//   }
//   try {
//     const [task] = await db
//       .select()
//       .from(tasks)
//       .where(and(eq(tasks.id, taskId), eq(tasks.createdById, userId)))
//       .limit(1);

//     if (!task) {
//       res.status(400).json({ message: "task not found" });
//       return;
//     }

//     const [assignee] = await db
//       .select()
//       .from(users)
//       .where(eq(users.id, assigneeId))
//       .limit(1);

//     if (!assignee) {
//       res.status(400).json({ message: "Asignee not found" });
//       return;
//     }

//     // update the task with the new assignee
//     const [updatedTask] = await db
//       .update(tasks)
//       .set({ assignedToId: assigneeId, updatedAt: new Date() })
//       .where(and(eq(tasks.id, taskId), eq(tasks.createdById, userId)))
//       .returning();

//     await createNotification({
//       userId: assigneeId,
//       taskId: taskId,
//       type: "assignment",
//       message: `You have been assigned a new task: ${task.title}`,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error assigning task", error: err });
//     return;
//   }
// };
