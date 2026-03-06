const express = require("express");
const cors = require("cors");
const connectDB = require("./connectDB");
const mainRouter = require("./routes/mainRoutes");
const productRouter = require("./routes/productRoutes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const dotenv=require('dotenv').config()
    

const app = express();

app.use(cookieParser());     
/* =========================
   DATABASE
========================= */
connectDB();

/* =========================
   CORS
========================= */
app.use(
    cors({
        origin: "http://localhost:3000", // CRA frontend
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

/* =========================
   MIDDLEWARE
========================= */

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* =========================
   ROUTES
========================= */
app.use("/", mainRouter);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/product", productRouter);

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});