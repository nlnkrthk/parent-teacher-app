import { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("student");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `https://ptabackend.azurewebsites.net/${isSignup ? "signup" : "login"}`;
    const body = isSignup ? { name, email, password, role } : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.successfull) {
        toast.success(`${isSignup ? "Signup" : "Login"} successful!`);
        Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
        setTimeout(() => {
          if (data.user.role === "teacher") navigate("/teacher");
          else navigate("/student");
        }, 1200);
      } else {
        toast.error(data.message || "Invalid credentials!");
      }
    } catch (error) {
      toast.error("Server error! Please try again later.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#2c3e50] to-[#4ca1af]">
      <div className="bg-gray-100 text-gray-800 p-8 rounded-2xl w-96 shadow-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-2 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <select
                className="w-full p-2 border rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#2c3e50] text-white p-2 rounded hover:bg-[#34495e] transition"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p
          className="text-center mt-4 text-sm cursor-pointer hover:underline"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? "Already have an account? Login" : "New user? Sign Up"}
        </p>
      </div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
    </div>
  );
}
