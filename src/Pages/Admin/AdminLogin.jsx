import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { CakeSlice, Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const persistence = form.remember
        ? browserLocalPersistence
        : browserSessionPersistence;
      await setPersistence(auth, persistence);
      const result = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password,
      );
      if (result.user) {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch {
      setError("Invalid email or password.");
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch {
      setError("No account found with that email.");
    }
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100 px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Logo */}
          {/* Logo */}
          <div className="flex flex-col items-center pt-8 pb-0 px-8">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md mb-3"
              style={{ backgroundColor: "#ec4899" }}
            >
              <CakeSlice className="w-7 h-7 text-white" />
            </div>

            <h1 className="text-xl font-bold text-slate-900">NoviBakes</h1>
          </div>
          <div className="p-8 pt-3">
            {!showReset ? (
              /* ── Login form ── */
              <>
                <h2 className="text-base text-center font-semibold text-slate-700 mb-5 mt-1">
                  Sign in to continue
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, email: e.target.value }))
                        }
                        placeholder="admin@novibakes.com"
                        className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#ec4899] text-gray-700 bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, password: e.target.value }))
                        }
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#ec4899] text-gray-700 bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPass ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember me + Forgot password */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.remember}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, remember: e.target.checked }))
                        }
                        className="w-3.5 h-3.5 rounded accent-[#ec4899]"
                      />
                      <span className="text-xs text-gray-500">Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReset(true);
                        setError("");
                        setResetEmail(form.email);
                      }}
                      className="text-xs text-[#ec4899] hover:text-[#db2777] font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60 mt-2"
                    style={{ backgroundColor: "#ec4899" }}
                  >
                    {loading ? "Signing in…" : "Sign In"}
                  </button>
                </form>
              </>
            ) : (
              /* ── Reset password form ── */
              <>
                <button
                  onClick={() => {
                    setShowReset(false);
                    setResetSent(false);
                    setError("");
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 mb-5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to login
                </button>
                <h2 className="text-base font-semibold text-slate-700 mb-1">
                  Reset password
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                  We'll send a reset link to your email.
                </p>

                {resetSent ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-center">
                    <p className="text-green-700 text-sm font-semibold">
                      Email sent!
                    </p>
                    <p className="text-green-600 text-xs mt-1">
                      Check your inbox for the reset link.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="admin@novibakes.com"
                          className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#ec4899] text-gray-700 bg-white"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-60"
                      style={{ backgroundColor: "#ec4899" }}
                    >
                      {resetLoading ? "Sending…" : "Send Reset Link"}
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
