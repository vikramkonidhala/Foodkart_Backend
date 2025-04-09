const vendorController = require("../controllers/vendorController");
const express = require("express");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/register", vendorController.vendorRegister);
router.post("/login", vendorController.vendorLogin);

router.get("/all-vendors", vendorController.getAllVendors);
router.get("/single-vendor/:id", verifyToken, vendorController.getVendorById);

module.exports = router;
