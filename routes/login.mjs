// login.mjs
import express from "express";
import { db } from "../db/conn.mjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

// Generate a random secret key
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Use the generated secret key
const secretKey = generateSecretKey();

// Print the generated secret key (optional)
console.log(secretKey);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'boizac8@gmail.com', // Replace with your email
        pass: 'tlhg keki ztki vjpt', // Replace with your email password or an app-specific password
    },
});

router.post("/admin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the provided email and password match a user in your MongoDB collection
        const collection = await db.collection("admin");
        const user = await collection.findOne({ email, password });

        if (user) {
            // Generate a verification code (could be a random string or a time-based code)
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            console.log(`Verification code for ${email}: ${verificationCode}`);

            // Store the verification code in your MongoDB collection or a cache
            await collection.updateOne({ _id: user._id }, { $set: { verificationCode } });

            // Send the verification code via email
            const mailOptions = {
                from: 'boizac8@gmail.com',
                to: email,
                subject: 'Verification Code',
                text: `Your verification code is: ${verificationCode}`,
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: "Verification code sent. Please check your email." });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/verify", async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const collection = await db.collection("admin");
        const user = await collection.findOne({ email, verificationCode });

        if (user) {
            // Create a JWT token using the actual secret key
            const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, {
                expiresIn: "1h", // Token expiration time (e.g., 1 hour)
            });

            // Return the token
            res.status(200).json({ token });
        } else {
            res.status(401).json({ message: "Incorrect verification code" });
        }
    } catch (error) {
        console.error('Error during verification:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Logout route
router.post("/logout", (req, res) => {
    res.status(200).json({ message: "Logout successful" });
});

export default router;
