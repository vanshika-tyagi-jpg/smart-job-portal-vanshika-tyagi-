import { useEffect, useState } from "react";
import API from "../services/api";

// ─── API Integration Feature ──────────────────────────────────────────────────
// Integrates TWO external APIs via our backend proxy (no CORS issues):
//   1. Remotive API  — live remote job listings worldwide
//   2. countries.dev  — top countries by population with flags
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
    { label: "Remote jobs live", value: jobs.length },
    { label: "Companies hiring", value: new Set(jobs.map((j) => j.company_name)).size },
    { label: "Countries covered", value: countries.length },
    { label: "Job categories", value: categories.length - 1 },
  ];

  return (
    <div className="min-h-screen bg-paper px-6 py-8 max-w-6xl mx-auto font-body">
      {/* Header */}
      <div className="mb-7">
        <h1 className="font-display font-bold text-3xl text-ink">🌐 Global Remote Jobs</h1>
        <p className="text-slate text-sm mt-1.5">
          Live data from{" "}
          <a href="https://remotive.com" target="_blank" rel="noreferrer" className="text-teal font-medium hover:underline">
            Remotive API
          </a>{" "}
          &amp;{" "}
          <a href="https://countries.dev" target="_blank" rel="noreferrer" className="text-teal font-medium hover:underline">
            countries.dev
          </a>{" "}
          — real-time, no API key needed
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-24">
          <div className="text-5xl animate-spin inline-block">🔄</div>
          <p className="text-slate mt-4 text-[15px]">Fetching live remote jobs from around the world...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 text-red-600 px-5 py-4 rounded-xl text-[15px] mt-3">
          ⚠️ {error}
        </div>
      )}

      {/* Departures board */}
      {!loading && !error && (
        <>
          <div className="bg-ink rounded-2xl px-7 py-6 flex flex-wrap gap-9 mb-7">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono font-bold text-3xl tracking-wide text-amber">
                  {stat.value}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-teal-light/70 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 mb-4 flex-wrap">
            <input
              id="dashboard-search"
              className="flex-1 min-w-[220px] px-4 py-2.5 border border-line rounded-lg text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-light bg-white"
              placeholder="🔍 Search job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              id="category-filter"
              className="px-4 py-2.5 border border-line rounded-lg text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-light bg-white min-w-[200px]"
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

          <p className="text-slate text-sm mb-5">
            Showing <strong className="text-ink">{filteredJobs.length}</strong> remote job
            {filteredJobs.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" ? ` in "${selectedCategory}"` : ""}
          </p>

          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 text-slate">
              No jobs match your search. Try a different keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-line hover:shadow-md transition-shadow flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center mb-1">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company_name}
                        className="w-12 h-12 object-contain rounded-lg border border-line p-1 bg-white"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="text-3xl">🏢</div>
                    )}
                    <span className="text-[11px] font-semibold text-teal-dark bg-teal-light px-2.5 py-1 rounded-full">
                      {job.category}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-base text-ink leading-snug">
                    {job.title}
                  </h3>
                  <p className="text-slate text-[13px] font-medium">{job.company_name}</p>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {job.job_type && (
                      <span className="font-mono text-[11px] bg-teal-light text-teal-dark px-2.5 py-1 rounded-md">
                        ⏰ {job.job_type}
                      </span>
                    )}
                    {job.candidate_required_location && (
                      <span className="font-mono text-[11px] bg-amber-light text-amber-dark px-2.5 py-1 rounded-md">
                        🌍 {job.candidate_required_location}
                      </span>
                    )}
                    {job.salary && (
                      <span className="font-mono text-[11px] bg-green-50 text-green-700 px-2.5 py-1 rounded-md">
                        💰 {job.salary}
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate/70 mt-1">
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
                    className="mt-1.5 inline-block text-center py-2.5 bg-teal text-white rounded-lg font-semibold text-[13px] hover:bg-teal-dark transition-colors"
                   >
                    View &amp; apply →
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Countries Section */}
          {countries.length > 0 && (
            <div className="mt-14 pt-9 border-t border-line">
              <h2 className="font-display font-bold text-xl text-ink mb-1.5">
                🌍 Top countries in the global job market
              </h2>
              <p className="text-slate text-sm mb-6">
                Data via{" "}
                <a href="https://countries.dev" target="_blank" rel="noreferrer" className="text-teal font-medium hover:underline">
                  countries.dev
                </a>{" "}
                — top 30 countries by population
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {countries.map((country) => (
                  <div
                    key={country.name}
                    className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border border-line"
                  >
                    <img
                      src={country.flags.svg}
                      alt={country.name}
                      className="w-13 h-8 object-cover rounded shadow-sm"
                    />
                    <span className="text-[10px] text-ink/80 text-center font-medium leading-tight">
                      {country.name}
                    </span>
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

export default Dashboard;