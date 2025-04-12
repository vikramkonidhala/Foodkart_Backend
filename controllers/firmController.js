const Firm = require("../models/Firm");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../cloudinaryService");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    let imageDetails;
    if (req.file) {
      const filePath = req.file.path;
      imageDetails = await uploadImageToCloudinary(filePath);
    }

    const vendor = await Vendor.findById(req.vendorId);

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image: imageDetails ? imageDetails.url : undefined,
      imagePublicId: imageDetails ? imageDetails.publicId : undefined,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res
      .status(200)
      .json({ message: "Firm added successfully", firmId: savedFirm._id });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if (!deletedFirm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    if (deletedFirm.imagePublicId) {
      await deleteImageFromCloudinary(deletedFirm.imagePublicId);
    }

    const vendor = await Vendor.findById(deletedFirm.vendor);

    if (vendor) {
      vendor.firm = vendor.firm.filter(
        (firmId) => firmId.toString() !== deletedFirm._id.toString()
      );
      await vendor.save();
    }

    const products = await Product.find({ firm: firmId });
    if (products) {
      products.forEach(async (product) => {
        if (product.imagePublicId) {
          await deleteImageFromCloudinary(product.imagePublicId);
        }
      });

      await Product.deleteMany({ firm: firmId });
    }

    return res.status(200).json({ message: "Firm deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addFirm: [upload.single("image"), addFirm], deleteFirmById };
