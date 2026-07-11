const express = require("express");
const router = express.Router();

const {
  applyJob,
  getMyApplications,
} = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

// All application routes require authentication
router.post("/apply", authMiddleware, applyJob);
router.get("/my", authMiddleware, getMyApplications);

module.exports = router;