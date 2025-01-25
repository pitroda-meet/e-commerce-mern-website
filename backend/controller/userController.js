const User = require("../model/UserModel");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Cart = require("../model/CartModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const register = asyncHandler(async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ name, email, phone, password });

    // Create a new cart for the user
    const cart = await Cart.create({ userId: user._id, cartItems: [] });

    res.status(200).json({
      message: "Registration successful",
      token: user.generateToken(),
      userId: user._id.toString(),
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    next(error);
  }
});

const login = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userExist.password);
    if (isMatch) {
      res.status(200).json({
        message: "Login successful",
        token: userExist.generateToken(),
        userId: userExist._id.toString(),
        isAdmin: userExist.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    next(error);
  }
});
const forgotPassword = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    user.generatePasswordReset();
    await user.save();

    const resetUrl = `https://e-commerce-mern-website-cpf6.onrender.com/reset-password/${user.resetPasswordToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        ${resetUrl}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Email could not be sent:", err); // Log detailed email sending error
        return res.status(500).json({ message: "Email could not be sent" });
      }
      res.status(200).json({ message: "Reset email sent successfully" });
    });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error); // Log detailed error
    next(error);
  }
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Password reset token is invalid or has expired" });
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find({});
  res.json(user);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.isAdmin = isAdmin;
  await user.save();

  res.status(200).json({ message: "User role updated successfully", user });
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getAllUser,
  updateUserRole,
};
