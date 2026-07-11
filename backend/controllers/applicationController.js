const Application = require("../models/Application");
const Job = require("../models/job");

// Apply to job
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existing = await Application.findOne({ user: req.user.id, job: jobId });
    if (existing) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const application = new Application({
      user: req.user.id,
      job: jobId
    });

    await application.save();

    res.status(201).json({
      message: "Applied successfully",
      application
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applied jobs for logged-in user
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id })
      .populate("job");

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};