import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">🚀 Job Portal</h1>

      <div className="space-x-6">
        <Link
          to="/jobs"
          className={`${
            location.pathname === "/jobs"
              ? "text-blue-600 font-semibold"
              : "text-gray-600"
          } hover:text-blue-500`}
        >
          Jobs
        </Link>

        <Link
          to="/applications"
          className={`${
            location.pathname === "/applications"
              ? "text-blue-600 font-semibold"
              : "text-gray-600"
          } hover:text-blue-500`}
        >
          My Applications
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
