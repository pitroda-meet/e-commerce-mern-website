// controllers/CartController.js
const asyncHandler = require("express-async-handler");
const Cart = require("../model/CartModel");
const Product = require("../model/ProductModel");

const getCartItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const cart = await Cart.findOne({ userId: id }).populate(
    "cartItems.productId"
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.status(200).json(cart);
});

const addCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity, userId } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      cartItems: [],
    });
  }

  const cartItem = cart.cartItems.find(
    (item) => item.productId.toString() === productId
  );

  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    cart.cartItems.push({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      quantity,
    });
  }

  await cart.save();
  res.status(200).json(cart);
});

const deleteCartItem = asyncHandler(async (req, res) => {
  const { productId, userId } = req.body;
  const cart = await Cart.findOneAndUpdate(
    { userId: userId },
    { $pull: { cartItems: { productId: productId } } },
    { new: true }
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.status(200).json(cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { userId, productId, quantity } = req.body;

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const cartItem = cart.cartItems.find(
    (item) => item.productId.toString() === productId._id
  );

  if (!cartItem) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  cartItem.quantity = quantity;
  await cart.save();

  res.status(200).json(cart);
});

const deleteAllCartItem = asyncHandler(async (req, res) => {
  const { userId } = req.body; // Fix: Use req.body instead of req.params

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.cartItems = [];
  await cart.save();

  res
    .status(200)
    .json({ message: "All cart items deleted successfully", cart });
});

module.exports = {
  getCartItem,
  addCartItem,
  deleteCartItem,
  updateCartItem,
  deleteAllCartItem,
};
