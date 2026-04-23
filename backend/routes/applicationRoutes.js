const express = require("express");
const router = express.Router();

const { applyJob } = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/apply", authMiddleware, applyJob);

module.exports = router;

const { getMyApplications } = require("../controllers/applicationController");

router.get("/my", authMiddleware, getMyApplications);