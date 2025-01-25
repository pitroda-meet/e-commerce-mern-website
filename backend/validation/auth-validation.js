const { z } = require("zod");

const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(3, { message: "Name must be at least 3 chars" })
    .max(255, { message: "Name must not be more than 255 chars" }),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 chars" }),
  phone: z
    .string({ required_error: "Phone number is required" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(15, { message: "Phone number must not exceed 15 digits" }),
});

const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 chars" }),
});

module.exports = { signupSchema, loginSchema };
