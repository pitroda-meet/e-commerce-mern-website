const mongoose = require("mongoose");

const reviewScema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
    },
    comment: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);
const productScema = mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    name: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    brand: {
      type: String,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    review: [reviewScema],
    rating: {
      type: Number,
      require: true,
    },
    numReviews: {
      type: Number,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    countInStock: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productScema);
module.exports = Product;
