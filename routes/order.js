// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/save-order', async (req, res) => {
    try {
        const { customerNumber, items, grandTotal } = req.body;

        const order = new Order({ customerNumber, items, grandTotal });
        await order.save();

        res.json({ success: true, message: 'Order saved successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
