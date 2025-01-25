const express = require("express");
const multer = require("multer");
const path = require("path");

const {
  getProducts,
  getProduct,
  createProduct,
  AdmingetProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} = require("../controller/productController");
const { protect, admin } = require("../middelewares/protect");

const router = express.Router();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.get("/admin", protect, admin, AdmingetProducts);
router.get("/admin/:id", protect, admin, getProductById);

router.post("/admin", protect, admin, upload.single("file"), createProduct);

router.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "../../images", fileName);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(400).send("File not found");
  }
});

router.put(
  "/admin/:id/:filename",
  protect,
  admin,
  upload.single("file"),
  updateProduct
);
router.delete("/admin/:id/:filename", protect, admin, deleteProduct);
router.delete("/admin", protect, admin, deleteAllProducts);

router.get("/", getProducts);
router.get("/:id", getProduct);

module.exports = router;
