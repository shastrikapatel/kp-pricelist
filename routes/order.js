// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order'); // Your Mongoose model

router.post('/save-order', async (req, res) => {
    try {
        const { customerNumber, items, grandTotal } = req.body;
        const order = new Order({ customerNumber, items, grandTotal });
        await order.save();
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;
