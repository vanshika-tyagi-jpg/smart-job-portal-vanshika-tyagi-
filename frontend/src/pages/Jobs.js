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

  // Derive a short "airport code" style badge from the job title —
  // e.g. "Senior Frontend Engineer" -> "SFE"
  const codeFor = (title) =>
    title
      .split(" ")
      .filter((w) => w.length > 0)
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

  return (
    <div className="min-h-screen bg-paper px-6 py-8 max-w-6xl mx-auto font-body">
      {/* Header */}
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="font-display font-bold text-3xl text-ink">🚀 Job Listings</h1>
          <p className="text-slate text-sm mt-1">{jobs.length} opportunities available</p>
        </div>
        {isLoggedIn && user?.role === "recruiter" && (
          <button
            id="toggle-post-job"
            onClick={() => setShowForm((v) => !v)}
            className="px-5 py-2.5 bg-teal text-white rounded-lg font-semibold text-sm hover:bg-teal-dark transition-colors"
          >
            {showForm ? "✕ Cancel" : "+ Post a Job"}
          </button>
        )}
      </div>

      {/* Post Job Form (Recruiter only) */}
      {showForm && (
        <form
          onSubmit={handlePostJob}
          className="bg-white p-7 rounded-2xl shadow-sm border border-line mb-7"
        >
          <h3 className="font-display font-bold text-lg text-ink mb-3">Post a new job</h3>
          {formError && (
            <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-sm mb-3">
              {formError}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <input
              id="job-title"
              className="px-3.5 py-2.5 border border-line rounded-lg text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
              placeholder="Job title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
            <input
              id="job-company"
              className="px-3.5 py-2.5 border border-line rounded-lg text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
              placeholder="Company name *"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <input
              id="job-location"
              className="px-3.5 py-2.5 border border-line rounded-lg text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-light"
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <textarea
              id="job-description"
              className="col-span-2 px-3.5 py-2.5 border border-line rounded-lg text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal-light min-h-[80px] resize-y"
              placeholder="Job description *"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <button
            id="submit-job"
            type="submit"
            disabled={formLoading}
            className="px-7 py-2.5 bg-amber text-amber-dark font-semibold text-sm rounded-lg hover:bg-amber-dark hover:text-amber-light transition-colors disabled:opacity-60"
          >
            {formLoading ? "Posting..." : "Post job"}
          </button>
        </form>
      )}

      {/* Job Cards */}
      {loading ? (
        <div className="text-center py-16 text-slate">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-slate">No jobs posted yet. Be the first!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white border border-line rounded-2xl flex overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Main content */}
              <div className="flex-1 p-5">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h2 className="font-display font-bold text-lg text-ink">{job.title}</h2>
                </div>
                <p className="text-slate text-sm mb-3">🏢 {job.company}</p>

                <p className="text-ink/80 text-sm leading-relaxed mb-4 line-clamp-3">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="font-mono text-xs bg-amber-light text-amber-dark px-2.5 py-1 rounded-md">
                    📍 {job.location || "Remote"}
                  </span>
                </div>

                {job.createdBy && (
                  <p className="text-xs text-slate/70 mb-3">Posted by {job.createdBy.name}</p>
                )}

                <div className="flex gap-2.5">
                  <button
                    id={`apply-${job._id}`}
                    onClick={() => handleApply(job._id)}
                    className="flex-1 py-2.5 bg-teal text-white rounded-lg font-semibold text-sm hover:bg-teal-dark transition-colors"
                  >
                    Apply now
                  </button>

                  {isLoggedIn && user?.id === job.createdBy?._id && (
                    <button
                      id={`delete-${job._id}`}
                      onClick={() => handleDelete(job._id)}
                      className="px-3.5 py-2.5 bg-red-50 text-red-600 rounded-lg font-medium text-xs hover:bg-red-100 transition-colors"
                    >
                      🗑️ Delete
                    </button>
                  )}
                </div>
              </div>

              {/* Boarding-pass stub */}
              <div className="w-[92px] shrink-0 bg-teal-light border-l-2 border-dashed border-teal flex flex-col items-center justify-center gap-1.5 px-2">
                <span className="font-mono font-bold text-xl text-teal-dark">
                  {codeFor(job.title)}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-teal-dark text-center">
                  {job.location ? job.location.split(",")[0] : "Remote"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;