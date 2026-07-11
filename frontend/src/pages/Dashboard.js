import { useEffect, useState } from "react";
import API from "../services/api";

// ─── API Integration Feature ──────────────────────────────────────────────────
// Integrates TWO external APIs via our backend proxy (no CORS issues):
//   1. Remotive API  — live remote job listings worldwide
//   2. RestCountries API — top countries by population with flags
// ──────────────────────────────────────────────────────────────────────────────

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch both APIs in parallel through our backend proxy
        const [jobsRes, countriesRes] = await Promise.all([
          API.get("/api/external/remote-jobs?limit=20"),
          API.get("/api/external/countries"),
        ]);

        setJobs(jobsRes.data.jobs || []);
        setCountries(countriesRes.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = ["All", ...new Set(jobs.map((j) => j.category))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const stats = [
    { label: "Remote Jobs Live", value: jobs.length, icon: "💼", color: "#2563eb" },
    {
      label: "Companies Hiring",
      value: new Set(jobs.map((j) => j.company_name)).size,
      icon: "🏢",
      color: "#16a34a",
    },
    { label: "Countries Covered", value: countries.length, icon: "🌍", color: "#d97706" },
    { label: "Job Categories", value: categories.length - 1, icon: "📂", color: "#7c3aed" },
  ];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🌐 Global Remote Jobs</h1>
          <p style={styles.subtitle}>
            Live data from{" "}
            <a
              href="https://remotive.com"
              target="_blank"
              rel="noreferrer"
              style={styles.apiLink}
            >
              Remotive API
            </a>{" "}
            &amp;{" "}
            <a
              href="https://restcountries.com"
              target="_blank"
              rel="noreferrer"
              style={styles.apiLink}
            >
              RestCountries API
            </a>{" "}
            — real-time, no API key needed
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={styles.loadingWrap}>
          <div style={styles.spinner}>🔄</div>
          <p style={{ color: "#6b7280", marginTop: "16px", fontSize: "15px" }}>
            Fetching live remote jobs from around the world...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={styles.errorBox}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      {!loading && !error && (
        <>
          <div style={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} style={styles.statCard}>
                <div style={{ fontSize: "30px" }}>{stat.icon}</div>
                <div>
                  <div style={{ ...styles.statValue, color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={styles.statLabel}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div style={styles.controls}>
            <input
              id="dashboard-search"
              style={styles.searchInput}
              placeholder="🔍 Search job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              id="category-filter"
              style={styles.select}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <p style={styles.resultCount}>
            Showing <strong>{filteredJobs.length}</strong> remote job
            {filteredJobs.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
          </p>

          {filteredJobs.length === 0 ? (
            <div style={styles.empty}>
              No jobs match your search. Try a different keyword.
            </div>
          ) : (
            <div style={styles.grid}>
              {filteredJobs.map((job) => (
                <div key={job.id} style={styles.card}>
                  <div style={styles.cardTop}>
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company_name}
                        style={styles.logo}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div style={styles.logoPlaceholder}>🏢</div>
                    )}
                    <span style={styles.categoryBadge}>{job.category}</span>
                  </div>

                  <h3 style={styles.jobTitle}>{job.title}</h3>
                  <p style={styles.company}>{job.company_name}</p>

                  <div style={styles.tags}>
                    {job.job_type && (
                      <span style={styles.tag}>⏰ {job.job_type}</span>
                    )}
                    {job.candidate_required_location && (
                      <span
                        style={{
                          ...styles.tag,
                          backgroundColor: "#fef3c7",
                          color: "#92400e",
                        }}
                      >
                        🌍 {job.candidate_required_location}
                      </span>
                    )}
                    {job.salary && (
                      <span
                        style={{
                          ...styles.tag,
                          backgroundColor: "#d1fae5",
                          color: "#065f46",
                        }}
                      >
                        💰 {job.salary}
                      </span>
                    )}
                  </div>

                  <p style={styles.publishedDate}>
                    Posted:{" "}
                    {new Date(job.publication_date).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <a
                    id={`remote-job-${job.id}`}
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.applyLink}
                  >
                    View &amp; Apply →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Countries Section */}
          {countries.length > 0 && (
            <div style={styles.countriesSection}>
              <h2 style={styles.sectionTitle}>
                🌍 Top Countries in the Global Job Market
              </h2>
              <p style={styles.sectionSubtitle}>
                Data via{" "}
                <a
                  href="https://restcountries.com"
                  target="_blank"
                  rel="noreferrer"
                  style={styles.apiLink}
                >
                  RestCountries API
                </a>{" "}
                — top 30 countries by population
              </p>
              <div style={styles.flagsGrid}>
                {countries.map((country) => (
                  <div key={country.name.common} style={styles.flagCard}>
                    <img
                      src={country.flags.svg}
                      alt={country.name.common}
                      style={styles.flag}
                    />
                    <span style={styles.countryName}>{country.name.common}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    padding: "32px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: { marginBottom: "28px" },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#1e3a8a",
    fontWeight: "800",
  },
  subtitle: { margin: "6px 0 0", color: "#6b7280", fontSize: "14px" },
  apiLink: { color: "#2563eb", textDecoration: "none", fontWeight: "500" },
  loadingWrap: { textAlign: "center", padding: "100px 20px" },
  spinner: { fontSize: "52px", animation: "spin 1s linear infinite" },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "16px 20px",
    borderRadius: "10px",
    fontSize: "15px",
    marginTop: "12px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statValue: { fontSize: "28px", fontWeight: "800", lineHeight: "1" },
  statLabel: { color: "#6b7280", fontSize: "12px", marginTop: "4px" },
  controls: {
    display: "flex",
    gap: "12px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  searchInput: {
    flex: 1,
    minWidth: "220px",
    padding: "11px 16px",
    border: "1.5px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
  },
  select: {
    padding: "11px 16px",
    border: "1.5px solid #d1d5db",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
    backgroundColor: "white",
    minWidth: "200px",
  },
  resultCount: { color: "#6b7280", fontSize: "14px", margin: "0 0 20px 0" },
  empty: {
    textAlign: "center",
    padding: "60px",
    color: "#9ca3af",
    fontSize: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "14px",
    padding: "22px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    border: "1px solid #f0f0f0",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  logo: {
    width: "48px",
    height: "48px",
    objectFit: "contain",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "4px",
    backgroundColor: "white",
  },
  logoPlaceholder: { fontSize: "32px" },
  categoryBadge: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#7c3aed",
    backgroundColor: "#ede9fe",
    padding: "4px 10px",
    borderRadius: "20px",
  },
  jobTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#1e293b",
    lineHeight: "1.4",
  },
  company: { margin: 0, color: "#4b5563", fontSize: "13px", fontWeight: "500" },
  tags: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "4px" },
  tag: {
    fontSize: "11px",
    padding: "3px 9px",
    backgroundColor: "#eff6ff",
    color: "#2563eb",
    borderRadius: "20px",
    fontWeight: "500",
  },
  publishedDate: { margin: 0, color: "#9ca3af", fontSize: "11px" },
  applyLink: {
    display: "inline-block",
    marginTop: "8px",
    padding: "9px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "center",
  },
  countriesSection: {
    marginTop: "52px",
    paddingTop: "36px",
    borderTop: "1px solid #e5e7eb",
  },
  sectionTitle: {
    margin: "0 0 6px",
    fontSize: "22px",
    color: "#1e3a8a",
    fontWeight: "700",
  },
  sectionSubtitle: { margin: "0 0 24px", color: "#6b7280", fontSize: "14px" },
  flagsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: "12px",
  },
  flagCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    padding: "12px 8px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
    border: "1px solid #f0f0f0",
  },
  flag: {
    width: "52px",
    height: "32px",
    objectFit: "cover",
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
  },
  countryName: {
    fontSize: "10px",
    color: "#374151",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: "1.3",
  },
};

export default Dashboard;
