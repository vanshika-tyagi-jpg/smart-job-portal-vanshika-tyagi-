const Application = require("../models/Application");

// Apply to job
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

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