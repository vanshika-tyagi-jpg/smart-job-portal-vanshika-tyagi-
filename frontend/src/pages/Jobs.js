import { useEffect, useState } from "react";
import { getAllJobs, createJob, deleteJob, applyToJob } from "../services/api";
import { useAuth } from "../context/AuthContext";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", company: "", description: "", location: "" });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const { isLoggedIn, user } = useAuth();

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getAllJobs();
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!isLoggedIn) {
      alert("Please login to apply for a job.");
      return;
    }
    try {
      await applyToJob(jobId);
      alert("Applied successfully ✅");
    } catch (err) {
      alert(err.response?.data?.message || "Error applying. Please try again.");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting job.");
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      const res = await createJob(form);
      setJobs((prev) => [res.data.job, ...prev]);
      setForm({ title: "", company: "", description: "", location: "" });
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to post job.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🚀 Job Listings</h1>
          <p style={styles.subtitle}>{jobs.length} opportunities available</p>
        </div>
        {isLoggedIn && user?.role === "recruiter" && (
          <button
            id="toggle-post-job"
            onClick={() => setShowForm((v) => !v)}
            style={styles.postBtn}
          >
            {showForm ? "✕ Cancel" : "+ Post a Job"}
          </button>
        )}
      </div>

      {/* Post Job Form (Recruiter only) */}
      {showForm && (
        <form style={styles.postForm} onSubmit={handlePostJob}>
          <h3 style={{ marginTop: 0, color: "#1e3a8a" }}>Post a New Job</h3>
          {formError && <div style={styles.errorBox}>{formError}</div>}
          <div style={styles.formGrid}>
            <input
              id="job-title"
              style={styles.formInput}
              placeholder="Job Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              id="job-company"
              style={styles.formInput}
              placeholder="Company Name *"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <input
              id="job-location"
              style={styles.formInput}
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <textarea
              id="job-description"
              style={{ ...styles.formInput, gridColumn: "1 / -1", minHeight: "80px", resize: "vertical" }}
              placeholder="Job Description *"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <button id="submit-job" type="submit" style={styles.submitBtn} disabled={formLoading}>
            {formLoading ? "Posting..." : "Post Job"}
          </button>
        </form>
      )}

      {/* Job Cards */}
      {loading ? (
        <div style={styles.loading}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={styles.empty}>No jobs posted yet. Be the first!</div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.jobTitle}>{job.title}</h2>
                  <p style={styles.company}>🏢 {job.company}</p>
                </div>
                <span style={styles.locationBadge}>📍 {job.location || "Remote"}</span>
              </div>

              <p style={styles.description}>{job.description}</p>

              {job.createdBy && (
                <p style={styles.postedBy}>
                  Posted by {job.createdBy.name}
                </p>
              )}

              <div style={styles.cardFooter}>
                <button
                  id={`apply-${job._id}`}
                  onClick={() => handleApply(job._id)}
                  style={styles.applyBtn}
                >
                  Apply Now
                </button>

                {/* Show delete button only to the job's creator */}
                {isLoggedIn && user?.id === job.createdBy?._id && (
                  <button
                    id={`delete-${job._id}`}
                    onClick={() => handleDelete(job._id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
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
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    color: "#1e3a8a",
    fontWeight: "800",
  },
  subtitle: {
    margin: "4px 0 0",
    color: "#6b7280",
    fontSize: "15px",
  },
  postBtn: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  postForm: {
    background: "white",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    marginBottom: "28px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "16px",
  },
  formInput: {
    padding: "11px 14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
  },
  submitBtn: {
    padding: "11px 28px",
    backgroundColor: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "12px",
  },
  loading: {
    textAlign: "center",
    padding: "60px",
    color: "#6b7280",
    fontSize: "16px",
  },
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
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    border: "1px solid #f0f0f0",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
  },
  jobTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e293b",
  },
  company: {
    margin: "4px 0 0",
    color: "#4b5563",
    fontSize: "14px",
  },
  locationBadge: {
    fontSize: "12px",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    padding: "4px 10px",
    borderRadius: "20px",
    whiteSpace: "nowrap",
  },
  description: {
    color: "#374151",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: 0,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  postedBy: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
  cardFooter: {
    display: "flex",
    gap: "10px",
    marginTop: "6px",
  },
  applyBtn: {
    flex: 1,
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  deleteBtn: {
    padding: "10px 14px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
  },
};

export default Jobs;
