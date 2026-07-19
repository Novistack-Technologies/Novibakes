import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, X, Search,
  ChevronUp, ChevronDown, ImagePlus, Loader2, Star,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { uploadToCloudinary } from "../../lib/firebase";
import AdminLayout from "../../components/Admin/AdminLayout";
// import { products as localProducts } from "../../data/data";
import {
  getCollection, addDocument, updateDocument, deleteDocument,
} from "../../lib/firebase";


const DEFAULT_CATEGORIES = ["Cakes", "Brownies", "Cupcakes"];
const EMPTY = {
  name: "", category: "", description: "",
  rating: 4.5, available: true, featured: false,
  weights: [{ label: "500g", price: "" }],
  image: "", imagePublicId: "",
};

// ── weight row ────────────────────────────────────────────────────────────────
function WeightRow({ w, idx, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        value={w.label}
        onChange={e => onChange(idx, "label", e.target.value)}
        placeholder="e.g. 500g / 6 pcs"
        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <span className="text-slate-400 text-sm shrink-0">Rs.</span>
      <input
        type="number"
        value={w.price}
        onChange={e => onChange(idx, "price", e.target.value)}
        placeholder="Price"
        className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      <button type="button" onClick={() => onRemove(idx)} className="text-red-400 hover:text-red-600 p-1 shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}

// ── add/edit modal ────────────────────────────────────────────────────────────
function ProductModal({ initial, categories, onClose, onSave, saving }) {
  const [f, setF] = useState(initial ?? EMPTY);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const set = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const handleImg = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url, publicId } = await uploadToCloudinary(file);
      setF(prev => ({ ...prev, image: url, imagePublicId: publicId }));
    } catch {
      alert("Image upload failed. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.");
    } finally {
      setUploading(false);
    }
  };

  const updW = (i, k, v) => {
    const ws = [...f.weights];
    ws[i] = { ...ws[i], [k]: v };
    set("weights", ws);
  };
  const addW = () => set("weights", [...f.weights, { label: "", price: "" }]);
  const remW = i => set("weights", f.weights.filter((_, x) => x !== i));

  const submit = e => {
    e.preventDefault();
    if (!f.name.trim()) return alert("Product name is required");
    if (!f.weights.length) return alert("Add at least one weight/price option");
    onSave(f);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="font-bold text-slate-900">{initial ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* image upload */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">Product Image</label>
            <div
              className="relative w-full h-40 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-pink-300 transition-colors"
              onClick={() => fileRef.current && fileRef.current.click()}
            >
              {f.image
                ? <img src={f.image} alt="" className="w-full h-full object-cover" />
                : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImagePlus size={28} />
                    <span className="text-xs">Click to upload — stored on Cloudinary</span>
                  </div>
                )
              }
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 size={24} className="animate-spin text-[#ec4899]" />
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImg} />
          </div>

          {/* name + category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Name *</label>
              <input
                value={f.name}
                onChange={e => set("name", e.target.value)}
                required
                placeholder="e.g. Chocolate Truffle"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Category *</label>
              <select
                value={f.category}
                onChange={e => set("category", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                <option value="">Select category…</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* description */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Description</label>
            <textarea
              value={f.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Short product description"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* rating */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Rating (0–5)</label>
            <input
              type="number" min="0" max="5" step="0.1"
              value={f.rating}
              onChange={e => set("rating", parseFloat(e.target.value))}
              className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* weights */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-2 block">Weight &amp; Price Options *</label>
            <div className="space-y-2">
              {f.weights.map((w, i) => (
                <WeightRow key={i} w={w} idx={i} onChange={updW} onRemove={remW} />
              ))}
            </div>
            <button
              type="button"
              onClick={addW}
              className="mt-2 text-xs text-[#ec4899] font-semibold flex items-center gap-1 hover:text-[#db2777]"
            >
              <Plus size={13} /> Add option
            </button>
          </div>

          {/* flags */}
          <div className="flex gap-6">
            {[["available", "Available for Order"], ["featured", "Show on Homepage"]].map(([k, label]) => (
              <label key={k} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f[k]}
                  onChange={e => set(k, e.target.checked)}
                  className="accent-[#ec4899] w-4 h-4"
                />
                <span className="text-sm text-slate-700">{label}</span>
              </label>
            ))}
          </div>

          {/* actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-slate-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 py-2.5 rounded-xl bg-[#ec4899] hover:bg-[#db2777] text-white text-sm font-semibold disabled:opacity-60 flex items-center justify-center gap-2 transition-colors"
            >
              {saving && <Loader2 size={14} className="animate-spin" />}
              {initial ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── main page ─────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const [products, setProducts]     = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [cat, setCat]               = useState("All");
  const [sortCol, setSortCol]       = useState("name");
  const [sortDir, setSortDir]       = useState("asc");
  const [modal, setModal]           = useState(null); // null | "add" | {...product}
  const [saving, setSaving]         = useState(false);
  const [delId, setDelId]           = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [docs, catDocs] = await Promise.all([
        getCollection("products", "name"),
        getCollection("categories", "order").catch(() => []),
      ]);
      setProducts(docs.length ? docs : localProducts.map((p, i) => ({ ...p, id: String(i) })));
      if (catDocs.length) {
        setCategories(catDocs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).map(c => c.name));
      }
    } catch {
      setProducts(localProducts.map((p, i) => ({ ...p, id: String(i) })));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const save = async form => {
    setSaving(true);
    try {
      const payload = { ...form, weights: form.weights.filter(w => w.label && w.price !== "") };
      if (modal === "add") {
        const newId = String(Date.now());
        await addDocument("products", payload).catch(() => {});
        setProducts(prev => [...prev, { ...payload, id: newId }]);
        toast.success("Product created successfully!");
      } else {
        await updateDocument("products", modal.id, payload).catch(() => {});
        setProducts(prev => prev.map(p => p.id === modal.id ? { ...payload, id: modal.id } : p));
        toast.success("Product updated successfully!");
      }
      setModal(null);
    } catch {
      toast.error("Save failed. Check Firebase credentials in .env");
    } finally {
      setSaving(false);
    }
  };

  const del = async id => {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    setDelId(id);
    try {
      await deleteDocument("products", id).catch(() => {});
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success("Product deleted successfully!");
    } catch {
      toast.error("Delete failed.");
    } finally {
      setDelId(null);
    }
  };

  const toggleSort = col => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = products
    .filter(p => {
      const q = search.toLowerCase();
      return (!q || (p.name || "").toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q))
        && (cat === "All" || p.category === cat);
    })
    .sort((a, b) => {
      let av = a[sortCol] || "", bv = b[sortCol] || "";
      if (sortDir === "desc") { const t = av; av = bv; bv = t; }
      return String(av).localeCompare(String(bv), undefined, { numeric: true });
    });

  const firstPrice = p => {
    if (Array.isArray(p.weights) && p.weights[0]) return p.weights[0].price || "-";
    if (p.weights && typeof p.weights === "object") return Object.values(p.weights)[0] || "-";
    return "-";
  };

  const openEdit = p => {
    const weights = Array.isArray(p.weights)
      ? p.weights
      : Object.entries(p.weights || {}).map(([label, price]) => ({ label, price }));
    setModal({ ...p, weights });
  };

  const SortIcon = ({ col }) =>
    sortCol === col
      ? sortDir === "asc"
        ? <ChevronUp size={12} className="text-[#ec4899]" />
        : <ChevronDown size={12} className="text-[#ec4899]" />
      : <ChevronUp size={12} className="text-gray-300" />;

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* page header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Products</h1>
            <p className="text-xs text-slate-400 mt-0.5">{products.length} total products · data in Firebase</p>
          </div>
          <button
            onClick={() => setModal("add")}
            className="flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>

        {/* filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or category…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-200 bg-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...categories].map(c => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  cat === c
                    ? "bg-[#ec4899] text-white border-[#ec4899]"
                    : "bg-white text-slate-600 border-gray-200 hover:border-pink-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-[#ec4899]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">No products found</div>
          ) : (
            <>
              {/* desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 w-14">Image</th>
                      {[["name", "Name"], ["category", "Category"], ["rating", "Rating"]].map(([col, lbl]) => (
                        <th
                          key={col}
                          onClick={() => toggleSort(col)}
                          className="px-4 py-3 text-left text-xs font-semibold text-slate-500  cursor-pointer select-none"
                        >
                          <span className="flex items-center gap-1">{lbl} <SortIcon col={col} /></span>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 ">Start Price</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 ">Status</th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 ">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(p => (
                      <tr key={p.id} className="hover:bg-pink-50/20 transition-colors">
                        <td className="px-4 py-3">
                          {p.image
                            ? <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                            : <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center text-[#ec4899]"><Star size={14} /></div>
                          }
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          {p.featured && (
                            <span className="text-[10px] bg-amber-50 text-amber-600 font-semibold px-1.5 py-0.5 rounded">Featured</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{p.category}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Star size={12} className="text-yellow-400 fill-yellow-400" />
                            {p.rating}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">Rs.{firstPrice(p)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            p.available !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                          }`}>
                            {p.available !== false ? "Available" : "Unavailable"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-[#ec4899] hover:bg-pink-50 transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => del(p.id)}
                              disabled={delId === p.id}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              {delId === p.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* mobile */}
              <div className="md:hidden divide-y divide-gray-50">
                {filtered.map(p => (
                  <div key={p.id} className="flex gap-3 p-4 items-start">
                    {p.image
                      ? <img src={p.image} alt={p.name} className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0" />
                      : <div className="w-14 h-14 rounded-xl bg-pink-50 shrink-0 flex items-center justify-center text-[#ec4899]"><Star size={18} /></div>
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.category}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#ec4899] hover:bg-pink-50"><Pencil size={13} /></button>
                          <button onClick={() => del(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50">
                            {delId === p.id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs font-bold text-slate-800">Rs.{firstPrice(p)}</span>
                        <span className="flex items-center gap-0.5 text-xs text-slate-500">
                          <Star size={10} className="text-yellow-400 fill-yellow-400" />{p.rating}
                        </span>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          p.available !== false ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                        }`}>
                          {p.available !== false ? "Available" : "Unavailable"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {!loading && (
          <p className="text-xs text-slate-400 mt-3 text-right">
            {filtered.length} of {products.length} products shown
          </p>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="light" />

      {modal && (
        <ProductModal
          initial={modal === "add" ? null : modal}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={save}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}