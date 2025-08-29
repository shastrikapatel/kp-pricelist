const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

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

module.exports = router;
