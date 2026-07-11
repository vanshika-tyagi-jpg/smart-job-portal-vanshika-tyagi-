const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  }
}, { timestamps: true });

applicationSchema.index({user: 1, job: 1} , {unique :true});

module.exports = mongoose.model("Application", applicationSchema);