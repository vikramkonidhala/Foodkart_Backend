const express = require("express");
const productController = require("../controllers/productController");
const verifyToken = require("../middlewares/verifyToken");
const { verify } = require("jsonwebtoken");

const router = express.Router();

router.post("/add-product/:firmId", verifyToken, productController.addProduct);

router.get("/:firmId/products", verifyToken, productController.getProductByFirm);

router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

router.delete("/:productId", verifyToken, productController.deleteProductById);

module.exports = router;
