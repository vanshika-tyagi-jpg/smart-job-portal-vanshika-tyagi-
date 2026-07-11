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
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate font-body">
        <div className="text-4xl mb-3">⏳</div>
        <p>Loading your applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper px-6 py-8 max-w-3xl mx-auto font-body">
      <div className="mb-7">
        <h1 className="font-display font-bold text-3xl text-ink">📋 My applications</h1>
        <p className="text-slate text-sm mt-1.5">
          {apps.length > 0
            ? `You have applied to ${apps.length} job${apps.length > 1 ? "s" : ""}`
            : "No applications yet"}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-5">{error}</div>
      )}

      {apps.length === 0 && !error ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-slate text-base">You haven't applied to any jobs yet.</p>
          <a
            href="/jobs"
            className="inline-block mt-4 px-6 py-2.5 bg-teal text-white rounded-lg font-semibold hover:bg-teal-dark transition-colors"
          >
            Browse jobs →
          </a>
        </div>
      ):(
        <div className="flex flex-col gap-4">
          {apps.map((app) => (
            <div
              key={app._id}
              className="bg-white border border-line rounded-2xl flex overflow-hidden"
            >
              <div className="flex-1 p-5 flex items-start gap-4">
                <div className="text-2xl shrink-0">💼</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-base text-ink mb-0.5">
                    {app.job?.title || "Job removed"}
                  </h3>
                  <p className="text-slate text-sm mb-0.5">🏢 {app.job?.company || "N/A"}</p>
                  {app.job?.location && (
                    <p className="text-slate text-xs mb-0.5">📍 {app.job.location}</p>
                  )}
                  <p className="font-mono text-[11px] text-slate/70 mt-2">
                    Applied on:{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Ticket stub — stamped */}
              <div className="w-[110px] shrink-0 bg-teal-light border-l-2 border-dashed border-teal flex items-center justify-center px-2">
                <span className="font-mono text-xs font-semibold text-teal-dark uppercase tracking-wide text-center">
                  ✅ Applied
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;