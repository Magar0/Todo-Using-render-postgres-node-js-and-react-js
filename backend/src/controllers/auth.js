"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_1 = require("../db/drizzle");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
const createToken = ({ email, name, userId, expiresIn = "1h", }) => {
    const token = jsonwebtoken_1.default.sign({ email, name, userId }, process.env.JWT_SECRET, {
        expiresIn,
    });
    return token;
};
const signup = async (req, res) => {
    const { name, email, password, } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const existingUser = await drizzle_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .limit(1);
        if (existingUser.length > 0) {
            res.status(400).json({ message: "Email already registered" });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const [newUser] = await drizzle_1.db
            .insert(schema_1.users)
            .values({ name, email, password: hashedPassword })
            .returning();
        // JWT token creation
        const token = createToken({
            email,
            name,
            userId: newUser.id,
            expiresIn: "15m",
        });
        res.status(201).json({ data: { email, name, userId: newUser.id }, token });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Failed to create user" });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    try {
        const existingUser = await drizzle_1.db
            .select()
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, email))
            .limit(1);
        if (!existingUser.length) {
            res.status(400).json({ message: "User doesn't exist" });
            return;
        }
        const isPasswordCrt = await bcryptjs_1.default.compare(password, existingUser[0].password);
        if (!isPasswordCrt) {
            res.status(400).json({ message: "Password Wrong" });
            return;
        }
        const token = createToken({
            email,
            name: existingUser[0].name,
            userId: existingUser[0].id,
            expiresIn: "1m",
        });
        res.status(201).json({
            data: { email, name: existingUser[0].name, userId: existingUser[0].id },
            token,
        });
    }
    catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
exports.login = login;
