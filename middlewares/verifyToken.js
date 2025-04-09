const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();
const secretKey = process.env.SECRET_KEY;

const verifyToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).json({ message: "Token is required" });
  }
  try {
    const decodedToken = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decodedToken.id);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    req.vendorId = vendor._id;

    next();
  } catch (error) {
    return res.status(500).json({ message: "Token is inavlid" });
  }
};

module.exports = verifyToken;
