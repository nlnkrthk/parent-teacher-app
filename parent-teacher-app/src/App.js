import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

function Header({ user, onLogout }) {
  return (
    <header className="flex justify-between items-center bg-gray-800 text-white p-4 shadow">
      <h1 className="text-lg font-semibold">EduConnect</h1>
      {user ? (
        <div className="flex items-center gap-4">
          <span>{user.name} ({user.role})</span>
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      ) : null}
    </header>
  );
}

function App() {
  const [user, setUser] = useState(
    Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null
  );

  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove("user");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const cookieUser = Cookies.get("user");
    if (cookieUser) setUser(JSON.parse(cookieUser));
  }, []);

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <Routes>
        {/* Root route */}
        <Route
          path="/"
          element={
            user ? (
              user.role === "teacher" ? (
                <Navigate to="/teacher" />
              ) : (
                <Navigate to="/student" />
              )
            ) : (
              <Login />
            )
          }
        />

        {/* Student dashboard */}
        <Route
          path="/student"
          element={
            user && user.role === "student" ? (
              <StudentDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Teacher dashboard */}
        <Route
          path="/teacher"
          element={
            user && user.role === "teacher" ? (
              <TeacherDashboard />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
