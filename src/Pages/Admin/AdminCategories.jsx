import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, X, Loader2, Tag,
  ChevronUp, ChevronDown, Check, Image,
} from "lucide-react";
import AdminLayout from "../../components/Admin/AdminLayout";
import {
  getCollection, addDocument, updateDocument, deleteDocument,
  uploadToCloudinary,
} from "../../lib/firebase";

const DEFAULT_CATEGORIES = [
  { name: "Cakes",    image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Brownies", image: "https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=400" },
  { name: "Cupcakes", image: "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&w=400" },
];

// ── Add / Edit Modal ───────────────────────────────────────────────────────────
function CategoryModal({ onClose, onSave, initial = null }) {
  const [name, setName]         = useState(initial?.name ?? "");
  const [image, setImage]       = useState(initial?.image ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving]     = useState(false);
  const fileRef = useRef();
  const isEdit  = !!initial;

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadToCloudinary(file);
      setImage(url);
    } catch {
      alert("Image upload failed. Check Cloudinary config.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), image });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-slate-800">
            {isEdit ? "Edit Category" : "Add New Category"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-gray-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* image picker */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-24 h-24 rounded-full border-2 border-dashed border-pink-300 overflow-hidden cursor-pointer hover:border-pink-500 transition-colors flex items-center justify-center bg-pink-50"
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 size={22} className="animate-spin text-pink-400" />
              ) : image ? (
                <img src={image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Image size={22} className="text-pink-300" />
                  <span className="text-[10px] text-pink-300 font-medium">Upload</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400">Click circle to upload category image</p>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {/* name */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Category Name <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === "Escape") onClose(); }}
              placeholder="e.g. Cookies, Pastries, Breads…"
              autoFocus
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* footer */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading || !name.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ec4899] hover:bg-[#db2777] disabled:opacity-60 transition-colors"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : isEdit ? <Check size={14} /> : <Plus size={14} />}
              {isEdit ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Table row ─────────────────────────────────────────────────────────────────
function CategoryRow({ cat, idx, total, onEdit, onDelete, onShift, deleting }) {
  return (
    <tr className="hover:bg-pink-50/20 transition-colors">
      {/* order */}
      <td className="px-4 py-3 w-20">
        <div className="flex items-center gap-1">
          <span className="w-7 h-7 rounded-lg bg-[#ec4899]/10 text-[#ec4899] text-xs font-bold flex items-center justify-center">
            {idx + 1}
          </span>
          <div className="flex flex-col gap-0.5">
            <button onClick={() => onShift(cat.id, "up")} disabled={idx === 0}
              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20">
              <ChevronUp size={12} />
            </button>
            <button onClick={() => onShift(cat.id, "down")} disabled={idx === total - 1}
              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20">
              <ChevronDown size={12} />
            </button>
          </div>
        </div>
      </td>

      {/* image */}
      <td className="px-4 py-3 w-20">
        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 shadow-sm">
          {cat.image ? (
            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-pink-50 flex items-center justify-center">
              <Tag size={14} className="text-pink-300" />
            </div>
          )}
        </div>
      </td>

      {/* name */}
      <td className="px-4 py-3">
        <span className="text-sm font-medium text-slate-800">{cat.name}</span>
      </td>

      {/* usage */}
      <td className="px-4 py-3 hidden sm:table-cell">
        <span className="text-xs text-slate-800">Product category &amp; shop filter</span>
      </td>

      {/* actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(cat)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ec4899] hover:bg-pink-50 transition-colors"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(cat.id, cat.name)}
            disabled={deleting === cat.id}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Delete"
          >
            {deleting === cat.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </button>
        </div>
      </td>
    </tr>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminCategories() {
  const [cats, setCats]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [seeded, setSeeded]   = useState(false);
  const [modal, setModal]     = useState(null); // null | "add" | { cat object for edit }

  const load = async () => {
    setLoading(true);
    try {
      const docs = await getCollection("categories", "order");
      setCats(docs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
    } catch {
      setCats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async ({ name, image }) => {
    const order = cats.length + 1;
    const newCat = await addDocument("categories", { name, image, order });
    setCats(prev => [...prev, newCat]);
  };

  const handleEdit = async ({ name, image }) => {
    const id = modal.id;
    await updateDocument("categories", id, { name, image });
    setCats(prev => prev.map(c => c.id === id ? { ...c, name, image } : c));
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete category "${name}"?\n\nProducts using this category will keep their data but it won't appear in filters until re-added.`)) return;
    setDeleting(id);
    try {
      await deleteDocument("categories", id);
      setCats(prev => prev.filter(c => c.id !== id));
    } catch {
      alert("Delete failed. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const shiftOrder = async (id, direction) => {
    const sorted = [...cats];
    const idx = sorted.findIndex(c => c.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    [sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]];
    const updated = sorted.map((c, i) => ({ ...c, order: i + 1 }));
    setCats(updated);
    await Promise.all(updated.map(c => updateDocument("categories", c.id, { order: c.order })));
  };

  const seedDefaults = async () => {
    setSeeded(true);
    const results = [];
    for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
      const d = DEFAULT_CATEGORIES[i];
      const newCat = await addDocument("categories", { ...d, order: i + 1 });
      results.push(newCat);
    }
    setCats(results);
  };

  const isAddModal  = modal === "add";
  const isEditModal = modal && modal !== "add";

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-4xl mx-auto">

        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Product Categories</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {cats.length} categor{cats.length !== 1 ? "ies" : "y"} · shown as circular image filters in the shop
            </p>
          </div>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={15} />
            Add Category
          </button>
        </div>

        {/* list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={28} className="animate-spin text-[#ec4899]" />
          </div>

        ) : cats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Tag size={40} className="mb-3 text-gray-200" />
            <p className="text-sm font-medium text-slate-800">No categories yet</p>
            <p className="text-xs text-slate-800 mt-1 mb-5">Click "Add Category" or load the default set below</p>
            <button
              onClick={seedDefaults}
              disabled={seeded}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              <Plus size={14} />
              Load Defaults (Cakes, Brownies, Cupcakes)
            </button>
          </div>

        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800 w-20">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800 w-20">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800 hidden sm:table-cell">Usage</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {cats.map((cat, idx) => (
                    <CategoryRow
                      key={cat.id}
                      cat={cat}
                      idx={idx}
                      total={cats.length}
                      onEdit={(c) => setModal(c)}
                      onDelete={handleDelete}
                      onShift={shiftOrder}
                      deleting={deleting}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {cats.length > 0 && (
          <p className="text-xs text-slate-800 mt-3">
            Tip: Category names must match exactly what is set in each product's Category field for shop filters to work correctly.
          </p>
        )}
      </div>

      {/* modals */}
      {isAddModal && (
        <CategoryModal
          onClose={() => setModal(null)}
          onSave={handleAdd}
        />
      )}
      {isEditModal && (
        <CategoryModal
          initial={modal}
          onClose={() => setModal(null)}
          onSave={handleEdit}
        />
      )}
    </AdminLayout>
  );
}
