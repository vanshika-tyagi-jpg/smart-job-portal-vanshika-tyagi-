const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not set");

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running ");
});


const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);


app.get("/api/external/remote-jobs", async (req, res) => {
  try {
    const { search = "", limit = 20 } = req.query;
    const url = `https://remotive.com/api/remote-jobs?limit=${limit}${search ? `&search=${search}` : ""}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Remotive API error:", error.message);
    res.status(500).json({ error: "Failed to fetch remote jobs" });
  }
});

// Proxy: countries.dev (RestCountries v3.1 replacement — v3.1 was deprecated)
app.get("/api/external/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://countries.dev/countries?fields=name,flags,region,population&sort=population&order=desc&limit=30"
    );
    res.json(response.data);
  } catch (error) {
    console.error("Countries API error:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected -----"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
