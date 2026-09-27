const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const Lead = require("./models/Lead");
const User = require("./models/User");

require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Lead Management System API is running"
    });
});


// ===============================
// AUTHENTICATION
// ===============================

// Register
app.post("/api/auth/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Login
app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ===============================
// JWT MIDDLEWARE
// ===============================

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};


// ===============================
// LEAD MANAGEMENT
// ===============================

// Create a new lead
app.post("/api/leads", authenticateToken, async (req, res) => {
    try {
        const lead = await Lead.create(req.body);

        res.status(201).json(lead);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Get all leads
app.get("/api/leads", authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort({
            createdAt: -1
        });

        res.json(leads);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Get one lead
app.get("/api/leads/:id", authenticateToken, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.json(lead);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// Update lead
app.put("/api/leads/:id", authenticateToken, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.json(lead);

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Delete lead
app.delete("/api/leads/:id", authenticateToken, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);

        if (!lead) {
            return res.status(404).json({
                message: "Lead not found"
            });
        }

        res.json({
            message: "Lead deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ===============================
// START SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});