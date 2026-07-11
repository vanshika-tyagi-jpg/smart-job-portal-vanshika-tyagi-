const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// Protected routes
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user,
  });
});

// Get full user profile from DB
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
