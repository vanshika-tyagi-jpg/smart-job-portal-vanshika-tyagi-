const express = require("express");
const router = express.Router();

const { createJob } = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");

// protected route
router.post("/", authMiddleware, createJob);

module.exports = router;
const { getJobs } = require("../controllers/jobController");

router.get("/", getJobs);
const { deleteJob } = require("../controllers/jobController");

router.delete("/:id", authMiddleware, deleteJob);
const { updateJob } = require("../controllers/jobController");

router.put("/:id", authMiddleware, updateJob);