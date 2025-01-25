const asyncHandler = require("express-async-handler");
const Product = require("../model/ProductModel");
const path = require("path");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

const AdmingetProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, category, description, price, countInStock } = req.body;

  // if (!req.file) {
  //   return res.status(400).json({ message: "No file uploaded." });
  // }

  const image = req.file ? req.file.filename : null;

  try {
    const product = new Product({
      name,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
    });

    const createdProduct = await product.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: createdProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const updateProduct = asyncHandler(async (req, res) => {
  const { name, brand, category, description, price, countInStock } = req.body;
  const id = req.params.id;
  const newFileName = req.file ? req.file.filename : null;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  try {
    const product = await Product.findById(id);
    if (product) {
      if (newFileName) {
        // Remove old image if new image is uploaded
        if (product.image) {
          const oldFilePath = path.join(
            __dirname,
            "../../images",
            product.image
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        product.image = newFileName;
      }

      product.name = name || product.name;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price || product.price;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { id, filename } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Product ID" });
    }

    const result = await Product.deleteOne({ _id: id });
    const filePath = path.join(__dirname, "../../images", filename);

    if (result.deletedCount > 0) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return res.status(500).json({ message: "Error deleting file" });
        }
        res.json({ message: "Product and image removed successfully" });
      });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

const deleteAllProducts = asyncHandler(async (req, res) => {
  try {
    const result = await Product.deleteMany({});
    if (result.deletedCount > 0) {
      res.json({
        message: `${result.deletedCount} products removed successfully`,
      });
    } else {
      res.status(404).json({ message: "No products found" });
    }
  } catch (error) {
    console.error("Error deleting all products:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = {
  getProducts,
  deleteAllProducts,
  getProduct,
  createProduct,
  AdmingetProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
