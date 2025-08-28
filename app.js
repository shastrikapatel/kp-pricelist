const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Session setup
app.use(session({
    secret: "your_secret_key", // change to strong secret in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if HTTPS
}));

// MongoDB Connection Pooling
let isConnected = false;

async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    isConnected = true;
}

// Routes
const adminRoutes = require("./routes/admin");
const customerRoutes = require("./routes/customer");

// Apply DB connection for every request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use("/admin", adminRoutes);
app.use("/", customerRoutes);

if (process.env.NODE_ENV !== "production") {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
