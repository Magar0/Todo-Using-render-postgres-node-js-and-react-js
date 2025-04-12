"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.update = exports.create = exports.read = void 0;
const drizzle_1 = require("../db/drizzle");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const read = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "userId is missing" });
        return;
    }
    try {
        const data = await drizzle_1.db
            .select()
            .from(schema_1.tasks)
            .where((0, drizzle_orm_1.eq)(schema_1.tasks.userId, userId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.tasks.updatedAt));
        res.status(200).json(data);
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Error fetching tasks", error: err });
        return;
    }
};
exports.read = read;
const create = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.userId;
    if (!title || !description) {
        res.status(400).json({ message: "Title and descriptions are required" });
        return;
    }
    if (!userId) {
        res.status(400).json({ message: "userId is missing" });
        return;
    }
    try {
        const data = await drizzle_1.db
            .insert(schema_1.tasks)
            .values({ title, description, userId })
            .returning();
        res.status(201).json(data);
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Error creating tasks", error: err });
        return;
    }
};
exports.create = create;
const update = async (req, res) => {
    const { title, description, done } = req.body;
    const { taskId } = req.params;
    const userId = req.userId;
    if (!userId) {
        res.status(400).json({ message: "userId is missing" });
        return;
    }
    if (!taskId) {
        res.status(400).json({ message: "taskId is missing" });
        return;
    }
    try {
        const data = await drizzle_1.db
            .update(schema_1.tasks)
            .set({ title, description, userId, done, updatedAt: new Date() })
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId), (0, drizzle_orm_1.eq)(schema_1.tasks.userId, userId)))
            .returning();
        res.status(200).json(data);
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Error updating tasks", error: err });
        return;
    }
};
exports.update = update;
const deleteTask = async (req, res) => {
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
        const data = await drizzle_1.db
            .delete(schema_1.tasks)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId), (0, drizzle_orm_1.eq)(schema_1.tasks.userId, userId)))
            .returning();
        res.status(200).json(data);
        return;
    }
    catch (err) {
        res.status(500).json({ message: "Error Deleting tasks", error: err });
        return;
    }
};
exports.deleteTask = deleteTask;
