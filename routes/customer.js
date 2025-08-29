const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Item = require("../models/Item"); // your items collection

// Customer Page
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.render("customer", { items });
});

// Save Order
router.post("/order", async (req, res) => {
    try {
        const { customerNumber, grandTotal } = req.body;
        const order = new Order({ customerNumber, grandTotal });
        await order.save();
        res.json({ success: true, message: "Order saved successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to save order." });
    }
});

module.exports = router;
