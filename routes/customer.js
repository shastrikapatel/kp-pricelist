const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Order = require("../models/Order");

// Show items to customer
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.render("customer", { items });
});

// Place order
router.post("/order", async (req, res) => {
    const { customerName, customerNumber, orderItems } = req.body;

    let itemsArray = [];
    let grandTotal = 0;

    for (let key in orderItems) {
        let item = orderItems[key];
        if (Number(item.quantity) > 0) {
            itemsArray.push({
                itemId: item.itemId,
                quantity: Number(item.quantity)
            });
            grandTotal += Number(item.quantity) * Number(item.price);
        }
    }

    await Order.create({
        customerName,
        customerNumber,
        items: itemsArray,
        grandTotal
    });

    res.send("Order placed successfully!");
});

module.exports = router;
