const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "E-mail and password are required."});
        }
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters."});
        }

        const normalizedEmail = email.toLowerCase().tirm();

        const existing = await User.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: "Email is already registered." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email: normalizedEmail, 
            passwordHash,
        });

        return res.status(201).json({
            id: user._id,
            email: user,email,
            createdAt: user.createdAt,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});