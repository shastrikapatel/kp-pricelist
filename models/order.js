const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerNumber: { type: String, required: true },
    grandTotal: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
