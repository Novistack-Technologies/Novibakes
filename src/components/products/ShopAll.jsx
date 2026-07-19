import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search, X, ChevronLeft, ChevronRight, ChevronRight as Arrow,
  Home, SlidersHorizontal, TrendingUp, Tag, IndianRupee,
} from "lucide-react";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton, SidebarSkeleton } from "../UI/Skeleton";
import { useFirestore } from "../../hooks/useFirestore";
import { getCollection } from "../../lib/firebase";

// convert Firestore weights array → object shape ProductCard/getStartingPrice expect
function normalise(p) {
  const weightsObj = {};
  const src = Array.isArray(p.weights)
    ? p.weights
    : Object.entries(p.weights ?? {}).map(([label, price]) => ({ label, price }));
  src.forEach(({ label, price }) => { weightsObj[label] = price; });
  return { ...p, weights: weightsObj };
}
const ITEMS_PER_PAGE = 9;

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "name",       label: "Name A–Z" },
];

const CATEGORY_ICONS = {
  All:       "🎂",
  Cakes:     "🎂",
  Brownies:  "🍫",
  Cupcakes:  "🧁",
};

function getStartingPrice(p) {
  const vals = Object.values(p.weights ?? {});
  return vals.length ? Math.min(...vals) : 0;
}

const PRICE_MIN = 50;
const PRICE_MAX = 2000;

/* ── Pagination ── */
function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  const pages = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button
        onClick={() => onChange(current - 1)} disabled={current === 1}
        className="w-9 h-9 rounded-full flex items-center justify-center border transition-all disabled:opacity-25 disabled:pointer-events-none"
        style={{ borderColor: "#e2e8f0", color: "#64748b" }}
      >
        <ChevronLeft size={15} />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`el-${i}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm select-none">…</span>
        ) : (
          <button key={p} onClick={() => onChange(p)}
            className="w-9 h-9 rounded-full text-sm font-semibold transition-all border"
            style={p === current
              ? { backgroundColor: "#ec4899", color: "#fff", borderColor: "#ec4899", boxShadow: "0 4px 12px #ec489940" }
              : { backgroundColor: "white", color: "#475569", borderColor: "#e2e8f0" }
            }
          >
            {p}
          </button>
        )
      )}
      <button
        onClick={() => onChange(current + 1)} disabled={current === total}
        className="w-9 h-9 rounded-full flex items-center justify-center border transition-all disabled:opacity-25 disabled:pointer-events-none"
        style={{ borderColor: "#e2e8f0", color: "#64748b" }}
      >
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

/* ── Main Page ── */
export default function ShopAll() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search,     setSearch]     = useState(searchParams.get("q") || "");
  const [category,   setCategory]   = useState(searchParams.get("category") || "All");
  const [sort,       setSort]       = useState("featured");
  const [page,       setPage]       = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);

  const catName  = (c) => (typeof c === "string" ? c : c.name);
  const catImage = (c) => (typeof c === "object" ? c.image : undefined);

    // ── Firestore: products (live) ──
  const { data: fsProducts, loading } = useFirestore("products", [], "name");
  const allProducts = useMemo(
    () => (fsProducts ?? []).filter((p) => p.available !== false).map(normalise),
    [fsProducts]
  );

// ── Firestore: categories (one-time fetch, filtered by occupied categories) ──
 const [rawCategoryDocs, setRawCategoryDocs] = useState([]);
  useEffect(() => {
    getCollection("categories", "order")
      .then((docs) => {
        if (docs.length) {
          setRawCategoryDocs(docs.sort((a, b) => (a.order ?? 99) - (b.order ?? 99)));
      }})
      .catch(() => {});
  }, []);

const categoryList = useMemo(() => {
    const occupiedCats = new Set(allProducts.map(p => p.category));
    if (rawCategoryDocs.length) {
      return [
        { name: "All", image: null },
        ...rawCategoryDocs
          .filter(c => occupiedCats.has(c.name))
          .map(c => ({ name: c.name, image: c.image })),
      ];
    }
    // fallback: derive from allProducts when Firestore categories not yet loaded
    return [
      { name: "All", image: null },
      ...[...new Set(allProducts.map(p => p.category))].filter(Boolean).map(name => ({ name, image: null })),
    ];
  }, [rawCategoryDocs, allProducts]);


  const filtered = useMemo(() => {
    let list = category === "All" ? allProducts : allProducts.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => {
      const sp = getStartingPrice(p);
      return sp >= priceRange[0] && sp <= priceRange[1];
    });
    switch (sort) {
      case "price-asc":  return [...list].sort((a, b) => getStartingPrice(a) - getStartingPrice(b));
      case "price-desc": return [...list].sort((a, b) => getStartingPrice(b) - getStartingPrice(a));
      case "rating":     return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "name":       return [...list].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      default:           return list;
    }
  }, [category, search, sort, priceRange, allProducts]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [category, search, sort, priceRange]);
  useEffect(() => {
    const p = {};
    if (category !== "All") p.category = category;
    if (search.trim())      p.q        = search.trim();
    setSearchParams(p, { replace: true });
  }, [category, search]);

  const priceActive = priceRange[0] !== PRICE_MIN || priceRange[1] !== PRICE_MAX;
  const clearFilters = useCallback(() => { setSearch(""); setCategory("All"); setSort("featured"); setPriceRange([PRICE_MIN, PRICE_MAX]); }, []);
  const hasFilters = !!(search.trim() || category !== "All" || sort !== "featured" || priceActive);
  const currentSortLabel = SORT_OPTIONS.find((s) => s.value === sort)?.label;

  /* ══ SIDEBAR ══ */
  const Sidebar = () => (
    <div className="space-y-1">
      <div className="px-4 pb-5 mb-2 border-b border-slate-100">
        <p className="text-lg font-bold text-slate-800 mt-0.5 leading-tight">NoviBakes Shop</p>
      </div>

      {/* Categories */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1.5 mb-3">
          <Tag size={12} style={{ color: "#ec4899" }} />
          <p className="text-lg font-bold text-slate-800">Categories</p>
        </div>
        <div className="space-y-0.5">
          {categoryList.map((catObj) => {
            const cat = catObj.name;            
            const count = cat === "All" ? allProducts.length : allProducts.filter((p) => p.category === cat).length;
            const active = category === cat;
            const emoji  = CATEGORY_ICONS[cat] || "✨";
            return (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setDrawerOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left group relative overflow-hidden"
                style={active ? { backgroundColor: "#fdf2f8" } : {}}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = ""; }}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ backgroundColor: "#ec4899" }} />
                )}
                {catObj.image ? (
                  <img src={catObj.image} alt={cat} className="w-5 h-5 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <span className="text-base leading-none">{CATEGORY_ICONS[cat] || "✨"}</span>
                )}
                <span className="flex-1 text-sm font-medium" style={{ color: active ? "#ec4899" : "#475569" }}>{cat}</span>
               <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md min-w-[22px] text-center"
                  style={{ backgroundColor: active ? "#ec489918" : "#f1f5f9", color: active ? "#ec4899" : "#94a3b8" }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-4 my-2 border-t border-slate-100" />

      {/* Price Range */}
      <div className="px-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <IndianRupee size={16} style={{ color: "#ec4899" }} />
            <p className="text-sm font-bold text-slate-800">Price Range</p>
          </div>
          {priceActive && (
            <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])} className="text-[10px] text-[#ec4899] hover:underline">Reset</button>
          )}
        </div>
        <div className="relative h-5 flex items-center mb-4">
          <div className="absolute w-full h-1.5 rounded-full bg-slate-100" />
          <div
            className="absolute h-1.5 rounded-full"
            style={{
              left: `${((priceRange[0] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              right: `${100 - ((priceRange[1] - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
              backgroundColor: "#ec4899",
            }}
          />
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50} value={priceRange[0]}
            onChange={(e) => { const val = Math.min(Number(e.target.value), priceRange[1] - 50); setPriceRange([val, priceRange[1]]); }}
            className="absolute w-full appearance-none bg-transparent cursor-pointer"
            style={{ zIndex: priceRange[0] > PRICE_MAX - 100 ? 5 : 3 }}
          />
          <input type="range" min={PRICE_MIN} max={PRICE_MAX} step={50} value={priceRange[1]}
            onChange={(e) => { const val = Math.max(Number(e.target.value), priceRange[0] + 50); setPriceRange([priceRange[0], val]); }}
            className="absolute w-full appearance-none bg-transparent cursor-pointer"
            style={{ zIndex: 4 }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-sm text-slate-800">Min</p>
            <p className="text-xs font-bold text-slate-800" style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{priceRange[0]}</p>
          </div>
          <div className="flex-1 mx-2 border-t border-dashed border-slate-200" />
          <div className="text-center">
            <p className="text-sm text-slate-800">Max</p>
            <p className="text-xs font-bold text-slate-800"  style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{priceRange[1]}</p>
          </div>
        </div>
      </div>

      <div className="mx-4 my-2 border-t border-slate-100" />

      {/* Sort */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-1.5 mb-3">
          <TrendingUp size={16} style={{ color: "#ec4899" }} />
          <p className="text-sm font-bold text-slate-800">Sort By</p>
        </div>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map((opt) => {
            const active = sort === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => { setSort(opt.value); setDrawerOpen(false); }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all text-left"
                style={active ? { backgroundColor: "#fdf2f8" } : {}}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = ""; }}
              >
                <span className="text-sm font-medium" style={{ color: active ? "#ec4899" : "#475569" }}>{opt.label}</span>
                <span className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{ borderColor: active ? "#ec4899" : "#cbd5e1" }}>
                  {active && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {hasFilters && (
        <>
          <div className="mx-4 my-2 border-t border-slate-100" />
          <div className="px-4 pb-4">
            <button
              onClick={() => { clearFilters(); setDrawerOpen(false); }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              style={{ border: "1px dashed #ec489960", color: "#ec4899" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#fdf2f8"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = ""}
            >
              <X size={11} /> Clear all filters
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ══ TOP BAR ══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-24 pb-3">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
          <button onClick={() => navigate("/")} className="flex items-center gap-1 hover:text-[#ec4899] transition-colors">
            <Home size={11} /> Home
          </button>
          <Arrow size={10} className="text-slate-300" />
          <button onClick={() => navigate("/shop")} className="hover:text-[#ec4899] transition-colors">Shop</button>
          <Arrow size={10} className="text-slate-300" />
          <span className="text-slate-500 font-medium">All Products</span>
        </nav>

        {/* Title + Search row */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 shrink-0">All Products</h1>
          <div className="relative w-full max-w-xs">
            <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full pl-9 pr-8 py-2 text-sm rounded-full border border-slate-200 bg-white focus:outline-none shadow-sm"
              onFocus={e => e.target.style.borderColor = "#ec4899"}
              onBlur={e => e.target.style.borderColor = "#e2e8f0"}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══ MOBILE: Category pill strip + sort ══ */}
      <div className="lg:hidden max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2">
        {/* Horizontal scrollable category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {categoryList.map((catObj) => {
            const cat = catObj.name;
            const active = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={active
                  ? { backgroundColor: "#ec4899", color: "#fff", borderColor: "#ec4899" }
                  : { backgroundColor: "#fff", color: "#64748b", borderColor: "#e2e8f0" }
                }
              >
                {catObj.image ? (
                  <img src={catObj.image} alt={cat} className="w-4 h-4 rounded-full object-cover" />
                ) : (
                  <span>{CATEGORY_ICONS[cat] || "✨"}</span>
                )}
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      {/* ══ BODY ══ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 lg:py-8 flex gap-6">

        {/* ── Desktop Sidebar ── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          {loading ? (
            <SidebarSkeleton />
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl py-5 shadow-sm sticky top-6 overflow-hidden">
              <Sidebar />
            </div>
          )}
        </aside>

        {/* ── Mobile drawer ── */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setDrawerOpen(false)} />
              <motion.div
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl overflow-y-auto"
              >
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                  <p className="font-bold text-slate-800">Filters & Sort</p>
                  <button onClick={() => setDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all">
                    <X size={16} />
                  </button>
                </div>
                <div className="pt-4">
                  <Sidebar />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 gap-2">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{filtered.length}</span> item{filtered.length !== 1 ? "s" : ""}
              {category !== "All" && <span style={{ color: "#ec4899" }}> · {category}</span>}
            </p>

            <div className="flex items-center gap-2">
              {/* Mobile sort select */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="lg:hidden text-xs font-medium px-3 py-2 rounded-full border border-slate-200 bg-white text-slate-600 focus:outline-none focus:border-[#ec4899] cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Mobile filter button (price + sort via drawer) */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-full border bg-white shadow-sm transition-all"
                style={{ borderColor: (priceActive || hasFilters) ? "#ec4899" : "#e2e8f0", color: (priceActive || hasFilters) ? "#ec4899" : "#64748b" }}
              >
                <SlidersHorizontal size={13} />
                Filter
                {priceActive && (
                  <span className="w-4 h-4 rounded-full text-white text-[9px] flex items-center justify-center" style={{ backgroundColor: "#ec4899" }}>
                    1
                  </span>
                )}
              </button>

              {/* Desktop active filter chips */}
              <div className="hidden lg:flex items-center gap-2 flex-wrap">
                {priceActive && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                    ₹{priceRange[0]}–₹{priceRange[1]}
                    <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}><X size={10} /></button>
                  </span>
                )}
                {sort !== "featured" && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                    {currentSortLabel}
                    <button onClick={() => setSort("featured")}><X size={10} /></button>
                  </span>
                )}
                {search.trim() && (
                  <span className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                    "{search}"
                    <button onClick={() => setSearch("")}><X size={10} /></button>
                  </span>
                )}
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-[#ec4899] hover:underline font-medium">Clear all</button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile active filter chips row */}
          {hasFilters && (
            <div className="lg:hidden flex items-center gap-2 flex-wrap mb-3">
              {priceActive && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                  ₹{priceRange[0]}–₹{priceRange[1]}
                  <button onClick={() => setPriceRange([PRICE_MIN, PRICE_MAX])}><X size={10} /></button>
                </span>
              )}
              {search.trim() && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600">
                  "{search}"
                  <button onClick={() => setSearch("")}><X size={10} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-[#ec4899] font-medium hover:underline">Clear all</button>
            </div>
          )}

          
       {/* Grid */}
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : (
            <AnimatePresence mode="wait">
              {paginated.length === 0 ? (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="py-24 text-center">
                  <div className="text-5xl mb-4">🎂</div>
                  <p className="text-slate-600 font-semibold">No products found</p>
                  <p className="text-slate-400 text-sm mt-1">Try a different search or category</p>
                  <button onClick={clearFilters}
                    className="mt-5 px-5 py-2 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: "#ec4899" }}>
                    Clear filters
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key={`${page}-${category}-${sort}-${search}`}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  
                >
                  {/* Mobile: list view */}
                  <div className="lg:hidden bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {paginated.map((product, i) => (
                      <motion.div key={product.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.03 }}
                      >
                        <ProductCard
                          product={product}
                          onClick={() => navigate(`/product/${product.id}`)}
                          listView={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                  {/* Desktop: grid view */}
                  <div className="hidden lg:grid xl:grid-cols-3 grid-cols-2 gap-5">
                    {paginated.map((product, i) => (
                      <motion.div key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                      >
                        <ProductCard
                          product={product}
                          onClick={() => navigate(`/product/${product.id}`)}
                          gridView={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <Pagination
            current={page}
            total={totalPages}
            onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          />
          {totalPages > 1 && (
            <p className="text-center text-xs text-slate-400 mt-3">
              Showing {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
            </p>
          )}
        </div>
      </div>
    </div>
  );
}





