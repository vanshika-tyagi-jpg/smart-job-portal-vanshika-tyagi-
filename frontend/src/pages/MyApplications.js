import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/applications/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setApps(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Applications</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apps.map(app => (
          <div key={app._id} className="bg-white p-5 rounded-xl shadow">
            <h3>{app.job.title}</h3>
            <p>{app.job.company}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;