import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Briefcase, User, Mail, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRoleSelect = (role) =>
    setFormData({ ...formData, role });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { username, email, password, confirmPassword, role } = formData;
    if (!username || !email || !password) { setError("All fields are required"); return; }
    if (password !== confirmPassword) { setError("Passwords do not match"); return; }
    try {
      setLoading(true);
      await register({ username, email, password, role });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800
                      flex-col justify-center px-16 py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/30 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-900/30 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">FastHire</span>
          </div>

          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Join FastHire<br />for free today
          </h2>
          <p className="text-blue-200 text-lg mb-10">
            Where talent meets opportunity.
          </p>

          <div className="space-y-4">
            {[
              'Find top opportunities instantly',
              'Apply in one click with your profile',
              'Connect with 5,000+ verified companies',
            ].map((point, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-6 w-6 bg-green-400/20 rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                </div>
                <span className="text-blue-100 text-sm">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md animate-fade-in">

          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FastHire</span>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Create account</h2>
            <p className="text-sm text-gray-500 mb-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3 mb-5">
                <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text" name="username" placeholder="John Doe"
                    value={formData.username} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email" name="email" placeholder="you@example.com"
                    value={formData.email} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 bg-white"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">I am a…</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { role: 'jobseeker', title: 'Job Seeker', sub: 'Looking for work' },
                    { role: 'employer',  title: 'Employer',   sub: 'Hiring talent'   },
                  ].map(({ role, title, sub }) => (
                    <button key={role} type="button" onClick={() => handleRoleSelect(role)}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200
                        ${formData.role === role
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
                      <p className="font-semibold text-gray-900 text-sm">{title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" placeholder="Min. 6 characters"
                    value={formData.password} onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 bg-white"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword" placeholder="Re-enter password"
                    value={formData.confirmPassword} onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               transition-all duration-200 bg-white"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 hover:scale-[1.01]
                           text-white font-semibold py-2.5 rounded-lg transition-all duration-200
                           shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                {loading ? "Creating account..." : "Create Account"}
              </button>

            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default RegisterPage;
