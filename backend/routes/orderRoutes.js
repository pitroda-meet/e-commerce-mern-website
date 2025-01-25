const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../model/OrderModel");
const router = express.Router();
const { protect, admin } = require("../middelewares/protect");
const expressAsyncHandler = require("express-async-handler");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_FNY2BJxFQpkE2l",
  key_secret: "Zyrd6ViZ87QAMm4AxhzdeAuI",
});

router.get("/order/display/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const orders = await Order.find({ user: id });
    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Updated /order/detail route handler
router.get("/order/detail", async (req, res) => {
  const { id, userId } = req.query;
  if (!id || !userId) {
    return res
      .status(400)
      .json({ message: "Order ID and User ID are required" });
  }

  try {
    const order = await Order.findOne({ user: userId, _id: id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
// images/download (1).jpeg
router.get("/order/invoice/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const doc = new PDFDocument({
      size: "A4",
      margins: { top: 50, left: 50, right: 50, bottom: 50 },
    });

    res.setHeader("Content-disposition", "attachment; filename=invoice.pdf");
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Header
    doc
      .image("images/download (1).jpeg", 50, 50, { width: 120 }) // Adjust path and size
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Your Company Name", 200, 50, { align: "right" })
      .fontSize(10)
      .font("Helvetica")
      .text("Address Line 1", 200, 65, { align: "right" })
      .text("Address Line 2", 200, 80, { align: "right" })
      .text("City, State, Zip", 200, 95, { align: "right" })
      .text("Phone: 123-456-7890", 200, 110, { align: "right" })
      .moveDown(2);

    // Invoice Details
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Invoice Details", { underline: true })
      .moveDown(0.5)
      .fontSize(10)
      .font("Helvetica")
      .text(`Date: ${new Date().toLocaleDateString()}`, 50, 160)
      .text(`Invoice Number: ${order.razorpay_order_id}`, 50, 175)
      .text(`Total Amount: ₹${order.totalPrice.toFixed(2)}`, 50, 190)
      .moveDown(2);

    // Shipping Information
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Shipping Information", { underline: true })
      .moveDown(0.5)
      .fontSize(10)
      .font("Helvetica")
      .text(`Name: ${order.username}`)
      .text(
        `Address: ${order.shippingAddress}, ${order.city}, ${order.postalCode}, ${order.country}`
      )
      .text(`Phone: ${order.phone}`)
      .moveDown(2);

    // Order Items Table
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Order Items", { underline: true })
      .moveDown(1);

    const tableStartX = 50;
    const itemWidth = 250;
    const qtyWidth = 80;
    const priceWidth = 100;
    const tableTop = doc.y;

    // Table Header
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Item", tableStartX, tableTop, { width: itemWidth, align: "left" })
      .text("Qty", tableStartX + itemWidth, tableTop, {
        width: qtyWidth,
        align: "right",
      })
      .text("Price", tableStartX + itemWidth + qtyWidth, tableTop, {
        width: priceWidth,
        align: "right",
      })
      .moveDown(1)
      .lineWidth(0.5)
      .moveTo(tableStartX, doc.y)
      .lineTo(tableStartX + itemWidth + qtyWidth + priceWidth, doc.y)
      .stroke()
      .moveDown();

    // Table Rows
    order.orderItems.forEach((item) => {
      doc
        .fontSize(10)
        .font("Helvetica")
        .text(item.name, tableStartX, doc.y, {
          width: itemWidth,
          align: "left",
        })
        .text(item.qty.toString(), tableStartX + itemWidth, doc.y, {
          width: qtyWidth,
          align: "right",
        })
        .text(
          `₹${item.price.toFixed(2)}`,
          tableStartX + itemWidth + qtyWidth,
          doc.y,
          {
            width: priceWidth,
            align: "right",
          }
        )
        .moveDown();
    });

    // Total Price
    doc
      .moveDown()
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(`Total Amount: ₹${order.totalPrice.toFixed(2)}`, { align: "right" })
      .moveDown(2);

    // Footer
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1)
      .fontSize(10)
      .font("Helvetica")
      .text("Thank you for your business!", { align: "center" })
      .moveDown(0.5)
      .text("For any inquiries, please contact us at support@yourcompany.com", {
        align: "center",
      })
      .text("Terms and Conditions apply", { align: "center" });

    doc.end();
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error(error.message);
  }
});

router.post("/order", (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: Number(amount * 100), // Convert to paise for Razorpay
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order, amount }); // Send the amount in rupees back to the frontend
      console.log(order);
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/verify", async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    user,
    orderItems,
    shippingAddress,
    city,
    postalCode,
    country,
    amount,
    username,
    phone,
  } = req.body;

  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", "Zyrd6ViZ87QAMm4AxhzdeAuI")
      .update(sign.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      const newOrder = new Order({
        user,
        orderItems,
        shippingAddress,
        city,
        postalCode,
        country,
        totalPrice: amount / 100, // Convert back to rupees before saving
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        username,
        phone,
      });

      await newOrder.save();

      res.status(200).json({ message: "Payment Successfully" }); // Use status code 200
    } else {
      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.get(
  "/orderAdmin",
  protect,
  admin,
  expressAsyncHandler(async (req, res) => {
    try {
      const order = await Order.find({});
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  })
);

router.get(
  "/orderDetailAdmin/:id",
  protect,
  admin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params; // Fixed destructuring to get the correct id

    try {
      const order = await Order.findById(id); // Corrected to findById
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  })
);

router.put(
  "/orderDetailAdmin/:id",
  protect,
  admin,
  expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (order) {
        order.Isdelivered = req.body.Isdelivered;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  })
);

module.exports = router;
