import { useEffect, useState } from "react";
import { getMyApplications } from "../services/api";

function MyApplications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getMyApplications();
        setApps(res.data);
      } catch (err) {
        setError("Failed to load your applications. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return (
      <div style={styles.centered}>
        <div style={styles.spinner}>⏳</div>
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>📋 My Applications</h1>
        <p style={styles.subtitle}>
          {apps.length > 0
            ? `You have applied to ${apps.length} job${apps.length > 1 ? "s" : ""}`
            : "No applications yet"}
        </p>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      {apps.length === 0 && !error ? (
        <div style={styles.empty}>
          <div style={{ fontSize: "52px", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            You haven't applied to any jobs yet.
          </p>
          <a href="/jobs" style={styles.browseLink}>Browse Jobs →</a>
        </div>
      ) : (
        <div style={styles.grid}>
          {apps.map((app) => (
            <div key={app._id} style={styles.card}>
              <div style={styles.cardIcon}>💼</div>
              <div style={styles.cardBody}>
                <h3 style={styles.jobTitle}>{app.job?.title || "Job Removed"}</h3>
                <p style={styles.company}>🏢 {app.job?.company || "N/A"}</p>
                {app.job?.location && (
                  <p style={styles.location}>📍 {app.job.location}</p>
                )}
                <p style={styles.appliedDate}>
                  Applied on: {new Date(app.createdAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span style={styles.statusBadge}>Applied ✅</span>
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
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "28px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    color: "#1e3a8a",
    fontWeight: "800",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
    fontSize: "15px",
  },
  centered: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "60vh",
    color: "#6b7280",
  },
  spinner: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
  },
  browseLink: {
    display: "inline-block",
    marginTop: "16px",
    padding: "10px 24px",
    backgroundColor: "#2563eb",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    border: "1px solid #f0f0f0",
  },
  cardIcon: {
    fontSize: "28px",
    flexShrink: 0,
  },
  cardBody: {
    flex: 1,
  },
  jobTitle: {
    margin: "0 0 4px",
    fontSize: "17px",
    fontWeight: "700",
    color: "#1e293b",
  },
  company: {
    margin: "0 0 4px",
    color: "#4b5563",
    fontSize: "14px",
  },
  location: {
    margin: "0 0 4px",
    color: "#6b7280",
    fontSize: "13px",
  },
  appliedDate: {
    margin: "8px 0 0",
    color: "#9ca3af",
    fontSize: "12px",
  },
  statusBadge: {
    flexShrink: 0,
    padding: "5px 12px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
};

export default MyApplications;