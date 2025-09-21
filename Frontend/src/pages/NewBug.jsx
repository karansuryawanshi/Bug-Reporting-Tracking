import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function NewBug({ user }) {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "Low",
  });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bugs", form);
      setMsg("Bug reported 👍");
      setTimeout(() => nav("/"), 800);
    } catch (e) {
      setMsg(e?.response?.data?.msg || "Error");
    }
  };

  if (!localStorage.getItem("token")) {
    return <div className="card">Please login to report a bug.</div>;
  }

  return (
    <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-xl w-full max-w-4xl mt-8">
      <h3 className="text-xl font-semibold mb-4 text-slate-800">
        Report a bug
      </h3>

      <form onSubmit={submit} className="space-y-4">
        {/* Title */}
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-y"
            rows="4"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Severity */}
        <div>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <button
            className="w-full sm:w-auto bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
            type="submit"
          >
            Submit
          </button>
          <div className="text-sm text-gray-500">{msg}</div>
        </div>
      </form>
    </div>
  );
}

export default NewBug;
