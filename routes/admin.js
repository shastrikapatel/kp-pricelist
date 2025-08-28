const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Dummy admin credentials (You can store in DB)
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS_HASH = bcrypt.hashSync(process.env.ADMIN_PASS || "12345", 10);

// Middleware to protect admin routes
function isAuthenticated(req, res, next) {
    if (req.session.isAdmin) {
        return next();
    } else {
        return res.redirect("/admin/login");
    }
}

// Show login page
router.get("/login", (req, res) => {
    res.render("admin-login", { error: null });
});

// Handle login form
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && bcrypt.compareSync(password, ADMIN_PASS_HASH)) {
        req.session.isAdmin = true;
        return res.redirect("/admin");
    } else {
        return res.render("admin-login", { error: "Invalid credentials" });
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/admin/login");
    });
});

// Admin dashboard (Protected)
router.get("/", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item"); // adjust path if needed
    const items = await Item.find();
    res.render("admin", { items });
});

// Add Item (Protected)
router.post("/add", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item");
    const { name, price, quantity } = req.body;
    await Item.create({ name, price, quantity });
    res.redirect("/admin");
});

// Update Item (Protected)
router.post("/update/:id", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item");
    const { name, price, quantity } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, price, quantity });
    res.redirect("/admin");
});

// Delete Item (Protected)
router.post("/delete/:id", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item");
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

module.exports = router;
