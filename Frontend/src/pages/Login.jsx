import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { login } from "../service/userServices";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const {setSession} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
  
      const response = await login(formData);
      // console.log(response);

      // Save authentication data
      setSession(response);

      // Clear form
      setFormData({
        email: "",
        password: "",
      });

      navigate("/dashboard"); 
    } catch (err) {
       console.log("Axios Error:", err);

        console.log("Response:", err.response);

        console.log("Data:", err.response?.data);

      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* LEFT SECTION */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-linear-to-br from-slate-900 via-blue-950 to-slate-950">
        <div className="absolute w-80 h-80 rounded-full bg-blue-500/20 blur-3xl -top-20 -left-20"></div>

        <div className="absolute w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl bottom-0 right-0"></div>

        <div className="relative z-10 flex flex-col justify-center px-20">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            P
          </div>

          <h1 className="mt-8 text-6xl font-bold text-white">
            Pay<span className="text-blue-400">Flow</span>
          </h1>

          <p className="mt-6 text-xl leading-9 text-gray-300">
            Welcome back! Securely manage your transactions, monitor your
            accounts, and stay in control of your finances.
          </p>

          <div className="mt-16 space-y-6">
            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              Bank-Grade Security
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              Real-Time Transactions
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              Smart Financial Analytics
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="mt-3 text-gray-400">
              Login to continue to your account
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-300">
                Email Address
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 focus-within:border-blue-500">
                <Mail className="h-5 w-5 text-gray-400" />

                <input
                  type="email"
                  name="email"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent p-4 text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-300">
                Password
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4 focus-within:border-blue-500">
                <Lock className="h-5 w-5 text-gray-400" />

                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent p-4 text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                "Log In..."
              ) : (
                <>
                  Login
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            Don't have an account?
            <Link
              to="/signup"
              className="ml-2 font-semibold text-blue-400 hover:text-blue-300"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;