const Vendor = require("../models/Vendor");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require("dotenv");

dotEnv.config();

const secretKey = process.env.SECRET_KEY;

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res
        .status(400)
        .json({ message: "Vendor already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 7);

    const newVendor = new Vendor({
      username,
      email,
      password: hashedPassword,
    });

    await newVendor.save();
    res.status(201).json({ message: "Vendor registered successfully" });
    console.log("Vendor registered successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const vendorLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendor = await Vendor.findOne({ email });

    if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: vendor._id }, secretKey, { expiresIn: "1d" });

    return res.status(200).json({ message: "Vendor Login Success", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("firm");
    return res.status(200).json({ vendors });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getVendorById = async (req, res) => {
  const id = req.params.id;
  try {
    const vendor = await Vendor.findById(id).populate('firm');
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    return res.status(200).json({vendor});
  } catch (error) {}
};

module.exports = { vendorRegister, vendorLogin, getAllVendors , getVendorById};
