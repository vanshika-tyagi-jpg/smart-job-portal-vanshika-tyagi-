const Job = require("../models/job");

// Create Job
exports.createJob = async (req, res) => {
  try {
    const { title, company, description, location } = req.body;

    const job = new Job({
      title,
      company,
      description,
      location,
      createdBy: req.user.id
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get all jobs
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("createdBy", "name email");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found ❌" });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: "Job deleted successfully 🗑️" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Job updated successfully ✏️",
      job,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};