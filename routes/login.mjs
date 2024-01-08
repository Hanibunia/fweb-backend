// Import necessary modules
import express from "express";
import { db, closeConnection, client } from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const router = express.Router();

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Use the generated secret key
const secretKey = generateSecretKey();

// Print the generated secret key (optional)
console.log(secretKey);

router.post("/admin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the provided email and password match a user in your MongoDB collection
        const collection = await db.collection("admin");
        const user = await collection.findOne({ email, password });

        if (user) {
            // Create a JWT token using the actual secret key
            const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
                expiresIn: "1h", // Token expiration time (e.g., 1 hour)
            });

            // Return the token
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const newDocument = {
            email: req.body.email,
            password: req.body.password,
        };

        const collection = await db.collection("admin");
        const result = await collection.insertOne(newDocument);

        res.status(200).send(result);
    } catch (error) {
        console.error('Error during login-admin:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Logout route
router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

export default router;
