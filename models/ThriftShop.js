const mongoose = require("mongoose");

const ThriftShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
      maxlength: 300,
    },
    image: {
      type: String,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ThriftShop", ThriftShopSchema);
