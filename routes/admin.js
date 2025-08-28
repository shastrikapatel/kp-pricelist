const express = require("express");
const router = express.Router();

// Temporary admin credentials (for demo purposes)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "password";

// Render login page
router.get("/login", (req, res) => {
    res.render("admin-login", { error: null });
});

// Handle login form submission
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Successful login
        res.redirect("/admin/dashboard");
    } else {
        // Login failed
        res.render("admin-login", { error: "Invalid username or password" });
    }
});

// Admin dashboard
router.get("/dashboard", (req, res) => {
    res.send("<h1>Welcome Admin!</h1><p>This is the dashboard.</p>");
});

module.exports = router;
