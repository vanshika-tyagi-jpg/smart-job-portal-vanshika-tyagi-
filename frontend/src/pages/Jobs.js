import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  // fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("https://job-portal-backend-fq1h.onrender.com/api/jobs");
        setJobs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchJobs();
  }, []);

  // apply to job
  const applyJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "https://job-portal-backend-fq1h.onrender.com/api/applications/apply",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Applied successfully ✅");
    } catch (err) {
      console.log(err);
      alert("Error applying ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        🚀 Job Portal
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
          >
            <h2 className="text-xl font-semibold text-gray-800">{job.title}</h2>

            <p className="text-gray-600 mt-1">🏢 {job.company}</p>

            <p className="text-gray-700 mt-3">{job.description}</p>

            <p className="text-sm text-gray-500 mt-2">📍 {job.location}</p>

            <button
              onClick={() => applyJob(job._id)}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
