const express = require("express");
const router = express.Router();

// Temporary admin credentials
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
        // Successful login -> redirect to admin.ejs
        res.render("admin", { username }); // pass data if needed
    } else {
        // Login failed -> show login page again with error
        res.render("admin-login", { error: "Invalid username or password" });
    }
});

module.exports = router;
