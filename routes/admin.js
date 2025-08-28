const express = require("express");
const router = express.Router();

// ✅ Hardcoded credentials
const ADMIN_USER = "admin";
const ADMIN_PASS = "12345";

// ✅ Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    return res.redirect("/admin/login");
}

// ✅ Login page
router.get("/login", (req, res) => {
    res.render("admin-login", { error: null });
});

// ✅ Handle login form submission
router.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;  // ✅ This works now
        return res.redirect("/admin");
    } else {
        return res.render("admin-login", { error: "Invalid username or password" });
    }
});


// ✅ Logout route
router.get("/logout", (req, res) => {
    req.session = null; // Clear session
    res.redirect("/admin/login");
});

// ✅ Admin dashboard (Protected)
router.get("/", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item"); // Import Item model
    const items = await Item.find(); // Fetch items from DB
    res.render("admin", { items }); // Render admin.ejs with items
});

// ✅ Add Item (Protected)
router.post("/add", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item");
    const { name, price, quantity } = req.body;
    await Item.create({ name, price, quantity });
    res.redirect("/admin");
});

// ✅ Update Item (Protected)
router.post("/update/:id", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item");
    const { name, price, quantity } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, price, quantity });
    res.redirect("/admin");
});

// ✅ Delete Item (Protected)
router.post("/delete/:id", isAuthenticated, async (req, res) => {
    const Item = require("../models/Item");
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

module.exports = router;
