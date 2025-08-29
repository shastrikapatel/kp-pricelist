const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Order = require("../models/Order");

// Admin panel: show items & orders
router.get("/", async (req, res) => {
    const items = await Item.find();
    const orders = await Order.find().populate("items.itemId");
    res.render("admin", { items, orders });
});

// Add item
router.post("/add-item", async (req, res) => {
    const { name, price } = req.body;
    await Item.create({ name, price });
    res.redirect("/admin");
});

module.exports = router;
