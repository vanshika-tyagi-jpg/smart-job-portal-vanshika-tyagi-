const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
  updateJob,
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.get("/", getJobs);
router.get("/:id", getJobById);

// Protected routes (require login)
router.post("/", authMiddleware, createJob);
router.delete("/:id", authMiddleware, deleteJob);
router.put("/:id", authMiddleware, updateJob);

module.exports = router;