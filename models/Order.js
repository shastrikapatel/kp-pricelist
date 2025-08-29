// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerNumber: { type: String, required: true },
    items: [
        {
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    grandTotal: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
