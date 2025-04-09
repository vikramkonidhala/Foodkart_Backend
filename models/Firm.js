const mongoose = require("mongoose");

const firmSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
    unique: true,
  },
  area: {
    type: String,
    required: true,
  },
  category: {
    type: [
      {
        type: String,
        required: true,
        enum: ["veg", "non-veg"],
      },
    ],
  },
  region: {
    type: [
      {
        type: String,
        required: true,
        enum: ["south-indian", "north-indian", "chinese", "bakery"],
      },
    ],
  },
  offer: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  vendor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
  ],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Firm = mongoose.model("Firm", firmSchema);

module.exports = Firm;
