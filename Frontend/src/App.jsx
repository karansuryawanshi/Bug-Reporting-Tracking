import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewBug from "./pages/NewBug.jsx";
import API from "./utils/api";

function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const navigate = useNavigate();

  useEffect(() => {
    // try to refresh user if token exists
    const token = localStorage.getItem("token");
    if (token && !user) {
      API.get("/auth/me")
        .then((res) => {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const header = (
    <header className="flex items-center justify-center mt-4 w-full lg:min-w-96 px-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 text-center sm:text-left">
            <h2 className="text-3xl font-bold text-slate-800">BugTracker</h2>
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end items-center space-x-2 sm:space-x-4">
            {user ? (
              <>
                <div className="text-slate-600 order-2 sm:order-none">
                  Hi, {user.name} ({user.role})
                </div>
                <Link
                  to="/new"
                  className="bg-blue-500 text-white font-medium py-2 px-4 rounded-xl hover:bg-blue-600 transition duration-300 shadow-md order-1 sm:order-none"
                >
                  Report Bug
                </Link>
                <button
                  className="text-slate-600 hover:text-slate-900 transition duration-300 order-3 sm:order-none"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="order-1 sm:order-none">
                  Login
                </Link>
                <Link to="/register" className="order-2 sm:order-none">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="w-full flex items-center justify-center">
      <div className="max-w-4xl">
        {header}
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route
            path="/login"
            element={
              <Login
                setUser={(u) => {
                  setUser(u);
                  localStorage.setItem("user", JSON.stringify(u));
                }}
              />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                setUser={(u) => {
                  setUser(u);
                  localStorage.setItem("user", JSON.stringify(u));
                }}
              />
            }
          />
          <Route path="/new" element={<NewBug user={user} />} />
          <Route
            path="*"
            element={<div className="card">Page not found</div>}
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
