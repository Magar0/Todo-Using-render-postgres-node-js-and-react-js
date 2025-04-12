"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: ".env.local" });
const authMiddleware = (req, res, next) => {
    console.log("running");
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // const decodedData= verify(token,process.env.JWT_SECRET)
        // req.userId= decodedData.userId;
        //alternate way
        (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET, (err, decoded) => {
            console.log({ decoded });
            if (typeof decoded === "string" || !decoded?.userId) {
                return res.status(401).json({ error: "Invalid token" });
            }
            req.userId = decoded.userId;
            next();
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
};
exports.default = authMiddleware;
