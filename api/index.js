require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const adminRoutes = require("../routes/admin");
const customerRoutes = require("../routes/customer");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use("/admin", adminRoutes);
app.use("/customer", customerRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected");
        app.listen(process.env.PORT || 3000, () => {
            console.log("Server started on port 3000");
        });
    })
    .catch(err => console.log(err));
