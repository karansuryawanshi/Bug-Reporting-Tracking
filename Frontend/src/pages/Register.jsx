import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

function Register({ setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      nav("/");
    } catch (e) {
      setErr(e?.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-4xl mt-8">
      <h3>Register</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <div className="flex">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          >
            Register
          </button>
          <div>{err}</div>
        </div>
      </form>
    </div>
  );
}
export default Register;
