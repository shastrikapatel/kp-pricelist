const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Order = require("../models/Order");

// Admin Dashboard
router.get("/", async (req, res) => {
    const items = await Item.find();
    const orders = await Order.find().sort({ date: -1 });
    res.render("admin", { items, orders });
});

// Add, Update, Delete Items (your existing code)
router.post("/add", async (req, res) => {
    const { name, price } = req.body;
    await new Item({ name, price }).save();
    res.redirect("/admin");
});

router.post("/update/:id", async (req, res) => {
    const { name, price } = req.body;
    await Item.findByIdAndUpdate(req.params.id, { name, price });
    res.redirect("/admin");
});

router.post("/delete/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

module.exports = router;
