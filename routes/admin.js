const express = require("express");
const router = express.Router();

// Hardcoded credentials for admin
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// Middleware to check if admin is logged in
function isAdminAuthenticated(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect("/admin/login");
}

// Admin Login Page
router.get("/login", (req, res) => {
    res.render("admin-login", { error: null });
});

// Handle Admin Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        return res.redirect("/admin/dashboard");
    } else {
        return res.render("admin-login", { error: "Invalid Email or Password" });
    }
});

// Admin Dashboard (protected)
router.get("/dashboard", isAdminAuthenticated, (req, res) => {
    res.render("admin-dashboard");
});

// Admin Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});

module.exports = router;
