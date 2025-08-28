const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views")); // Vercel safe

// ✅ Cookie-based session (serverless friendly)
app.use(cookieSession({
    name: "session",
    keys: ["your_secret_key"], // Change this to something secure
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// MongoDB connection
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    isConnected = true;
}

// Routes
const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use("/admin", adminRoutes);
app.use("/", customerRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
});

if (process.env.NODE_ENV !== "production") {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
