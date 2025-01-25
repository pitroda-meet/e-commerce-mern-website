const express = require("express");
const router = express.Router();
const {
  addCartItem,
  getCartItem,
  deleteCartItem,
  updateCartItem,
  deleteAllCartItem,
} = require("../controller/CartController");
const { protect } = require("../middelewares/protect");

router.get("/:id", protect, getCartItem);

// Route to add or update a cart item
router.post("/", protect, addCartItem);

// Route to delete a cart item
router.delete("/", protect, deleteCartItem);
router.delete("/deleteAll", protect, deleteAllCartItem);

// Route to update a cart item
router.patch("/", protect, updateCartItem);

module.exports = router;
