import { useState, useEffect, useRef } from "react";
import {
  Plus, Pencil, Trash2, X, ImagePlus, Loader2,
  Eye, ArrowUp, ArrowDown, LayoutList, LayoutGrid,
  Save,
} from "lucide-react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { uploadToCloudinary } from "../../lib/firebase";
import {getCollection, addDocument, updateDocument, deleteDocument,} from "../../lib/firebase";


// ── Add / Edit Modal ──────────────────────────────────────────────────────────
function BannerModal({ initial, totalBanners, onClose, onSave, saving }) {
  const [alt, setAlt]           = useState(initial?.alt || "");
  const [order, setOrder]       = useState(initial?.order ?? totalBanners + 1);
  const [imageUrl, setImageUrl] = useState(initial?.url || "");
  const [publicId, setPublicId] = useState(initial?.publicId || "");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview]   = useState(initial?.url || null);
  const fileRef = useRef();

  const handleFile = async e => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const { url, publicId: pid } = await uploadToCloudinary(file);
      setImageUrl(url);
      setPublicId(pid);
      setPreview(url);
    } catch {
      alert("Upload failed. Check VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env");
      setPreview(initial?.url || null);
    } finally {
      setUploading(false);
    }
  };

  const submit = e => {
    e.preventDefault();
    if (!imageUrl) return alert("Please upload an image first.");
    onSave({ url: imageUrl, publicId, alt, order: Number(order) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-slate-900">{initial ? "Edit Banner" : "Add New Banner"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={18} /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* image upload */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1.5 block">
              Banner Image {!initial && <span className="text-red-400">*</span>}
            </label>
            <div
              className="relative w-full h-44 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center cursor-pointer hover:border-pink-300 transition-colors"
              onClick={() => fileRef.current && fileRef.current.click()}
            >
              {preview
                ? <img src={preview} alt="" className="w-full h-full object-cover" />
                : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImagePlus size={32} />
                    <p className="text-sm font-medium">Click to upload image</p>
                    <p className="text-xs text-slate-300">JPG · PNG · WebP — stored on Cloudinary</p>
                  </div>
                )
              }
              {uploading && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={28} className="animate-spin text-[#ec4899]" />
                  <p className="text-xs text-slate-500 font-medium">Uploading to Cloudinary…</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {preview && !uploading && (
              <button
                type="button"
                onClick={() => fileRef.current && fileRef.current.click()}
                className="mt-1.5 text-xs text-[#ec4899] hover:text-[#db2777] font-medium"
              >
                Change image
              </button>
            )}
          </div>

          {/* alt text */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Alt Text / Description</label>
            <input
              value={alt}
              onChange={e => setAlt(e.target.value)}
              placeholder="e.g. Summer Sale Banner"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          {/* display order */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Display Order</label>
            <input
              type="number"
              min="1"
              value={order}
              onChange={e => setOrder(e.target.value)}
              className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <p className="text-xs text-slate-400 mt-1">Lower number = shown first in carousel</p>
          </div>

          <div className="flex gap-3 pt-1">
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
              {initial ? "Save Changes" : "Add Banner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminBanners() {
  const [banners, setBanners]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState(null); // null | "add" | {...banner}
  const [saving, setSaving]     = useState(false);
  const [delId, setDelId]       = useState(null);
  const [view, setView]         = useState("table"); // "table" | "grid"

  const load = async () => {
    setLoading(true);
    try {
      const docs = await getCollection("banners", "order");
      setBanners(docs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
    } catch {
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  const handleSave = async form => {
    setSaving(true);
    try {
      if (modal === "add") {
        await addDocument("banners", form);
      } else {
        await updateDocument("banners", modal.id, form);
      }
      await load();
      setModal(null);
    } catch {
      alert("Save failed. Check Firebase credentials.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm("Delete this banner? The image will remain on Cloudinary.")) return;
    setDelId(id);
    try { await deleteDocument("banners", id); await load(); }
    catch { alert("Delete failed."); }
    finally { setDelId(null); }
  };

  const shiftOrder = async (id, direction) => {
    const sorted = [...banners].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
    const idx = sorted.findIndex(b => b.id === id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const a = sorted[idx];
    const b = sorted[swapIdx];
    try {
      await updateDocument("banners", a.id, { order: b.order ?? swapIdx + 1 });
      await updateDocument("banners", b.id, { order: a.order ?? idx + 1 });
      await load();
    } catch { alert("Order update failed."); }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">

        {/* page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Promotion Banners</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {banners.length} banner{banners.length !== 1 ? "s" : ""} · images on Cloudinary · order controls carousel sequence
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* view toggle */}
            <div className="hidden sm:flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              <button
                onClick={() => setView("table")}
                className={`p-1.5 rounded-lg transition-colors ${view === "table" ? "bg-white shadow text-[#ec4899]" : "text-slate-400 hover:text-slate-600"}`}
                title="Table view"
              >
                <LayoutList size={15} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={`p-1.5 rounded-lg transition-colors ${view === "grid" ? "bg-white shadow text-[#ec4899]" : "text-slate-400 hover:text-slate-600"}`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
            </div>
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors"
            >
              <Plus size={16} /> Add Banner
            </button>
          </div>
        </div>

        {/* loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={30} className="animate-spin text-[#ec4899]" />
          </div>

        ) : banners.length === 0 ? (
          /* empty state */
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-200 text-slate-400">
            <ImagePlus size={44} className="mb-3 text-gray-200" />
            <p className="text-sm font-medium text-slate-500">No banners yet</p>
            <p className="text-xs mt-1 mb-5">Upload your first promotional banner image</p>
            <button
              onClick={() => setModal("add")}
              className="flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              <Plus size={15} /> Add First Banner
            </button>
          </div>

        ) : view === "table" ? (
          /* ── TABLE VIEW ── */
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800  w-20">Order</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800  w-28">Preview</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800 ">Alt Text / Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-800 ">Added</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-800">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {banners.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-pink-50/20 transition-colors">
                      {/* order controls */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="w-7 h-7 rounded-lg bg-[#ec4899]/10 text-[#ec4899] text-xs font-bold flex items-center justify-center">
                            {b.order ?? idx + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => shiftOrder(b.id, "up")}
                              disabled={idx === 0}
                              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={() => shiftOrder(b.id, "down")}
                              disabled={idx === banners.length - 1}
                              className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20 disabled:cursor-not-allowed"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* preview thumbnail */}
                      <td className="px-4 py-3">
                        <img
                          src={b.url}
                          alt={b.alt}
                          className="w-24 h-14 object-cover rounded-lg border border-gray-100"
                        />
                      </td>

                      {/* alt text */}
                      <td className="px-4 py-3">
                        <p className="text-slate-800 font-medium">
                          {b.alt || <span className="text-slate-300 italic text-xs">No description</span>}
                        </p>
                        <a
                          href={b.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-800 hover:text-[#ec4899] flex items-center gap-1 mt-0.5 transition-colors"
                        >
                          <Eye size={10} /> View full image
                        </a>
                      </td>

                      {/* date */}
                      <td className="px-4 py-3 text-xs text-slate-800">
                        {b.createdAt?.toDate
                          ? b.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                          : "—"
                        }
                      </td>

                      {/* actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-[#ec4899] hover:bg-pink-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            disabled={delId === b.id}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            {delId === b.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        ) : (
          /* ── GRID VIEW ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((b, idx) => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
                {/* image */}
                <div className="relative w-full h-44 bg-gray-100">
                  <img src={b.url} alt={b.alt} className="w-full h-full object-cover" />

                  {/* hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:text-[#ec4899] transition-colors"
                    >
                      <Eye size={15} />
                    </a>
                    <button
                      onClick={() => setModal(b)}
                      className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:text-[#ec4899] transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={delId === b.id}
                      className="p-2 bg-white rounded-full shadow-md text-slate-700 hover:text-red-500 transition-colors"
                    >
                      {delId === b.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                    </button>
                  </div>

                  {/* order badge */}
                  <div className="absolute top-2 left-2 bg-[#ec4899] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                    #{b.order ?? idx + 1}
                  </div>
                </div>

                {/* footer */}
                <div className="p-3 flex items-center justify-between gap-2">
                  <p className="text-xs text-slate-600 truncate flex-1">
                    {b.alt || <span className="italic text-slate-300">No description</span>}
                  </p>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => shiftOrder(b.id, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-300 hover:text-slate-600 disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      onClick={() => shiftOrder(b.id, "down")}
                      disabled={idx === banners.length - 1}
                      className="p-1 rounded text-slate-300 hover:text-slate-600 disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* add new card */}
            <button
              onClick={() => setModal("add")}
              className="flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed border-gray-200 hover:border-pink-300 text-slate-400 hover:text-[#ec4899] transition-colors bg-white"
            >
              <Plus size={28} className="mb-2" />
              <span className="text-sm font-medium">Add Banner</span>
            </button>
          </div>
        )}

        {!loading && banners.length > 0 && (
          <p className="text-xs text-slate-400 mt-3 text-right">
            Banners display in carousel in the order shown above · use arrows to reorder
          </p>
        )}
      </div>

      {/* modal */}
      {modal && (
        <BannerModal
          initial={modal === "add" ? null : modal}
          totalBanners={banners.length}
          onClose={() => setModal(null)}
          onSave={handleSave}
          saving={saving}
        />
      )}
    </AdminLayout>
  );
}
