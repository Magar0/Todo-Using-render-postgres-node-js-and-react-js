import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { db } from "../db/drizzle";
import { users } from "../db/schema";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { config } from "dotenv";
import { StringValue } from "ms";

config({ path: ".env.local" });

const createToken = ({
  email,
  name,
  userId,
  expiresIn = "1h",
}: {
  email: string;
  name: string;
  userId: string;
  expiresIn: StringValue | number;
}) => {
  const token = jwt.sign({ email, name, userId }, process.env.JWT_SECRET!, {
    expiresIn,
  });
  return token;
};
export const signup = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await db
      .insert(users)
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
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password }: { email: string; password: string } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (!existingUser.length) {
      return res.status(400).json({ message: "User doesn't exist" });
    }
    const isPasswordCrt = await bcrypt.compare(
      password,
      existingUser[0].password
    );
    if (!isPasswordCrt) {
      return res.status(400).json({ message: "Password Wrong" });
    }
    const token = createToken({
      email,
      name: existingUser[0].name,
      userId: existingUser[0].id,
      expiresIn: "15m",
    });
    res.status(201).json({
      data: { email, name: existingUser[0].name, userId: existingUser[0].id },
      token,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
