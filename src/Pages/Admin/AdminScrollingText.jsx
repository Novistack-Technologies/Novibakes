import { useState, useEffect } from "react";
import { Plus, Trash2, Pencil, X, Save, Loader2, GripVertical, Eye, EyeOff } from "lucide-react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { getCollection, addDocument, updateDocument, deleteDocument } from "../../lib/firebase";

const DEFAULT_TEXTS = [
  "Free Delivery on Orders Above Rs.500",
  "Fresh Baked Daily",
  "Custom Cakes Available",
  "Order via WhatsApp",
  "10% Off on First Order",
];

// ── single text row ───────────────────────────────────────────────────────────
function TextRow({ item, onEdit, onDelete, onToggle, deleting }) {
  return (
    <div className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
      item.active !== false
        ? "bg-white border-gray-100 shadow-sm"
        : "bg-gray-50 border-gray-100 opacity-60"
    }`}>
      <GripVertical size={16} className="text-slate-300 shrink-0 cursor-grab" />

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${item.active !== false ? "text-slate-800" : "text-slate-400 line-through"}`}>
          {item.text}
        </p>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={() => onToggle(item)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors"
          title={item.active !== false ? "Hide from banner" : "Show in banner"}
        >
          {item.active !== false ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-[#ec4899] hover:bg-pink-50 transition-colors"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          disabled={deleting}
          className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          title="Delete"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
        </button>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function AdminScrollingText() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [delId, setDelId]     = useState(null);
  const [saving, setSaving]   = useState(false);

  // editing
  const [editItem, setEditItem]   = useState(null); // null | {id, text, ...}
  const [editText, setEditText]   = useState("");

  // adding
  const [addText, setAddText]     = useState("");
  const [adding, setAdding]       = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const docs = await getCollection("scrollingTexts", "order");
      if (docs.length) {
        setItems(docs);
      } else {
        // seed with defaults on first load
        setItems(DEFAULT_TEXTS.map((text, i) => ({ id: String(i), text, active: true, order: i + 1 })));
      }
    } catch {
      setItems(DEFAULT_TEXTS.map((text, i) => ({ id: String(i), text, active: true, order: i + 1 })));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleAdd = async e => {
    e.preventDefault();
    if (!addText.trim()) return;
    setAdding(true);
    try {
      await addDocument("scrollingTexts", { text: addText.trim(), active: true, order: items.length + 1 });
      setAddText("");
      await load();
    } catch {
      alert("Failed to add. Check Firebase credentials.");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this text?")) return;
    setDelId(id);
    try { await deleteDocument("scrollingTexts", id); await load(); }
    catch { alert("Delete failed."); }
    finally { setDelId(null); }
  };

  const handleToggle = async item => {
    try {
      await updateDocument("scrollingTexts", item.id, { active: !(item.active !== false) });
      await load();
    } catch { alert("Update failed."); }
  };

  const openEdit = item => { setEditItem(item); setEditText(item.text); };

  const saveEdit = async e => {
    e.preventDefault();
    if (!editText.trim()) return;
    setSaving(true);
    try {
      await updateDocument("scrollingTexts", editItem.id, { text: editText.trim() });
      setEditItem(null);
      await load();
    } catch { alert("Update failed."); }
    finally { setSaving(false); }
  };

  const seedDefaults = async () => {
    if (!confirm("This will add the default 5 texts to Firebase. Continue?")) return;
    setSaving(true);
    try {
      for (let i = 0; i < DEFAULT_TEXTS.length; i++) {
        await addDocument("scrollingTexts", { text: DEFAULT_TEXTS[i], active: true, order: i + 1 });
      }
      await load();
    } catch { alert("Seeding failed."); }
    finally { setSaving(false); }
  };

  const activeCount = items.filter(i => i.active !== false).length;

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-extrabold text-slate-900">Scrolling Banner Texts</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage the announcement texts shown in the pink scrolling banner · {activeCount} active of {items.length} total
          </p>
        </div>

        {/* live preview */}
        <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
          <p className="text-sm font-semibold text-slate-800 mb-2">Live Preview</p>
          <div className="bg-[#ec4899] overflow-hidden relative rounded-xl">
            <div className="flex whitespace-nowrap py-3 animate-scroll-preview">
              {[...items.filter(i => i.active !== false), ...items.filter(i => i.active !== false)].map((item, idx) => (
                <span key={idx} className="inline-flex items-center gap-6 mx-6 text-white text-sm font-medium tracking-wide">
                  <span>{item.text}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
                </span>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes scroll-prev { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
            .animate-scroll-preview { animation: scroll-prev 18s linear infinite; }
            .animate-scroll-preview:hover { animation-play-state: paused; }
          `}</style>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* left: add + actions */}
          <div className="lg:col-span-2 space-y-4">
            {/* add form */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-800 mb-3">Add New Text</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                <textarea
                  value={addText}
                  onChange={e => setAddText(e.target.value)}
                  rows={3}
                  placeholder="e.g. Order your birthday cake 3 days in advance!"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
                <button
                  type="submit"
                  disabled={adding || !addText.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60 transition-colors"
                >
                  {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Add Text
                </button>
              </form>
            </div>

            {/* seed helper */}
            <button
              onClick={seedDefaults}
              disabled={saving}
              className="w-full text-xs font-bold text-slate-800 hover:text-[#ec4899] border border-dashed border-gray-200 rounded-xl py-3 transition-colors"
            >
              Reset to default 5 texts
            </button>

            <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-700 space-y-1">
              <p className="font-semibold">Tips</p>
              <p>Keep each text under 60 characters for best display.</p>
              <p>Use the eye icon to temporarily hide a text without deleting it.</p>
              <p>Texts update on the live website within seconds.</p>
            </div>
          </div>

          {/* right: list */}
          <div className="lg:col-span-3">
            <h2 className="text-sm font-bold text-slate-700 mb-3">All Texts</h2>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={24} className="animate-spin text-[#ec4899]" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-gray-200">
                No texts yet. Add one on the left.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map(item => (
                  <TextRow
                    key={item.id}
                    item={item}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    deleting={delId === item.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* edit modal */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-slate-900">Edit Text</h2>
              <button onClick={() => setEditItem(null)} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={saveEdit} className="p-6 space-y-4">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                rows={3}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
              <div className="text-xs text-slate-400 text-right">{editText.length} characters</div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !editText.trim()}
                  className="flex-1 py-2.5 rounded-xl bg-[#ec4899] hover:bg-[#db2777] text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

