const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Order = require('../models/Order');

// Admin dashboard
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.render("admin", { items });
});

// Add new item
router.post("/add", async (req, res) => {
    const { name, price, quantity } = req.body;
    await Item.create({ name, price, quantity });
    res.redirect("/admin");
});

// Update item
router.post("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, quantity } = req.body;

        await Item.findByIdAndUpdate(id, { name, price, quantity });
        res.redirect("/admin");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating item");
    }
});

// Delete item
router.post("/delete/:id", async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect("/admin");
});

// Show all confirmed orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find({ confirmed: true }).sort({ date: -1 });
        res.render('adminOrders', { orders });
    } catch (err) {
        console.log(err);
        res.send('Error fetching orders');
    }
});

// Confirm an order
router.post('/confirm-order/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).send('Order not found');

        order.confirmed = true;
        await order.save();

        res.redirect('/admin/orders'); // redirect to admin panel
    } catch (err) {
        console.log(err);
        res.status(500).send('Error confirming order');
    }
});

module.exports = router;
