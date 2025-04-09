const express = require("express");
const firmControeller = require("../controllers/firmController");
const verifyToken = require("../middlewares/verifyToken");

const router = express.Router();

router.post("/add-firm", verifyToken, firmControeller.addFirm);

router.get("/uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent("Content-Type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

router.delete("/:firmId", verifyToken, firmControeller.deleteFirmById);

module.exports = router;
