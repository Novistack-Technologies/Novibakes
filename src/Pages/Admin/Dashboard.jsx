import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  IndianRupee,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  ArrowRight,
  Package,
  Calendar,
  ChevronDown,
  ChevronUp,
  BarChart2,
  Star,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Hash,
} from "lucide-react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { db,auth } from "../../lib/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const RS = { fontFamily: "Segoe UI, Roboto, Arial, sans-serif" };
const fmt = (n) => (
  <span style={RS}>₹{Number(n || 0).toLocaleString("en-IN")}</span>
);
const fmtStr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

function useCurrentUser() {
  const [user, setUser] = useState(auth.currentUser);
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

const STATUS_META = {
  delivered: { label: "Delivered", color: "#16a34a", bg: "#dcfce7" },
  processing: { label: "Processing", color: "#d97706", bg: "#fef3c7" },
  pending: { label: "Pending", color: "#2563eb", bg: "#dbeafe" },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2" },
};

const PIE_COLORS = [
  "#ec4899",
  "#f97316",
  "#8b5cf6",
  "#06b6d4",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#2563eb",
  "#64748b",
  "#a21caf",
];

/* ── Date helpers — aware of Firestore Timestamps, ISO strings, and Date objects ── */
const toJSDate = (val) => {
  if (!val) return null;
  if (typeof val?.toDate === "function") return val.toDate();
  if (val instanceof Date) return val;
  if (typeof val === "string") {
    const d = new Date(val);
    return isNaN(d) ? null : d;
  }
  return null;
};
const toDateStr = (val) => {
  const d = toJSDate(val);
  return d ? d.toISOString().slice(0, 10) : "";
};
const fmtDate = (val) => {
  const d = toJSDate(val) ?? (typeof val === "string" ? new Date(val) : null);
  if (!d || isNaN(d)) return typeof val === "string" && val ? val : "—";
  return d
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};

/* ── Tooltip ── */
function Tip({ text, children }) {
  return (
    <span className="relative group/tip">
      {children}
      <span className="pointer-events-none absolute z-50 left-0 top-full mt-1.5 w-max max-w-[260px] rounded-lg bg-slate-800 text-white text-[11px] leading-snug px-2.5 py-1.5 shadow-xl opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150 whitespace-pre-wrap break-words">
        {text}
      </span>
    </span>
  );
}

function InfoRow({ icon: Icon, label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold">
          {label}
        </p>
        <p
          className={`text-xs text-slate-700 mt-0.5 break-all ${mono ? "font-mono" : "font-medium"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ value }) {
  const m = STATUS_META[value] || STATUS_META.pending;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ color: m.color, backgroundColor: m.bg }}
    >
      {m.label}
    </span>
  );
}

/* ── Stat Card ─────────────────────────────────────────────────────────────── */
function StatCard({ label, value, accent, sub, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 flex flex-col items-center text-center gap-1.5 transition-shadow duration-200 hover:shadow-md">
      <p className="text-xs font-semibold text-slate-800">{label}</p>
      <p
        className="text-2xl font-extrabold leading-none tracking-tight"
        style={{ color: accent }}
      >
        {value}
      </p>
      {sub && <p className="text-[11px] text-slate-800">{sub}</p>}
      {trend !== undefined && (
        <span
          className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-0.5"
          style={
            trend >= 0
              ? { color: "#16a34a", background: "#dcfce7" }
              : { color: "#dc2626", background: "#fee2e2" }
          }
        >
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
        </span>
      )}
    </div>
  );
}

/* ── SVG Line Chart ── */
function LineChart({ data }) {
  const W = 500,
    H = 160,
    PAD = { top: 20, right: 16, bottom: 32, left: 52 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  if (!data.length)
    return (
      <p className="text-slate-400 text-sm text-center py-8">
        No data for selected range
      </p>
    )
  const maxVal = Math.max(...data.map((d) => d.val), 1);
  const pts = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PAD.top + innerH - (d.val / maxVal) * innerH,
    ...d,
  }));
  const linePath = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
    .join(" ");
  const areaPath = `${linePath} L${pts[pts.length - 1].x},${PAD.top + innerH} L${pts[0].x},${PAD.top + innerH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ({
    val: Math.round(t * maxVal),
    y: PAD.top + innerH - t * innerH,
  }));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
        </linearGradient>
      </defs>
      {ticks.map((t) => (
        <g key={t.val}>
          <line
            x1={PAD.left}
            y1={t.y}
            x2={W - PAD.right}
            y2={t.y}
            stroke="#f3f4f6"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={t.y + 4}
            textAnchor="end"
            fontSize="9"
            fill="#9ca3af"
          >
            {t.val >= 1000 ? `${(t.val / 1000).toFixed(1)}k` : t.val}
          </text>
        </g>
      ))}
      <path d={areaPath} fill="url(#areaGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#ec4899"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {pts.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#ec4899"
            stroke="white"
            strokeWidth="2"
          />
          <text
            x={p.x}
            y={H - 6}
            textAnchor="middle"
            fontSize="9"
            fill="#9ca3af"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Donut Chart (order status) ── */
function DonutChart({ segments, total }) {
  const R = 54,
    C = 70,
    STROKE = 20;
  const circumference = 2 * Math.PI * R;
  let offset = 0;
  return (
    <svg viewBox="0 0 140 140" className="w-32 h-32 shrink-0">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={C}
            cy={C}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${C} ${C})`}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
      <text
        x={C}
        y={C - 6}
        textAnchor="middle"
        fontSize="18"
        fontWeight="700"
        fill="#111827"
      >
        {total}
      </text>
      <text x={C} y={C + 10} textAnchor="middle" fontSize="9" fill="#9ca3af">
        orders
      </text>
    </svg>
  );
}

/* ── SVG Pie Chart (category / product sales) ── */
function PieChart({ segments, centerLabel, centerSub }) {
  const R = 52,
    CX = 68,
    CY = 68;
  const circumference = 2 * Math.PI * R;
  let offset = -circumference / 4;

  if (!segments.length)
    return <p className="text-slate-400 text-sm text-center py-8">No data</p>;

  return (
    <svg viewBox="0 0 136 136" className="w-36 h-36 shrink-0">
      {segments.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference;
        const gap = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke={PIE_COLORS[i % PIE_COLORS.length]}
            strokeWidth={22}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += dash;
        return el;
      })}
      <circle cx={CX} cy={CY} r={40} fill="white" />
      <text
        x={CX}
        y={CY - 6}
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill="#111827"
      >
        {centerLabel}
      </text>
      <text x={CX} y={CY + 9} textAnchor="middle" fontSize="8.5" fill="#9ca3af">
        {centerSub}
      </text>
    </svg>
  );
}

/* ── Date filter presets ── */
const PRESETS = [
  { label: "Today", days: 1 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "All time", days: 0 },
  { label: "Custom", days: -1 },
];

function getFromDate(days) {
  if (days === 0 || days === -1) return null;
  const d = new Date();
  if (days === 1) {
    d.setHours(0, 0, 0, 0);
    return d;
  }
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

/* ── Main ── */
export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [preset, setPreset] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [expanded, setExpanded] = useState(null);

  /* live orders */
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  /* live products, used to resolve category for the category-sales pie */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const PRODUCT_CATEGORY = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.name] = p.category || "Other";
    });
    return map;
  }, [products]);

  const isCustom = PRESETS[preset].days === -1;

  const fromDate = useMemo(() => {
    if (isCustom) return customFrom ? new Date(customFrom + "T00:00:00") : null;
    return getFromDate(PRESETS[preset].days);
  }, [preset, isCustom, customFrom]);

  const toDate = useMemo(() => {
    if (isCustom && customTo) return new Date(customTo + "T23:59:59");
    return null;
  }, [isCustom, customTo]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const d = toJSDate(o.createdAt);
      if (!d) return true; // keep orders with an unreadable date rather than silently dropping them
      if (fromDate && d < fromDate) return false;
      if (toDate && d > toDate) return false;
      return true;
    });
  }, [orders, fromDate, toDate]);

  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const cancelled = filteredOrders.filter(
      (o) => o.status === "cancelled",
    ).length;
    const delivered = filteredOrders.filter(
      (o) => o.status === "delivered",
    ).length;
    const processing = filteredOrders.filter(
      (o) => o.status === "processing",
    ).length;
    const pending = filteredOrders.filter((o) => o.status === "pending").length;
    const revenue = filteredOrders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0);
    const avg =
      total - cancelled ? Math.round(revenue / (total - cancelled)) : 0;
    return { total, revenue, pending, delivered, cancelled, processing, avg };
  }, [filteredOrders]);

  const revenueByDay = useMemo(() => {
    const map = {};
    filteredOrders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        const day = toDateStr(o.createdAt);
        if (!day) return;
        map[day] = (map[day] || 0) + o.total;
      });
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-10)
      .map(([date, val]) => ({
        label: new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
        val,
      }));
  }, [filteredOrders]);

  const donutSegments = useMemo(() => {
    const counts = {
      delivered: stats.delivered,
      processing: stats.processing,
      pending: stats.pending,
      cancelled: stats.cancelled,
    };
    const total = stats.total || 1;
    return Object.entries(counts).map(([key, count]) => ({
      key,
      color: STATUS_META[key].color,
      pct: Math.round((count / total) * 100),
      count,
    }));
  }, [stats]);

  /* category pie — resolved against live Firestore products */
  const categorySales = useMemo(() => {
    const map = {};
    filteredOrders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        (o.items || []).forEach((item) => {
          const cat = PRODUCT_CATEGORY[item.name] || "Other";
          if (!map[cat]) map[cat] = { name: cat, qty: 0, revenue: 0 };
          map[cat].qty += item.quantity || 0;
          map[cat].revenue += item.totalPrice || 0;
        });
      });
    const arr = Object.values(map).sort((a, b) => b.revenue - a.revenue);
    const totalRev = arr.reduce((s, c) => s + c.revenue, 0) || 1;
    return arr.map((c) => ({
      ...c,
      pct: Math.round((c.revenue / totalRev) * 100),
    }));
  }, [filteredOrders, PRODUCT_CATEGORY]);

  /* product pie — top 8 */
  const productSales = useMemo(() => {
    const map = {};
    filteredOrders
      .filter((o) => o.status !== "cancelled")
      .forEach((o) => {
        (o.items || []).forEach((item) => {
          if (!map[item.name])
            map[item.name] = { name: item.name, qty: 0, revenue: 0 };
          map[item.name].qty += item.quantity || 0;
          map[item.name].revenue += item.totalPrice || 0;
        });
      });
    const arr = Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);
    const totalRev = arr.reduce((s, p) => s + p.revenue, 0) || 1;
    return arr.map((p) => ({
      ...p,
      pct: Math.round((p.revenue / totalRev) * 100),
    }));
  }, [filteredOrders]);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  
  const displayName = user?.displayName || user?.email?.split("@")[0] || "Admin";

  const recent = orders.slice(
    0,
    6,
  ); /* most recent overall, independent of date filter */

  const CARDS = [
    {
      label: "Total Orders",
      value: stats.total,
      sub: "Selected period",
      trend: 12,
    },
    {
      label: "Total Revenue",
      value: fmt(stats.revenue),
      sub: "Excl. cancelled",
      trend: 8,
    },
    {
      label: "Avg Order Value",
      value: fmt(stats.avg),
      sub: "Per confirmed order",
      trend: 3,
    },
    {
      label: "Pending",
      value: stats.pending,
      sub: "Awaiting action",
      trend: -2,
    },
    {
      label: "Delivered",
      value: stats.delivered,
      sub: "Successfully done",
      trend: 15,
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      sub: "Not fulfilled",
      trend: -1,
    },
  ];

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
        {/* Welcome banner */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
          <p className="text-sm font-semibold text-slate-800 mb-0.5">
            {todayLabel}
          </p>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">
            Good day,{displayName}
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Here's your NoviBakes overview.
          </p>
        </div>

        {/* Date filter bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            {/* <BarChart2 size={15} className="text-[#ec4899]" /> */}
            Analytics Overview
          </h3>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isCustom && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="text-xs border border-gray-200 rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#ec4899] text-slate-700 bg-white shadow-sm"
                />
                <span className="text-xs text-slate-400">to</span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="text-xs border border-gray-200 rounded-xl px-2.5 py-2 focus:outline-none focus:border-[#ec4899] text-slate-700 bg-white shadow-sm"
                />
              </div>
            )}
            <div className="relative">
              <button
                onClick={() => setFilterOpen((o) => !o)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-gray-200 text-slate-700 hover:border-pink-200 hover:text-[#ec4899] transition-colors shadow-sm"
              >
                <Calendar size={12} />
                {PRESETS[preset].label}
                <ChevronDown
                  size={12}
                  className={`transition-transform ${filterOpen ? "rotate-180" : ""}`}
                />
              </button>
              {filterOpen && (
                <div className="absolute right-0 top-full mt-1.5 bg-white rounded-xl border border-gray-100 shadow-lg z-20 py-1.5 min-w-[140px]">
                  {PRESETS.map((p, i) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        setPreset(i);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                        i === preset
                          ? "text-[#ec4899] bg-pink-50"
                          : "text-slate-700 hover:bg-gray-50"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {CARDS.map((c) => (
            <StatCard key={c.label} {...c} />
          ))}
        </div>

        {/* Revenue trend + order status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Revenue Trend
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Daily · {PRESETS[preset].label}
                </p>
              </div>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full bg-pink-50 text-[#ec4899] border border-pink-100"
                style={RS}
              >
                {fmtStr(stats.revenue)}
              </span>
            </div>
            <LineChart data={revenueByDay} />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <h2 className="text-sm font-bold text-slate-900 mb-0.5">
              Order Status
            </h2>
            <p className="text-xs text-slate-400 mb-3">Breakdown by status</p>
            <div className="flex flex-col items-center gap-4">
              <DonutChart segments={donutSegments} total={stats.total} />
              <div className="w-full space-y-2">
                {donutSegments.map((seg) => (
                  <div
                    key={seg.key}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="text-xs text-slate-600">
                        {STATUS_META[seg.key].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {seg.count}
                      </span>
                      <span className="text-[10px] text-slate-400 w-7 text-right">
                        {seg.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category / product sales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Sales by Category
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Revenue share per category
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <Package size={11} />
                {categorySales.length}
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <PieChart
                segments={categorySales}
                centerLabel={categorySales.length}
                centerSub="categories"
              />
              <div className="w-full space-y-2 min-w-0">
                {categorySales.map((c, i) => (
                  <div key={c.name} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span className="text-xs text-slate-700 font-medium flex-1 truncate">
                      {c.name}
                    </span>
                    <span
                      className="text-xs font-bold text-slate-900 shrink-0"
                      style={RS}
                    >
                      {fmtStr(c.revenue)}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 w-7 text-right">
                      {c.pct}%
                    </span>
                  </div>
                ))}
                {!categorySales.length && (
                  <p className="text-xs text-slate-400">
                    No data for this period
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Sales by Product
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Top products by revenue
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-slate-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
                <Star size={11} />
                Top {productSales.length}
              </span>
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
              <PieChart
                segments={productSales}
                centerLabel={productSales.reduce((s, p) => s + p.qty, 0)}
                centerSub="qty sold"
              />
              <div className="w-full space-y-2 min-w-0">
                {productSales.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                      }}
                    />
                    <span className="text-xs text-slate-700 font-medium flex-1 truncate">
                      {p.name}
                    </span>
                    <span
                      className="text-xs font-bold text-slate-900 shrink-0"
                      style={RS}
                    >
                      {fmtStr(p.revenue)}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0 w-7 text-right">
                      {p.pct}%
                    </span>
                  </div>
                ))}
                {!productSales.length && (
                  <p className="text-xs text-slate-400">
                    No data for this period
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders — expandable */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Latest {recent.length} orders
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/orders")}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#ec4899] hover:text-[#db2777] transition-colors"
            >
              View all <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile: expandable cards */}
          <div className="md:hidden space-y-0 divide-y divide-gray-50">
            {recent.map((o) => {
              const key = o.orderId || o.id;
              const isOpen = expanded === key;
              return (
                <div key={key} className="overflow-hidden">
                  <button
                    className="w-full text-left px-4 py-4"
                    onClick={() => toggle(key)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] text-slate-400 mb-0.5">
                          {key}
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {o.customer?.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {o.customer?.phone}
                        </p>
                        <p className="text-xs text-slate-400">
                          {fmtDate(o.createdAt)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="text-base font-bold text-slate-900">
                          {fmt(o.total)}
                        </p>
                        <StatusBadge value={o.status} />
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-slate-50/50">
                      <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <p className="text-xs font-bold text-slate-700 mb-2">
                          Items Ordered
                        </p>
                        <div className="space-y-1.5">
                          {(o.items || []).map((i, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-slate-600">
                                {i.name}{" "}
                                <span className="text-slate-400">
                                  ({i.selectedWeight})
                                </span>
                                <span className="ml-1 font-semibold text-slate-700">
                                  × {i.quantity}
                                </span>
                              </span>
                              <span className="font-semibold text-slate-800">
                                {fmt(i.totalPrice)}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-dashed border-gray-200 pt-1.5 mt-1.5 space-y-1">
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Subtotal</span>
                              <span>{fmt(o.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-500">
                              <span>Delivery</span>
                              <span>
                                {o.deliveryFee === 0
                                  ? "FREE"
                                  : fmt(o.deliveryFee)}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-900">
                              <span>Total</span>
                              <span>{fmt(o.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-2">
                          <p className="text-xs font-bold text-slate-700 mb-1">
                            Customer
                          </p>
                          <InfoRow
                            icon={Phone}
                            label="Phone"
                            value={o.customer?.phone}
                          />
                          <InfoRow
                            icon={Mail}
                            label="Email"
                            value={o.customer?.email}
                          />
                          <InfoRow
                            icon={MapPin}
                            label="Address"
                            value={`${o.address}, ${o.city}${o.pincode ? " – " + o.pincode : ""}`}
                          />
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-2">
                          <p className="text-xs font-bold text-slate-700 mb-1">
                            Payment
                          </p>
                          <InfoRow
                            icon={CreditCard}
                            label="Method"
                            value={o.paymentMethod}
                          />
                          <InfoRow
                            icon={Hash}
                            label="Txn ID"
                            value={o.transactionId || "Not provided"}
                            mono
                          />
                          <InfoRow
                            icon={Calendar}
                            label="Deliver"
                            value={`${o.deliveryDate} · ${o.deliveryTime}`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop: expandable table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {[
                    "Order ID",
                    "Date",
                    "Customer",
                    "Items",
                    "Qty",
                    "Amount",
                    "Payment / Txn ID",
                    "Delivery",
                    "Status",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recent.map((o) => {
                  const key = o.orderId || o.id;
                  const isOpen = expanded === key;
                  const totalQty = (o.items || []).reduce(
                    (s, i) => s + (i.quantity || 1),
                    0,
                  );
                  return (
                    <>
                      <tr
                        key={key}
                        className={`cursor-pointer transition-colors ${isOpen ? "bg-pink-50/30" : "hover:bg-gray-50/60"}`}
                        onClick={() => toggle(key)}
                      >
                        <td className="px-4 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                          <Tip text={key}>{key}</Tip>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap">
                          {fmtDate(o.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <Tip
                            text={`${o.customer?.name}\n${o.customer?.phone}${o.customer?.email ? "\n" + o.customer.email : ""}`}
                          >
                            <p className="font-semibold text-slate-900 text-sm whitespace-nowrap cursor-default">
                              {o.customer?.name}
                            </p>
                          </Tip>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {o.customer?.phone}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600 max-w-[160px]">
                          {(o.items || []).map((i, idx) => (
                            <Tip
                              key={idx}
                              text={`${i.name} (${i.selectedWeight}) × ${i.quantity}\n${fmtStr(i.totalPrice)}`}
                            >
                              <p className="truncate cursor-default">
                                {i.name}{" "}
                                <span className="text-slate-400">
                                  ({i.selectedWeight})
                                </span>
                              </p>
                            </Tip>
                          ))}
                        </td>
                        <td className="px-4 py-4 text-center text-sm font-semibold text-slate-700">
                          {totalQty}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="font-bold text-slate-900">
                            {fmt(o.total)}
                          </p>
                          {o.deliveryFee === 0 ? (
                            <p className="text-xs text-green-600 font-medium">
                              Free delivery
                            </p>
                          ) : (
                            <p className="text-xs text-slate-400">
                              +{fmt(o.deliveryFee)}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-semibold text-slate-700">
                            {o.paymentMethod}
                          </p>
                          {o.transactionId ? (
                            <Tip text={o.transactionId}>
                              <p className="font-mono text-xs text-slate-400 mt-0.5 max-w-[120px] truncate cursor-default">
                                {o.transactionId}
                              </p>
                            </Tip>
                          ) : (
                            <p className="text-xs text-red-400 mt-0.5">
                              No txn ID
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                            {fmtDate(o.deliveryDate)}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {o.deliveryTime}
                          </p>
                        </td>
                        <td
                          className="px-4 py-4"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <StatusBadge value={o.status} />
                        </td>
                        <td className="px-3 py-4 text-gray-300">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </td>
                      </tr>

                      {isOpen && (
                        <tr key={`${key}-exp`}>
                          <td
                            colSpan={10}
                            className="bg-slate-50/60 border-b border-gray-100"
                          >
                            <div className="px-5 py-5 grid grid-cols-3 gap-5">
                              <div className="bg-white rounded-xl p-4 border border-gray-100">
                                <p className="text-xs font-bold text-slate-700 mb-3">
                                  Items Ordered
                                </p>
                                <div className="space-y-2">
                                  {(o.items || []).map((i, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between text-xs gap-2"
                                    >
                                      <span className="text-slate-600 min-w-0">
                                        {i.name}
                                        <span className="text-slate-400 ml-1">
                                          ({i.selectedWeight})
                                        </span>
                                        <span className="ml-1 font-semibold text-slate-800">
                                          × {i.quantity}
                                        </span>
                                      </span>
                                      <span className="font-semibold shrink-0">
                                        {fmt(i.totalPrice)}
                                      </span>
                                    </div>
                                  ))}
                                  <div className="border-t border-dashed border-gray-200 pt-2 mt-1 space-y-1">
                                    <div className="flex justify-between text-xs text-slate-500">
                                      <span>Subtotal</span>
                                      <span>{fmt(o.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                      <span>Delivery</span>
                                      <span>
                                        {o.deliveryFee === 0
                                          ? "FREE"
                                          : fmt(o.deliveryFee)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-sm font-bold text-slate-900">
                                      <span>Total</span>
                                      <span>{fmt(o.total)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                                <p className="text-xs font-bold text-slate-700">
                                  Customer Details
                                </p>
                                <InfoRow
                                  icon={Phone}
                                  label="Phone"
                                  value={o.customer?.phone}
                                />
                                <InfoRow
                                  icon={Mail}
                                  label="Email"
                                  value={o.customer?.email || "—"}
                                />
                                <InfoRow
                                  icon={MapPin}
                                  label="Address"
                                  value={o.address}
                                />
                                <div className="flex gap-4">
                                  <InfoRow
                                    icon={MapPin}
                                    label="City"
                                    value={o.city}
                                  />
                                  <InfoRow
                                    icon={MapPin}
                                    label="Pincode"
                                    value={o.pincode || "—"}
                                  />
                                </div>
                              </div>
                              <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                                <p className="text-xs font-bold text-slate-700">
                                  Payment & Delivery
                                </p>
                                <InfoRow
                                  icon={CreditCard}
                                  label="Payment Method"
                                  value={o.paymentMethod}
                                />
                                <InfoRow
                                  icon={Hash}
                                  label="Transaction ID"
                                  value={o.transactionId || "Not provided"}
                                  mono
                                />
                                <InfoRow
                                  icon={Calendar}
                                  label="Delivery Date"
                                  value={o.deliveryDate}
                                />
                                <InfoRow
                                  icon={Calendar}
                                  label="Delivery Time"
                                  value={o.deliveryTime}
                                />
                                {o.specialInstructions && (
                                  <div className="bg-pink-50 rounded-lg p-2.5 border border-pink-100">
                                    <p className="text-[10px] font-bold text-pink-600 uppercase tracking-wide mb-0.5">
                                      Special Instructions
                                    </p>
                                    <p className="text-xs text-orange-700">
                                      {o.specialInstructions}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
