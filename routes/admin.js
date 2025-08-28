const express = require("express");
const router = express.Router();

// Hardcoded admin credentials for demo (replace with DB later)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "1234";

// Middleware to protect admin routes
function isAdminLoggedIn(req, res, next) {
    if (req.session.admin) {
        next();
    } else {
        res.redirect("/admin/login");
    }
}

// Login page
router.get("/login", (req, res) => {
    res.render("admin-login", { error: null });
});

// Handle login POST
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        req.session.admin = true;
        res.redirect("/admin/dashboard");
    } else {
        res.render("admin-login", { error: "Invalid username or password" });
    }
});

// Admin dashboard (protected)
router.get("/dashboard", isAdminLoggedIn, async (req, res) => {
    const Item = require("../models/Item"); // Mongoose model
    const items = await Item.find();
    res.render("admin", { items });
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/admin/login");
});

// Add item
router.post("/add", isAdminLoggedIn, async (req, res) => {
    const Item = require("../models/Item");
    const { name, price, quantity } = req.body;
    await Item.create({ name, price, quantity });
    res.redirect("/admin/dashboard");
});

// Update item
router.post("/update/:id", isAdminLoggedIn, async (req, res) => {
    const Item = require("../models/Item");
    const { name, price, quantity } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, price, quantity });
    res.redirect("/admin/dashboard");
});

// Delete item
router.post("/delete/:id", isAdminLoggedIn, async (req, res) => {
    const Item = require("../models/Item");
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin/dashboard");
});

module.exports = router;
