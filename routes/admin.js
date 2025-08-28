const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Default credentials
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "admin123";

// Middleware to check if admin is logged in
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect("/admin/login");
    }
}

// Login Page
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// Handle Login
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session.isAdmin = true;
        res.redirect("/admin");
    } else {
        res.render("login", { error: "Invalid Email or Password" });
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});

// Admin Panel (Protected)
router.get("/", isAuthenticated, async (req, res) => {
    const items = await Item.find();
    res.render("admin", { items });
});

// Add Item
router.post("/add", isAuthenticated, async (req, res) => {
    const { name, price, quantity } = req.body;
    await Item.create({ name, price, quantity });
    res.redirect("/admin");
});

// Delete Item
router.post("/delete/:id", isAuthenticated, async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

// Update Item
router.post("/update/:id", isAuthenticated, async (req, res) => {
    const { name, price, quantity } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, price, quantity });
    res.redirect("/admin");
});

module.exports = router;
