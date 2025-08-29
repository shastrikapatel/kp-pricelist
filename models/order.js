const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerNumber: { type: String, required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
            quantity: { type: Number, required: true }
        }
    ],
    grandTotal: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
