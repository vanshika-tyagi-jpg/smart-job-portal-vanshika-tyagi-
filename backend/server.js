const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("Backend running ✅");
});

// ─── Routes ───────────────────────────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ─── External API Proxy (avoids browser CORS issues) ─────────────────────────

// Proxy: Remotive remote jobs API
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

// Proxy: RestCountries API
app.get("/api/external/countries", async (req, res) => {
  try {
    const response = await axios.get(
      "https://restcountries.com/v3.1/all?fields=name,flags,region,population"
    );
    // Sort by population descending, return top 30
    const sorted = response.data
      .sort((a, b) => b.population - a.population)
      .slice(0, 30);
    res.json(sorted);
  } catch (error) {
    console.error("RestCountries API error:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected -----"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
