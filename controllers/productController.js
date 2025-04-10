const Product = require("../models/Product");
const Firm = require("../models/Firm");
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

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;

    let imageDetails;
    if (req.file) {
      const filePath = req.file.path;
      imageDetails = await uploadImageToCloudinary(filePath);
    }

    const firmId = req.params.firmId;

    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ message: "Firm not found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image: imageDetails ? imageDetails.url : undefined,
      imagePublicId: imageDetails ? imageDetails.publicId : undefined,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.products.push(savedProduct);

    await firm.save();

    res.status(200).json({ message: "Product added successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ message: "No Firm found" });
    }

    const restaurantName = firm.firmName;

    const products = await Product.find({ firm: firmId });

    return res.status(200).json({ restaurantName, products });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (deletedProduct.imagePublicId) {
      await deleteImageFromCloudinary(deletedProduct.imagePublicId);
    }

    const firm = await Firm.findById(deletedProduct.firm);

    if (firm) {
      firm.products = firm.products.filter(
        (productId) => productId.toString() !== deletedProduct._id.toString()
      );
      await firm.save();
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,
  deleteProductById,
};
