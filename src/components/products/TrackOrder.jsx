import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, CheckCircle2, Clock, Truck,
  XCircle, MapPin, Phone, Mail, CreditCard,
  CalendarDays, ShoppingBag, ChevronRight, AlertCircle,
} from "lucide-react";
import {getCollection, addDocument, updateDocument, deleteDocument, getDocument} from "../../lib/firebase";
import gpayLogo    from "../../assets/upi/Gpay.jpg";
import phonepeLogo from "../../assets/upi/PhonePE.jpg";
import paytmLogo   from "../../assets/upi/Paytm.png";
import bhimLogo    from "../../assets/upi/bhim.jpg";

const UPI_LOGO_MAP = { gpay: gpayLogo, phonepe: phonepeLogo, paytm: paytmLogo, bhim: bhimLogo };

const UpiLogo = ({ method }) => {
  if (!method) return null;
  const key = method.toLowerCase().replace(/[\s-]/g, "");
  const match = Object.keys(UPI_LOGO_MAP).find(k => key.includes(k));
  if (!match) return null;
  return <img src={UPI_LOGO_MAP[match]} alt={method} className="w-8 h-8 object-contain" />;
};

const RS = { fontFamily: "Segoe UI, Roboto, Arial, sans-serif" };
const fmt = (n) => <span style={RS}>₹{Number(n).toLocaleString("en-IN")}</span>;

const STATUS = {
  pending: {
    label: "Order Placed",
    color: "#2563eb",
    bg: "#dbeafe",
    icon: Clock,
    desc: "Your order has been placed and is waiting for confirmation.",
    step: 1,
  },
  processing: {
    label: "Being Prepared",
    color: "#d97706",
    bg: "#fef3c7",
    icon: Package,
    desc: "Our bakers are preparing your order with love!",
    step: 2,
  },
  delivered: {
    label: "Delivered",
    color: "#16a34a",
    bg: "#dcfce7",
    icon: CheckCircle2,
    desc: "Your order has been delivered successfully. Enjoy!",
    step: 4,
  },
  cancelled: {
    label: "Cancelled",
    color: "#dc2626",
    bg: "#fee2e2",
    icon: XCircle,
    desc: "This order has been cancelled.",
    step: 0,
  },
};

const STEPS = [
  { key: "pending",        label: "Order Placed", icon: ShoppingBag  },
  { key: "processing",     label: "Preparing",    icon: Package      },
  { key: "outForDelivery", label: "On the Way",   icon: Truck        },
  { key: "delivered",      label: "Delivered",    icon: CheckCircle2 },
];

function Stepper({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-red-50 rounded-2xl border border-red-100">
        <XCircle size={20} className="text-red-500 shrink-0" />
        <p className="text-sm font-semibold text-red-600">This order was cancelled</p>
      </div>
    );
  }

  const activeStep = STATUS[status]?.step ?? 1;

  return (
    <div className="relative flex items-start justify-between gap-1 px-2">
      <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-100 z-0" />
      <div
        className="absolute top-4 left-6 h-0.5 bg-[#ec4899] z-0 transition-all duration-700"
        style={{ width: `calc((100% - 3rem) * ${(activeStep - 1) / (STEPS.length - 1)})` }}
      />
      {STEPS.map((step, i) => {
        const done    = i + 1 < activeStep;
        const current = i + 1 === activeStep;
        const Icon    = step.icon;
        return (
          <div key={step.key} className="flex flex-col items-center gap-2 z-10 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
              done    ? "bg-[#ec4899] border-[#ec4899]" :
              current ? "bg-white border-[#ec4899] shadow-md shadow-pink-100" :
                        "bg-white border-gray-200"
            }`}>
              <Icon size={14} className={done ? "text-white" : current ? "text-[#ec4899]" : "text-gray-300"} />
            </div>
            <p className={`text-[10px] font-semibold text-center leading-tight ${
              current ? "text-[#ec4899]" : done ? "text-slate-600" : "text-slate-300"
            }`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const s = STATUS[order.status] ?? STATUS.pending;
  const StatusIcon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl border border-gray-100 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ backgroundColor: s.bg }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: s.color + "22" }}>
              <StatusIcon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Order Status</p>
              <p className="text-base font-extrabold" style={{ color: s.color }}>{s.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">Order ID</p>
            <p className="font-bold text-slate-800 text-sm font-mono">{order.orderId}</p>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: s.color + "cc" }}>{s.desc}</p>
      </div>

      <div className="p-5 space-y-6">
        <Stepper status={order.status} />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Order Date",    icon: Clock,        value: new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), sub: new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
            { label: "Delivery Date", icon: CalendarDays, value: new Date(order.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), sub: order.deliveryTime },
          ].map(({ label, icon: Icon, value, sub }) => (
            <div key={label} className="bg-gray-50 rounded-2xl p-3.5 space-y-1.5">
              <p className="text-sm font-bold text-slate-800">{label}</p>
              <div className="flex items-center gap-2">
                <Icon size={13} className="text-[#ec4899] shrink-0" />
                <p className="text-sm font-bold text-slate-800">{value}</p>
              </div>
              <p className="text-xs text-slate-800 pl-5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Items + Totals */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
            <p className="text-sm font-bold text-slate-800">Items Ordered</p>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 gap-3 bg-white border-b border-gray-50 last:border-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
                  <ShoppingBag size={13} className="text-[#ec4899]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.selectedWeight} &times; {item.quantity}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-slate-900 shrink-0">{fmt(item.totalPrice)}</p>
            </div>
          ))}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Subtotal</span><span>{fmt(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Delivery Fee</span>
              {order.deliveryFee === 0
                ? <span className="font-semibold text-green-600">FREE</span>
                : <span className="text-slate-500">{fmt(order.deliveryFee)}</span>}
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-gray-200">
              <span>Total</span><span>{fmt(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Payment + Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2">
            <p className="text-sm font-bold text-slate-800">Payment</p>
            <div className="flex items-center gap-2.5">
              <UpiLogo method={order.paymentMethod} />
              {!["gpay","phonepe","paytm","bhim"].some(k => order.paymentMethod?.toLowerCase().replace(/[\s-]/g,"").includes(k)) && (
                <CreditCard size={14} className="text-[#ec4899]" />
              )}
              <span className="text-sm font-semibold text-slate-700">{order.paymentMethod}</span>
            </div>
            {order.transactionId && (
              <div className="flex items-start gap-1.5 pt-0.5">
                {/* <span className="text-sm text-slate-800 shrink-0 mt-0.5">TXN</span> */}
                {/* <p className="text-sm text-slate-800 break-all">{order.transactionId}</p> */}
              </div>
            )}
          </div>
          <div className="bg-gray-50 rounded-2xl p-3.5 space-y-2">
            <p className="text-sm font-bold text-slate-800">Delivery Address</p>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-[#ec4899] mt-0.5 shrink-0" />
              <div className="text-xs text-slate-800 leading-relaxed">
                <p className="font-semibold text-slate-800">{order.city}</p>
                <p>{order.address}</p>
                <p className="text-slate-800">{order.pincode}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="rounded-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-100">
            <p className="text-sm font-bold text-slate-800">Customer</p>
          </div>
          <div className="bg-white px-4 py-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <p className="text-sm font-bold text-slate-800 mb-0.5">Name</p>
                <p className="text-sm  text-slate-800">{order.customer.name}</p>
              </div>
              {order.customer.phone && (
                <div>
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Mobile</p>
                  <p className="text-sm  text-slate-800">{order.customer.phone}</p>
                </div>
              )}
              {order.customer.email && (
                <div className="col-span-2">
                  <p className="text-sm font-bold text-slate-800 mb-0.5">Email</p>
                  <p className="text-sm  text-slate-800 truncate">{order.customer.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function TrackOrder() {
  const [input, setInput]       = useState("");
  const [query, setQuery]       = useState("");
  const [order, setOrder]       = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);

  const runSearch = async (orderId) => {
    const trimmed = orderId.trim();
    if (!trimmed) return;
    setLoading(true);
    setSearched(true);
    setQuery(trimmed);
    try {
      const result = await getDocument("orders", trimmed);
      setOrder(result ?? null);
    } catch (err) {
      console.error("Failed to fetch order:", err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch(input);
  };

  const handleClear = () => {
    setInput("");
    setQuery("");
    setOrder(null);
    setSearched(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50/60 to-white pt-24 pb-14 px-4">
      <div className="max-w-xl mx-auto">

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-14 h-14 rounded-3xl bg-[#ec4899] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-200">
            <Truck size={26} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Track Your Order</h1>
          <p className="text-slate-500 text-sm mt-2">Enter your order ID to check the status and details</p>
        </motion.div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="e.g. NB-250601-A3FX"
              className="w-full pl-10 pr-9 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 shadow-sm placeholder:text-slate-300 uppercase"
              style={{ letterSpacing: "0.05em" }}
            />
            {input && (
              <button type="button" onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                <XCircle size={16} />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-[#ec4899] hover:bg-[#db2777] text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-md shadow-pink-200 transition-colors shrink-0 disabled:opacity-60"
          >
            {loading ? "Searching…" : <>Track <ChevronRight size={15} /></>}
          </button>
        </form>

        <AnimatePresence mode="wait">
          {!loading && searched && !order && (
            <motion.div key="not-found" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-3 py-14 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <AlertCircle size={26} className="text-red-400" />
              </div>
              <p className="font-bold text-slate-800">Order not found</p>
              <p className="text-sm text-slate-400 max-w-xs">
                We couldn't find an order matching <span className="font-mono font-semibold text-slate-600">"{query}"</span>.
                Please check the order ID and try again.
              </p>
              <p className="text-xs text-slate-400 mt-1">Your order ID was sent to you via WhatsApp after placing the order.</p>
            </motion.div>
          )}

          {!loading && order && (
            <motion.div key={order.orderId} className="space-y-4">
              <OrderCard order={order} />
              <div className="flex justify-center">
                <button onClick={handleClear}
                  className="flex items-center gap-2 text-sm font-semibold text-[#ec4899] border border-pink-200 bg-white hover:bg-pink-50 px-5 py-2.5 rounded-2xl transition-colors shadow-sm">
                  <XCircle size={15} /> Track Another Order
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* {/* {!searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-center">
            {/* <p className="text-xs text-slate-400 mb-3">Try a sample order ID:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["NB-250601-A3FX", "NB-250618-H8YZ", "NB-250621-K5CD"].map(id => (
                <button key={id} onClick={() => { setInput(id); runSearch(id); }}
                  className="font-mono text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-slate-500 hover:border-pink-300 hover:text-[#ec4899] transition-colors shadow-sm">
                  {id}
                </button>
              ))}
            </div>
          </motion.div>
        )} */}

      </div>
    </div>
  );
}