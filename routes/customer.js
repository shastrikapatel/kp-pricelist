const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// Customer view
router.get("/", async (req, res) => {
    const items = await Item.find();
    res.render("customer", { items });
});

module.exports = router;
