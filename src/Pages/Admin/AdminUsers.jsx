import { useState } from "react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { initializeApp, deleteApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { auth, firebaseConfig } from "../../lib/firebase";
import { Eye, EyeOff, Loader2, UserPlus, KeyRound, Send } from "lucide-react";

export default function AdminUsers() {

  // ── Create User ─────────────────────────────────────────────────────────────
  const [create, setCreate]             = useState({ email: "", password: "", confirm: "" });
  const [showPass, setShowPass]         = useState(false);
  const [createError, setCreateError]   = useState("");
  const [createSuccess, setCreateSuccess] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const setC = (k, v) => setCreate(f => ({ ...f, [k]: v }));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError(""); setCreateSuccess("");
    if (create.password !== create.confirm) { setCreateError("Passwords do not match."); return; }
    if (create.password.length < 6)         { setCreateError("Password must be at least 6 characters."); return; }
    setCreateLoading(true);

    // Use a throwaway secondary app instance so creating the new user
    // never signs it in on the real `auth` object — otherwise Firebase
    // would kick the current admin out of their own session.
    let secondaryApp;
    try {
      secondaryApp = initializeApp(firebaseConfig, `Secondary-${Date.now()}`);
      const secondaryAuth = getAuth(secondaryApp);

      await createUserWithEmailAndPassword(secondaryAuth, create.email, create.password);
      await signOut(secondaryAuth); // don't leave a live session dangling on the secondary app

      setCreateSuccess(`User ${create.email} created successfully.`);
      setCreate({ email: "", password: "", confirm: "" });
    } catch (err) {
      setCreateError(err.message || "Failed to create user.");
    } finally {
      if (secondaryApp) {
        try { await deleteApp(secondaryApp); } catch { /* already gone, ignore */ }
      }
      setCreateLoading(false);
    }
  };

  // ── Send Password Reset Email ────────────────────────────────────────────────
  const [resetEmail, setResetEmail]     = useState("");
  const [resetError, setResetError]     = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setResetError(""); setResetSuccess("");
    if (!resetEmail.trim()) { setResetError("Email is required."); return; }
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSuccess(`Password reset email sent to ${resetEmail}.`);
      setResetEmail("");
    } catch (err) {
      setResetError(err.message || "Failed to send reset email.");
    } finally {
      setResetLoading(false);
    }
  };

  const inputClass = "w-full px-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300";

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">

        <div>
          <h1 className="text-xl font-extrabold text-slate-900">User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Create admin users and send password resets</p>
        </div>

        {/* ── Create User ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center">
              <UserPlus size={15} className="text-[#ec4899]" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Create User</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Email *</label>
              <input type="email" value={create.email} onChange={e => setC("email", e.target.value)}
                placeholder="user@novibakes.com" required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300" />
            </div>

            {/* Password + Confirm in same row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={create.password}
                    onChange={e => setC("password", e.target.value)} placeholder="Min 6 characters" required
                    className={inputClass} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Confirm Password *</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={create.confirm}
                    onChange={e => setC("confirm", e.target.value)} placeholder="Re-enter password" required
                    className={inputClass} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            {createError   && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{createError}</p>}
            {createSuccess && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">{createSuccess}</p>}

            <button type="submit" disabled={createLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ec4899] hover:bg-[#db2777] disabled:opacity-60 transition-colors">
              {createLoading ? <Loader2 size={14} className="animate-spin" /> : null}
              {createLoading ? "Creating…" : "Create User in Firebase"}
            </button>
          </form>
        </div>

        {/* ── Send Password Reset Email ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center">
              <KeyRound size={15} className="text-[#ec4899]" />
            </div>
            <h2 className="text-sm font-bold text-slate-800">Reset Password</h2>
          </div>
          <p className="text-xs text-slate-400 mb-5 ml-10">Firebase will send a password reset link to the user's email.</p>

          <form onSubmit={handleReset} className="space-y-4 max-w-sm">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">User Email *</label>
              <input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                placeholder="user@novibakes.com" required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300" />
            </div>

            {resetError   && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{resetError}</p>}
            {resetSuccess && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">{resetSuccess}</p>}

            <button type="submit" disabled={resetLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ec4899] hover:bg-[#db2777] disabled:opacity-60 transition-colors">
              {resetLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {resetLoading ? "Sending…" : "Send Reset Email"}
            </button>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
}