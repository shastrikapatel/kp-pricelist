require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// ✅ Optimize MongoDB connection for Vercel
if (!global._mongooseConnection) {
    global._mongooseConnection = mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

// Wait for DB connection before processing requests
app.use(async (req, res, next) => {
    try {
        await global._mongooseConnection;
        next();
    } catch (err) {
        console.error("MongoDB error:", err.message);
        res.status(500).send("MongoDB connection failed.");
    }
});

// Routes
const adminRoutes = require("../routes/admin");
const customerRoutes = require("../routes/customer");

app.use("/admin", adminRoutes);
app.use("/", customerRoutes);

// Debug route
app.get("/debug", async (req, res) => {
    res.json({ status: "ok", mongo: !!process.env.MONGO_URL });
});

// Default route
app.get("/", (req, res) => {
    res.send("Welcome to Price List App");
});

// Local testing
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
