const mongoose = require("mongoose");
require("dotenv").config();

const Job = require("./models/job");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

const sampleJobs = [
  {
    title: "Frontend Developer",
    company: "TechCorp India",
    description: "We are looking for a skilled React.js developer to build amazing user interfaces. You will work with a modern tech stack including React, Tailwind CSS, and REST APIs.",
    location: "Bangalore, India",
  },
  {
    title: "Backend Engineer",
    company: "Infosys",
    description: "Join our backend team to build scalable Node.js microservices. Experience with Express, MongoDB, and cloud platforms (AWS/GCP) preferred.",
    location: "Hyderabad, India",
  },
  {
    title: "Full Stack Intern",
    company: "Startup Hub",
    description: "Exciting internship opportunity for final-year students. Work on real-world projects using MERN stack. Stipend: ₹15,000/month.",
    location: "Remote",
  },
  {
    title: "Data Science Intern",
    company: "Analytics AI",
    description: "Work on ML models, data pipelines, and dashboards. Familiarity with Python, Pandas, and Scikit-learn required. 6-month paid internship.",
    location: "Pune, India",
  },
  {
    title: "UI/UX Designer",
    company: "DesignWave",
    description: "Create beautiful product designs using Figma. Collaborate with product and engineering teams. Portfolio required.",
    location: "Mumbai, India",
  },
  {
    title: "DevOps Engineer",
    company: "CloudNine Solutions",
    description: "Manage CI/CD pipelines, Docker containers, and Kubernetes clusters. Strong knowledge of Jenkins, GitHub Actions, and AWS required.",
    location: "Delhi, India",
  },
  {
    title: "React Native Developer",
    company: "MobileFirst",
    description: "Build cross-platform mobile apps using React Native. Experience with Redux, Firebase, and native modules is a plus.",
    location: "Remote",
  },
  {
    title: "Machine Learning Engineer",
    company: "DeepTech Labs",
    description: "Train and deploy ML models at scale. Work with PyTorch, TensorFlow, and MLflow. Join a team of passionate researchers and engineers.",
    location: "Bangalore, India",
  },
  {
    title: "Software Development Intern",
    company: "Google India",
    description: "12-week summer internship for pre-final year students. Work on large-scale distributed systems. Strong DSA skills required.",
    location: "Hyderabad, India",
  },
  {
    title: "Cybersecurity Analyst",
    company: "SecureNet",
    description: "Monitor and protect company systems against cyber threats. Knowledge of SIEM tools, penetration testing, and network security required.",
    location: "Chennai, India",
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Create or find a recruiter user to own the jobs
    let recruiter = await User.findOne({ email: "recruiter@demo.com" });

    if (!recruiter) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Demo@1234", salt);

      recruiter = await User.create({
        name: "Demo Recruiter",
        email: "recruiter@demo.com",
        password: hashedPassword,
        role: "recruiter",
      });
      console.log("✅ Demo recruiter account created");
      console.log("   Email: recruiter@demo.com");
      console.log("   Password: Demo@1234");
    } else {
      console.log("ℹ️  Demo recruiter already exists");
    }

    // Clear existing jobs
    await Job.deleteMany({});
    console.log("🗑️  Cleared existing jobs");

    // Insert sample jobs
    const jobsWithOwner = sampleJobs.map((job) => ({
      ...job,
      createdBy: recruiter._id,
    }));

    await Job.insertMany(jobsWithOwner);
    console.log(`✅ Inserted ${sampleJobs.length} sample job listings`);

    console.log("\n🚀 Seed complete! Open http://localhost:3000/jobs to see them.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
}

seed();
