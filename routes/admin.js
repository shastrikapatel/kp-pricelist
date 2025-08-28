const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Admin dashboard
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.render("admin", { items });
});

// Add new item
router.post("/add", async (req, res) => {
    const { name, price } = req.body;
    await Item.create({ name, price });
    res.redirect("/admin");
});

// Delete item
router.post("/delete/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

module.exports = router;
