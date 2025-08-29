const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerNumber: { type: String, required: true },
    items: [{ name: String, price: Number, quantity: Number }],
    grandTotal: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    confirmed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Order', orderSchema);
