import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  CakeSlice, LayoutDashboard, ShoppingBag,
  LogOut, ChevronLeft, ChevronRight, ChevronDown, Users,
  PackageSearch, Image, Megaphone, Tag, Menu, X,
  KeyRound, Loader2,
} from "lucide-react";
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/firebase";

const NAV = [
  { to: "/admin/dashboard",      icon: LayoutDashboard, label: "Dashboard"      },
  { to: "/admin/orders",         icon: ShoppingBag,     label: "Orders"         },
  { to: "/admin/products",       icon: PackageSearch,   label: "Products"       },
  { to: "/admin/categories",     icon: Tag,             label: "Categories"     },
  { to: "/admin/banners",        icon: Image,           label: "Banners"        },
  { to: "/admin/scrolling-text", icon: Megaphone,       label: "Scrolling Text" },
  { to: "/admin/users",          icon: Users,           label: "Users"          },
];

const PRIMARY_NAV = NAV.slice(0, 4);
const MORE_NAV    = NAV.slice(4);
const PAGE_TITLES = Object.fromEntries(NAV.map(n => [n.to, n.label]));

function useCurrentUser() {
  const [user, setUser]           = useState(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, authLoading };
}

// ── Change Password Modal ─────────────────────────────────────────────────────
function ChangePasswordModal({ defaultEmail, onClose }) {
  const [email, setEmail]     = useState(defaultEmail || "");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!email.trim()) { setError("Email is required."); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess(`Password reset email sent to ${email}.`);
      setEmail("");
    } catch (err) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-slate-800">Reset Password</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="user@novibakes.com" required
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          {error   && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>}
          {success && <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">{success}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ec4899] hover:bg-[#db2777] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Sending…</> : "Send Reset Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Profile Dropdown ──────────────────────────────────────────────────────────
function ProfileDropdown({ displayName, email, onLogout, onChangePassword, loggingOut }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = (displayName || "A").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="flex items-center gap-2 cursor-pointer">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm" style={{ backgroundColor: "#ec4899" }}>
          {initial}
        </div>
        <div className="hidden lg:block text-left">
          <p className="text-xs font-semibold text-slate-800 leading-none">{displayName}</p>
          <p className="text-[10px] text-slate-400 mt-0.5">{email || "Administrator"}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50">
          <button
            onClick={() => { setOpen(false); onChangePassword(); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-pink-50 hover:text-[#ec4899] transition-colors"
          >
            <KeyRound size={14} /> Change Password
          </button>
          <div className="border-t border-gray-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {loggingOut
                ? <><Loader2 size={14} className="animate-spin" /> Logging out…</>
                : <><LogOut size={14} /> Logout</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Layout ────────────────────────────────────────────────────────────────────
export default function AdminLayout({ children }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, authLoading } = useCurrentUser();
  const [moreOpen, setMoreOpen]           = useState(false);
  const [showChangePwd, setShowChangePwd] = useState(false);
  const [loggingOut, setLoggingOut]       = useState(false);

  // ── Auth guard: redirect to login if session is gone ──
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login", { replace: true });
    }
  }, [authLoading, user, navigate]);

  const displayName = user?.displayName || user?.email?.split("@")[0] || "Admin";
  const userEmail   = user?.email || "";

  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem("nb_sidebar_collapsed") === "true"; }
    catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem("nb_sidebar_collapsed", collapsed); } catch {}
  }, [collapsed]);

  useEffect(() => { setMoreOpen(false); }, [location.pathname]);

  // ── Fix: setLoggingOut(false) BEFORE navigate so state update hits mounted component ──
  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign-out failed:", err);
    } finally {
      localStorage.removeItem("nb_admin");
      sessionStorage.removeItem("nb_admin");
      setLoggingOut(false);        // ← set state before navigating away
      navigate("/admin/login");
    }
  };

  const pageTitle = PAGE_TITLES[location.pathname] || "Admin";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "short", year: "numeric",
  });

  // Show nothing while Firebase resolves auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#ec4899]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-14 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#ec4899" }}>
            <CakeSlice className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-slate-900 text-sm font-bold leading-none">NoviBakes</p>
            <p className="text-slate-400 text-[10px]">{pageTitle}</p>
          </div>
        </div>
        <button
          onClick={logout}
          disabled={loggingOut}
          className="text-slate-400 hover:text-red-500 p-1.5 transition-colors disabled:opacity-50"
        >
          {loggingOut
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <LogOut className="w-4 h-4" />
          }
        </button>
      </header>

      {/* ── Desktop sidebar ── */}
      <aside className={`hidden md:flex fixed top-0 left-0 h-full flex-col z-40 bg-[#111827] transition-all duration-300 shadow-xl ${collapsed ? "w-16" : "w-56"}`}>

        <div className={`flex flex-col items-center border-b border-white/10 shrink-0 ${collapsed ? "py-4 px-2 gap-1" : "py-5 px-4 gap-2"}`}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[#ec4899] shadow-lg shadow-pink-900/40 shrink-0">
            <CakeSlice className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="text-center">
              <p className="text-white text-base font-extrabold leading-tight tracking-wide">NoviBakes</p>
              <p className="text-white/35 text-sm mt-0.5">Admin Panel</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto scrollbar-none" style={{ scrollbarWidth: "none" }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  collapsed ? "justify-center" : ""
                } ${isActive
                  ? "bg-[#ec4899] text-white shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/[0.08]"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
              {collapsed && (
                <span className="absolute left-14 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity shadow-lg z-50">
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-2 pb-4 border-t border-white/10 pt-3">
          <button
            onClick={() => setCollapsed(c => !c)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-white/40 hover:text-white hover:bg-white/[0.08] transition-all ${collapsed ? "justify-center" : ""}`}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* ── Content area ── */}
      <div className={`transition-all duration-300 min-h-screen flex flex-col pt-14 md:pt-0 pb-20 md:pb-0 ${collapsed ? "md:ml-16" : "md:ml-56"}`}>

        <header className="hidden md:flex items-center justify-between bg-white border-b border-gray-100 px-6 h-14 shadow-sm shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span className="font-medium text-slate-500">NoviBakes</span>
            <span>›</span>
            <span className="font-semibold text-slate-800">{pageTitle}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-500 font-medium">{today}</span>
            </div>
            <div className="h-6 w-px bg-gray-100" />
            <ProfileDropdown
              displayName={displayName}
              email={userEmail}
              onLogout={logout}
              onChangePassword={() => setShowChangePwd(true)}
              loggingOut={loggingOut}
            />
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* ── Mobile: "More" slide-up drawer ── */}
      {moreOpen && (
        <>
          <div className="md:hidden fixed inset-0 z-40 bg-black/20" onClick={() => setMoreOpen(false)} />
          <div className="md:hidden fixed bottom-16 inset-x-0 z-50 bg-white rounded-t-2xl shadow-2xl px-4 pt-4 pb-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-slate-800">More</p>
              <button onClick={() => setMoreOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {MORE_NAV.map(({ to, icon: Icon, label }) => {
                const active = location.pathname === to;
                return (
                  <NavLink
                    key={to}
                    to={to}
                    className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-colors ${
                      active ? "bg-pink-50 text-[#ec4899]" : "text-slate-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[11px] font-medium text-center leading-tight">{label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex items-stretch h-16">
          {PRIMARY_NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
                  isActive ? "text-[#ec4899]" : "text-slate-400"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? "bg-pink-50" : ""}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(o => !o)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all ${
              moreOpen || MORE_NAV.some(n => n.to === location.pathname) ? "text-[#ec4899]" : "text-slate-400"
            }`}
          >
            <div className={`p-1.5 rounded-xl transition-all ${moreOpen ? "bg-pink-50" : ""}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span>More</span>
          </button>
        </div>
      </nav>

      {showChangePwd && (
        <ChangePasswordModal defaultEmail={userEmail} onClose={() => setShowChangePwd(false)} />
      )}
    </div>
  );
}