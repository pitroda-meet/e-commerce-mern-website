require("dotenv").config();

const express = require("express");
require("colors");
const cors = require("cors");
const path = require("path");
const fs = require("fs"); // Import the File System module

const connectDb = require("./confing/confing");
const { errorHandler } = require("./middelewares/error");
connectDb();

const productRoutes = require("./routes/products");
const userRoutes = require("./routes/userRoutes");
const conetctRoutes = require("./routes/ContectRoutes");
const caerRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();

app.use(express.json());

// Use CORS middleware
app.use(
  cors({
    origin: "https://e-commerce-mern-website-cpf6.onrender.com",
  })
);

// Use routes
app.use("/products", productRoutes);
app.use("/user", userRoutes);
app.use("/form", conetctRoutes);
app.use("/cart", caerRoutes);
app.use("/api", orderRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
});
app.use(errorHandler);

const PORT = 8070;
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server started on port ${process.env.PORT || PORT}`.cyan);
});
