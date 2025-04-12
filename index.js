const express = require("express");
const dotEnv = require("dotenv");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const vendorRoutes = require("./routes/vendorRoutes");
const firmRoutes = require("./routes/firmRoutes");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const os = require("os");
const fs = require("fs");
const path = require("path");

const uploadsDir = path.join(os.tmpdir(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create directory if it doesn’t exist
}

const app = express();

dotEnv.config();
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDb Connected Succesfully!"))
  .catch((err) => console.log(err));

app.use(bodyparser.json());
app.use("/vendor", vendorRoutes);
app.use("/firm", firmRoutes);
app.use("/product", productRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server started running successfully on port: ${port}`);
});

app.use("/", (req, res) => {
  res.send("<h1>Welcome to FoodKart</h1>");
});
