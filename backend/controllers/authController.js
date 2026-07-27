import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  // Get user data from request body
  const { name, email, password } = req.body;

  // Check if email already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  // Return user info with JWT token
  return res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  // Get login credentials
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Compare entered password with hashed password
  const isMatch = await bcrypt.compare(password, user.password);

  // Reject invalid credentials
  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  // Return user info with JWT token
  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    token: generateToken(user),
  });
};