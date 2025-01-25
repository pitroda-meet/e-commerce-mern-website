const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getAllUser,
  updateUserRole,
} = require("../controller/userController");
const { signupSchema, loginSchema } = require("../validation/auth-validation");
const validate = require("../middelewares/validate-auth");
const { protect, admin } = require("../middelewares/protect");
router.get("/getall", protect, admin, getAllUser);
router.put("/updaterole", protect, admin, updateUserRole);

router.post("/signup", validate(signupSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);

module.exports = router;
