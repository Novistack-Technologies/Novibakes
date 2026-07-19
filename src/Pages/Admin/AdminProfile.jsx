import { useState, useRef } from "react";
// ── Firebase — uncomment when ready ──────────────────────────────────────────
// import { auth } from "../../firebase";
// import { updateProfile } from "firebase/auth";
// import { updateDocument } from "../../lib/firebase";
// ─────────────────────────────────────────────────────────────────────────────
import AdminLayout from "../../components/Admin/AdminLayout";
import {
  User, Mail, Phone, Shield, Camera, Check,
  Loader2, Edit2, X,
} from "lucide-react";

// ── Stubs ─────────────────────────────────────────────────────────────────────
const updateDocument = async () => null;

// Simulate reading the logged-in admin's Firestore profile
const MOCK_PROFILE = {
  id:       "1",
  name:     "Kiruthika Santhoshni",
  email:    "kiruthika@novibakes.com",
  phone:    "9876543210",
  role:     "Owner",
  joined:   "2024-11-01",
  bio:      "Owner of NoviBakes — crafting happiness one bite at a time.",
};

// ── Avatar uploader ───────────────────────────────────────────────────────────
function Avatar({ name, preview, onPickFile }) {
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="relative w-24 h-24 shrink-0">
      {preview
        ? <img src={preview} alt={name} className="w-24 h-24 rounded-full object-cover shadow-md" />
        : (
          <div className="w-24 h-24 rounded-full bg-[#ec4899] flex items-center justify-center text-white text-3xl font-extrabold shadow-md select-none">
            {initials}
          </div>
        )
      }
      <button
        onClick={onPickFile}
        title="Change photo"
        className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-[#ec4899] rounded-full flex items-center justify-center text-[#ec4899] hover:bg-pink-50 transition-colors shadow"
      >
        <Camera size={12} />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdminProfile() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ name: "", phone: "", bio: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const fileRef = useRef();

  const startEdit = () => {
    setForm({ name: profile.name, phone: profile.phone, bio: profile.bio });
    setEditing(true);
    setSaved(false);
  };

  const cancelEdit = () => { setEditing(false); };

  const handleAvatarPick = () => fileRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    // swap for Cloudinary: upload file, store URL to Firestore
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    // swap for Firebase:
    // await updateDocument("adminUsers", profile.id, { name: form.name, phone: form.phone, bio: form.bio });
    // await updateProfile(auth.currentUser, { displayName: form.name });
    await new Promise(r => setTimeout(r, 600));
    setProfile(p => ({ ...p, name: form.name, phone: form.phone, bio: form.bio }));
    setEditing(false);
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const ROLE_COLOR = {
    Owner: "bg-purple-50 text-purple-700",
    Admin: "bg-pink-50 text-[#ec4899]",
    Staff: "bg-blue-50 text-blue-600",
  };

  const inputClass = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300";

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-5">

        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">My Profile</h1>
            <p className="text-xs text-slate-400 mt-0.5">Manage your account details</p>
          </div>
          {saved && (
            <span className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
              <Check size={12} /> Changes saved
            </span>
          )}
        </div>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Banner */}
          <div className="h-24 bg-gradient-to-r from-pink-400 via-pink-300 to-rose-300 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          </div>

          {/* Avatar + name row */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-12 mb-4">
              <Avatar name={profile.name} preview={avatarPreview} onPickFile={handleAvatarPick} />
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {!editing
                ? (
                  <button onClick={startEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-[#ec4899] border border-pink-200 hover:bg-pink-50 transition-colors">
                    <Edit2 size={13} /> Edit Profile
                  </button>
                )
                : (
                  <button onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 border border-gray-200 hover:bg-gray-50 transition-colors">
                    <X size={13} /> Cancel
                  </button>
                )
              }
            </div>

            {!editing ? (
              /* View mode */
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h2 className="text-lg font-extrabold text-slate-900">{profile.name}</h2>
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${ROLE_COLOR[profile.role] || "bg-gray-100 text-gray-600"}`}>
                      <Shield size={9} /> {profile.role}
                    </span>
                  </div>
                  {profile.bio && <p className="text-sm text-slate-500 mt-1">{profile.bio}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Mail,  label: "Email",   value: profile.email },
                    { icon: Phone, label: "Phone",   value: profile.phone || "Not set" },
                    { icon: User,  label: "Role",    value: profile.role  },
                    { icon: Shield,label: "Member since", value: new Date(profile.joined).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-7 h-7 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                        <Icon size={13} className="text-[#ec4899]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">{label}</p>
                        <p className="text-sm font-medium text-slate-700 break-all">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Edit mode */
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name *</label>
                    <input value={form.name} onChange={e => set("name", e.target.value)}
                      placeholder="Your name" required className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Email</label>
                    <input value={profile.email} disabled
                      className={`${inputClass} bg-gray-50 text-slate-400`} />
                    <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed here.</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Phone</label>
                    <input value={form.phone} onChange={e => set("phone", e.target.value)}
                      placeholder="10-digit mobile" className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Role</label>
                    <input value={profile.role} disabled
                      className={`${inputClass} bg-gray-50 text-slate-400`} />
                    <p className="text-[10px] text-slate-400 mt-1">Role can only be changed by another admin.</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block">Bio</label>
                  <textarea value={form.bio} onChange={e => set("bio", e.target.value)}
                    rows={3} placeholder="A short bio about yourself…"
                    className={`${inputClass} resize-none`} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={cancelEdit}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ec4899] hover:bg-[#db2777] disabled:opacity-60 transition-colors">
                    {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
