import { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Hash,
} from "lucide-react";
import AdminLayout from "../../components/Admin/AdminLayout";
import { db } from "../../lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore";

const STATUS_META = {
  pending: { label: "Pending", color: "#2563eb", bg: "#dbeafe" },
  processing: { label: "Processing", color: "#d97706", bg: "#fef3c7" },
  delivered: { label: "Delivered", color: "#16a34a", bg: "#dcfce7" },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fee2e2" },
};

const RS = { fontFamily: "Segoe UI, Roboto, Arial, sans-serif" };
const fmt = (n) => <span style={RS}>₹{Number(n).toLocaleString("en-IN")}</span>;
const fmtStr = (n) => `₹${Number(n).toLocaleString("en-IN")}`; // plain string for CSV/text contexts

/* Simple CSS tooltip — no library needed */
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

/* DD-MM-YYYY display + native calendar picker */
function DateInput({ value, onChange }) {
  const ref = useRef(null);

  const display = value
    ? `${value.slice(8, 10)}-${value.slice(5, 7)}-${value.slice(0, 4)}`
    : "";

  return (
    <div className="relative w-full">
      {/* Styled display */}
      <div
        onClick={() => ref.current?.showPicker?.()}
        className="flex items-center justify-between w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 cursor-pointer hover:border-[#ec4899] transition-colors"
      >
        <span
          className={`text-xs md:text-sm ${display ? "text-gray-700" : "text-gray-400"}`}
        >
          {display || "DD-MM-YYYY"}
        </span>
        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
      </div>

      {/* Hidden native date input — provides the picker */}
      <input
        ref={ref}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 pointer-events-none w-full h-full"
        tabIndex={-1}
      />
    </div>
  );
}
/* Format yyyy-mm-dd → dd-mm-yyyy for display */
const fmtDate = (isoStr) => {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d)) return isoStr;
  return d
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};

/* CSV export — opens in Excel with no format warnings */

const exportExcel = (orders) => {
  // Wrap cell value in quotes, escape internal quotes
  const csvCell = (v) => {
    const s = String(v ?? "");
    return `"${s.replace(/"/g, '""')}"`;
  };

  const headers = [
    "Order ID",
    "Order Date",
    "Customer Name",
    "Phone",
    "Email",
    "Items",
    "Total Qty",
    "Subtotal (Rs)",
    "Delivery Fee (Rs)",
    "Grand Total (Rs)",
    "Payment Method",
    "Transaction ID",
    "Delivery Address",
    "City",
    "Pincode",
    "Delivery Date",
    "Delivery Time",
    "Status",
  ];

  const dataRows = orders.map((o) => {
    const itemsSummary = o.items
      .map((i) => `${i.name} (${i.selectedWeight}) x${i.quantity}`)
      .join(" | ");
    const totalQty = o.items.reduce((s, i) => s + (i.quantity || 1), 0);

    return [
      o.orderId,
      fmtDate(toDateStr(o.createdAt)),
      o.customer.name,
      o.customer.phone,
      o.customer.email || "",
      itemsSummary,
      totalQty,
      o.subtotal,
      o.deliveryFee === 0 ? "FREE" : o.deliveryFee,
      o.total,
      o.paymentMethod,
      o.transactionId || "Not provided",
      o.address,
      o.city,
      o.pincode || "",
      fmtDate(o.deliveryDate),
      o.deliveryTime || "",
      STATUS_META[o.status]?.label || o.status,
    ]
      .map(csvCell)
      .join(",");
  });

  const csv = [headers.map(csvCell).join(","), ...dataRows].join("\r\n");

  // UTF-8 BOM ensures Excel reads Indian characters (Rs, names) correctly
  const bom = "﻿";
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `NoviBakes_Orders_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

function StatusSelect({ value, onChange }) {
  const m = STATUS_META[value];
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      className="text-xs font-semibold px-2.5 py-1 rounded-full border-0 outline-none cursor-pointer appearance-none pr-5 bg-no-repeat"
      style={{
        color: m.color,
        backgroundColor: m.bg,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(m.color)}' stroke-width='2.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundPosition: "right 6px center",
        backgroundSize: "10px",
      }}
    >
      {Object.entries(STATUS_META).map(([k, v]) => (
        <option key={k} value={k}>
          {v.label}
        </option>
      ))}
    </select>
  );
}

function InfoRow({ icon: Icon, label, value, mono }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-slate-400 font-semibold">{label}</p>
        <p
          className={`text-xs text-slate-700 mt-0.5 break-all ${mono ? "font-mono" : "font-medium"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/* Convert Firestore Timestamp or ISO string → "YYYY-MM-DD" */
const toDateStr = (val) => {
  if (!val) return "";
  if (typeof val === "string") return val.slice(0, 10);
  let d = null;
  if (typeof val?.toDate === "function") d = val.toDate();
  else if (val instanceof Date) d = val;
  if (!d || isNaN(d)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const PAGE_SIZE = 10;

const today = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const updateStatus = async (docId, newStatus) => {
    await updateDoc(doc(db, "orders", docId), { status: newStatus });
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase().trim();
      const id = (o.orderId || "").toLowerCase();
      const matchSearch =
        !q ||
        id.includes(q) ||
        (o.customer?.name || "").toLowerCase().includes(q) ||
        (o.customer?.phone || "").includes(q) ||
        (o.transactionId || "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      const oDate = toDateStr(o.createdAt);
      return (
        matchSearch &&
        matchStatus &&
        (!dateFrom || oDate >= dateFrom) &&
        (!dateTo || oDate <= dateTo)
      );
    });
  }, [orders, search, statusFilter, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setPage(1);
  }, [search, statusFilter, dateFrom, dateTo]);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));
  const hasFilters = search || statusFilter !== "all" || dateFrom || dateTo;
  return (
    <AdminLayout>
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Page title + date (in page, not navbar) */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Orders</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {today} &nbsp;·&nbsp; {filtered.length} of {orders.length} orders
            </p>
          </div>
          <button
            onClick={() => exportExcel(filtered)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs md:text-sm font-semibold shadow-md hover:shadow-lg active:scale-95 transition-all"
            style={{ backgroundColor: "#ec4899" }}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Excel</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>

        {/* ── Filters — always visible ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[15px] font-semibold text-slate-900 mb-1.5">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Name, order ID, phone…"
                  className="w-full pl-9 pr-3 py-2.5 text-xs md:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#ec4899] text-gray-700 bg-gray-50"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[15px] font-semibold text-slate-900 mb-1.5">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs md:text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#ec4899] text-gray-700 bg-gray-50"
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_META).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-[15px] font-semibold text-slate-900 mb-1.5">
                From Date
              </label>
              <DateInput value={dateFrom} onChange={setDateFrom} />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-[15px] font-semibold text-slate-900 mb-1.5">
                To Date
              </label>
              <div className="flex gap-2">
                <div className="flex-1">
                  <DateInput value={dateTo} onChange={setDateTo} />
                </div>
                {hasFilters && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="px-3 text-xs text-red-500 hover:text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-all font-medium whitespace-nowrap"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile: cards ── */}
        <div className="md:hidden space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-gray-100">
              No orders found.
            </div>
          ) : (
            filtered.map((o) => {
              const isOpen = expanded === o.orderId;
              return (
                <div
                  key={o.orderId}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    className="w-full text-left px-4 py-4"
                    onClick={() => toggle(o.orderId)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[10px] text-slate-400 mb-0.5">
                          {o.orderId}
                        </p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {o.customer.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {o.customer.phone}
                        </p>
                        <p className="text-xs text-slate-400">
                          {fmtDate(toDateStr(o.createdAt))}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="text-base font-bold text-slate-900">
                          {fmt(o.total)}
                        </p>
                        <StatusSelect
                          value={o.status}
                          onChange={(s) => updateStatus(o.orderId, s)}
                        />
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
                          {o.items.map((i, idx) => (
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
                            value={o.customer.phone}
                          />
                          <InfoRow
                            icon={Mail}
                            label="Email"
                            value={o.customer.email}
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

                      {o.specialInstructions && (
                        <div className="bg-pink-50 rounded-xl p-3 border border-pink-100">
                          <p className="text-xs font-bold text-orange-700 mb-1">
                            Special Instructions
                          </p>
                          <p className="text-xs text-pink-600">
                            {o.specialInstructions}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* ── Desktop: table ── */}
        <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-sm">
              No orders match your filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/80">
                    {[
                      "Order id",
                      "Date",
                      "Customer",
                      "Items",
                      "Qty",
                      "Amount",
                      "Payment / Txn id",
                      "Delivery",
                      "Status",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3.5 text-xs font-semibold whitespace-nowrap"
                        style={{ color: "#6b7280" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((o) => {
                    const isOpen = expanded === o.orderId;
                    const totalQty = o.items.reduce(
                      (s, i) => s + (i.quantity || 1),
                      0,
                    );
                    return (
                      <>
                        <tr
                          key={o.orderId}
                          className={`cursor-pointer transition-colors ${isOpen ? "bg-pink-50/30" : "hover:bg-gray-50/60"}`}
                          onClick={() => toggle(o.orderId)}
                        >
                          <td className="px-4 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                            <Tip text={o.orderId}>{o.orderId}</Tip>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap">
                            {fmtDate(toDateStr(o.createdAt))}
                          </td>
                          <td className="px-4 py-4">
                            <Tip
                              text={`${o.customer.name}\n${o.customer.phone}${o.customer.email ? "\n" + o.customer.email : ""}`}
                            >
                              <p className="font-semibold text-slate-900 text-sm whitespace-nowrap cursor-default">
                                {o.customer.name}
                              </p>
                            </Tip>
                            <p className="text-xs text-slate-800 mt-0.5">
                              {o.customer.phone}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-xs text-slate-800 max-w-[160px]">
                            {o.items.map((i, idx) => (
                              <Tip
                                key={idx}
                                text={`${i.name} (${i.selectedWeight}) × ${i.quantity}\n${fmtStr(i.totalPrice)}`}
                              >
                                <p className="truncate cursor-default">
                                  {i.name}{" "}
                                  <span className="text-slate-800">
                                    ({i.selectedWeight})
                                  </span>
                                </p>
                              </Tip>
                            ))}
                          </td>
                          <td className="px-4 py-4 text-center text-sm font-semibold text-slate-800">
                            {totalQty}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <p className="font-bold text-slate-800">
                              {fmt(o.total)}
                            </p>
                            {o.deliveryFee === 0 ? (
                              <p className="text-xs text-green-600 font-medium">
                                Free delivery
                              </p>
                            ) : (
                              <p className="text-xs text-slate-800">
                                +{fmt(o.deliveryFee)}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-xs font-semibold text-slate-800">
                              {o.paymentMethod}
                            </p>
                            {o.transactionId ? (
                              <Tip text={o.transactionId}>
                                <p className="font-mono text-xs text-slate-800 mt-0.5 max-w-[120px] truncate cursor-default">
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
                            <p className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                              {fmtDate(o.deliveryDate)}
                            </p>
                            <p className="text-xs text-slate-800 mt-0.5">
                              {o.deliveryTime}
                            </p>
                          </td>
                          <td
                            className="px-4 py-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <StatusSelect
                              value={o.status}
                              onChange={(s) => updateStatus(o.orderId, s)}
                            />
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
                          <tr key={`${o.orderId}-exp`}>
                            <td
                              colSpan={10}
                              className="bg-slate-50/60 border-b border-gray-100"
                            >
                              <div className="px-5 py-5 grid grid-cols-3 gap-5">
                                {/* Items breakdown */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100">
                                  <p className="text-xs font-bold text-slate-800 mb-3">
                                    Items Ordered
                                  </p>
                                  <div className="space-y-2">
                                    {o.items.map((i, idx) => (
                                      <div
                                        key={idx}
                                        className="flex justify-between text-sm gap-2"
                                      >
                                        <span className="text-slate-800 min-w-0">
                                          {i.name}
                                          <span className="text-slate-800 ml-1">
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
                                      <div className="flex justify-between text-xs text-slate-800">
                                        <span>Subtotal</span>
                                        <span>{fmt(o.subtotal)}</span>
                                      </div>
                                      <div className="flex justify-between text-xs text-slate-900">
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

                                {/* Customer details */}
                                <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-3">
                                  <p className="text-xs font-bold text-slate-800">
                                    Customer Details
                                  </p>
                                  <InfoRow
                                    icon={Phone}
                                    label="Phone"
                                    value={o.customer.phone}
                                  />
                                  <InfoRow
                                    icon={Mail}
                                    label="Email"
                                    value={o.customer.email || "—"}
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

                                {/* Payment + Delivery */}
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
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <p className="text-xs text-slate-400">
              Page {safePage} of {totalPages} &nbsp;·&nbsp; showing{" "}
              {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(1)}
                disabled={safePage === 1}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                «
              </button>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 || n === totalPages || Math.abs(n - safePage) <= 1,
                )
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push("…");
                  acc.push(n);
                  return acc;
                }, [])
                .map((n, idx) =>
                  n === "…" ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-slate-300 text-xs"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className="w-8 h-8 text-xs rounded-lg border font-medium transition-all"
                      style={
                        n === safePage
                          ? {
                              backgroundColor: "#ec4899",
                              color: "#fff",
                              borderColor: "#ec4899",
                            }
                          : { borderColor: "#e5e7eb", color: "#374151" }
                      }
                    >
                      {n}
                    </button>
                  ),
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={safePage === totalPages}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 text-slate-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
