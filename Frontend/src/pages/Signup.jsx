import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { signup } from "../service/userServices";

function Signup() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

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
      const response = await signup(formData);

      console.log(response);

      setFormData({
        name: "",
        email: "",
        password: "",
      });

      navigate("/login");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Unable to create account."
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
            Secure digital payments, smart transaction tracking and
            modern banking — all in one platform.
          </p>

          <div className="mt-16 space-y-6">
            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              Secure Authentication
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              Instant Transactions
            </div>

            <div className="flex items-center gap-4 text-gray-300">
              <span className="text-green-400 text-xl">✓</span>
              Analytics Dashboard
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-6 py-10">
        <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-2xl p-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-white">
              Create Account
            </h2>

            <p className="mt-3 text-gray-400">
              Start managing your finances today.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* NAME */}
            <div>
              <label className="text-sm text-gray-300">
                Full Name
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4">
                <User className="w-5 h-5 text-gray-400" />

                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent p-4 text-white placeholder-gray-500 outline-none"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm text-gray-300">
                Email Address
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4">
                <Mail className="w-5 h-5 text-gray-400" />

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

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-300">
                Password
              </label>

              <div className="mt-2 flex items-center rounded-xl border border-slate-700 bg-slate-800 px-4">
                <Lock className="w-5 h-5 text-gray-400" />

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
                "Creating Account..."
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400">
            Already have an account?
            <Link
              to="/Login"
              className="ml-2 font-semibold text-blue-400 hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;