const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Hardcoded admin user (for now)
const users = [
    { email: "admin@example.com", password: "admin123", role: "admin" }
];

const SECRET = "mysecretkey"; // In production use process.env.SECRET

// JWT Authentication Middleware
function authenticate(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    try {
        const user = jwt.verify(token, SECRET);
        req.user = user;
        next();
    } catch (err) {
        return res.redirect("/login");
    }
}

// Routes
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

// Login Logic
app.post("/login", (req, res) => {
    const { email, password, role } = req.body;

    // Customer Login (No credentials needed)
    if (role === "customer") {
        const token = jwt.sign({ role: "customer" }, SECRET, { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        return res.redirect("/customer");
    }

    // Admin Login
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.render("login", { error: "Invalid credentials" });

    const token = jwt.sign({ email: user.email, role: user.role }, SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/admin");
});

// Admin View
app.get("/admin", authenticate, (req, res) => {
    if (req.user.role !== "admin") return res.status(403).send("Forbidden");
    res.render("admin", { user: req.user });
});

// Customer View
app.get("/customer", authenticate, (req, res) => {
    if (req.user.role !== "customer") return res.status(403).send("Forbidden");
    res.render("customer", { user: req.user });
});

// Logout
app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

// Export app for Vercel
module.exports = app;
