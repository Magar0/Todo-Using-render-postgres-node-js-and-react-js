import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";

config({ path: ".env.local" });

// Extend the Request interface to include the userId property
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log("running");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // const decodedData= verify(token,process.env.JWT_SECRET)
    // req.userId= decodedData.userId;

    //alternate way
    verify(token, process.env.JWT_SECRET!, (err, decoded) => {
      console.log({ decoded });
      if (typeof decoded === "string" || !decoded?.userId) {
        return res.status(401).json({ error: "Invalid token" });
      }
      req.userId = decoded.userId;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default authMiddleware;
