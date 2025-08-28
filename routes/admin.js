const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Hardcoded Admin Credentials
const ADMIN_USER = "admin@example.com";
const ADMIN_PASS = "12345";

// Middleware: Check if Admin is Authenticated
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    }
    res.redirect("/admin/login");
}

// Login Page
router.get("/login", (req, res) => {
    res.render("login", { error: null });
});

// Handle Login
router.post("/login", (req, res) => {
    const { username, password } = req.body; // ✅ Must match form input names

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;
        res.redirect("/admin");
    } else {
        res.render("login", { error: "Invalid Email or Password" }); // ✅ Show error
    }
});


// Admin Panel (after login)
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

// Update Item
router.post("/update/:id", isAuthenticated, async (req, res) => {
    const { name, price, quantity } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, price, quantity });
    res.redirect("/admin");
});

// Delete Item
router.post("/delete/:id", isAuthenticated, async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
});

module.exports = router;
