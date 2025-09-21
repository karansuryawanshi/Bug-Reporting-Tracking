import React, { useState, useEffect } from "react";
import API from "../utils/api";

function Dashboard({ user }) {
  const [bugs, setBugs] = useState([]);
  const [filters, setFilters] = useState({
    status: "",
    severity: "",
    search: "",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.severity) params.severity = filters.severity;
      if (filters.search) params.search = filters.search;
      const res = await API.get("/bugs", { params });
      setBugs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const apply = () => {
    load();
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/bugs/${id}/status`, { status: newStatus });
      load();
    } catch (e) {
      alert(e?.response?.data?.msg || "Error updating");
    }
  };

  const nextStatus = (current) => {
    if (current === "Open") return "In Progress";
    if (current === "In Progress") return "Closed";
    return "Closed";
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
        <h2 className="text-xl font-semibold text-slate-700 mb-4">My Bugs</h2>
        <p className="text-sm text-slate-500 mb-4">Filter / search</p>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row w-full sm:items-center gap-4">
          <input
            className="flex-grow w-full sm:w-auto p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Search title..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />

          <select
            className="w-full sm:w-auto p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={filters.severity}
            onChange={(e) =>
              setFilters({ ...filters, severity: e.target.value })
            }
          >
            <option value="">All severities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            className="w-full sm:w-auto p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Closed</option>
          </select>

          <button
            className="w-full sm:w-auto bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-xl hover:bg-gray-300 transition duration-300 shadow-sm cursor-pointer"
            onClick={apply}
          >
            Apply
          </button>
        </div>
      </div>

      {/* Bug List */}
      {loading ? (
        <div className="flex items-center justify-center mt-8">Loading...</div>
      ) : bugs.length === 0 ? (
        <div className="card mt-8">No bugs found</div>
      ) : (
        <section className="space-y-6 mt-8">
          {bugs.map((b) => (
            <div
              key={b._id}
              className="bg-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between md:items-center gap-4"
            >
              {/* Bug Info */}
              <div className="flex-grow space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="text-lg font-semibold text-slate-800">
                    {b.title}
                  </h3>
                  {/* Status on mobile */}
                  <span
                    className={`block sm:hidden text-xs font-medium text-white px-2 py-1 rounded-full ml-auto
                  ${b.status === "Open" ? "bg-red-500" : ""}
                  ${b.status === "In Progress" ? "bg-orange-500" : ""}
                  ${b.status === "Closed" ? "bg-green-500" : ""}`}
                  >
                    {b.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{b.description}</p>
                <p className="text-xs text-slate-400">
                  Reported by: {b.reporter?.name} •{" "}
                  {new Date(b.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-start md:items-end gap-2">
                {/* Status on tablet+ */}
                <span
                  className={`hidden sm:block text-xs font-medium text-white px-3 py-1 rounded-full
                ${b.status === "Open" ? "bg-red-500" : ""}
                ${b.status === "In Progress" ? "bg-orange-500" : ""}
                ${b.status === "Closed" ? "bg-green-500" : ""}`}
                >
                  {b.status}
                </span>

                {/* Severity */}
                <span
                  className={`text-xs font-medium text-white px-3 py-1 rounded-full
                ${b.severity === "Low" ? "bg-green-500" : ""}
                ${b.severity === "Medium" ? "bg-yellow-500" : ""}
                ${b.severity === "High" ? "bg-red-500" : ""}`}
                >
                  {b.severity}
                </span>

                {/* Action button */}
                {b.status !== "Closed" && (
                  <button
                    className="text-blue-500 hover:text-blue-700 font-medium text-sm transition duration-300 mt-2 cursor-pointer"
                    onClick={() => updateStatus(b._id, nextStatus(b.status))}
                  >
                    Move → {nextStatus(b.status)}
                  </button>
                )}
              </div>
            </div>
          ))}
        </section>
      )}
    </>
  );
}
export default Dashboard;
