import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Loader2, MessageCircle,
  QrCode, Smartphone, Copy, Check, ArrowLeft, Sparkles,
  ShieldCheck, Package, X,
} from "lucide-react";
import QRCode from "qrcode";

import { useCart } from "../../Context/CartContext";
import { setDoc, doc } from "../../lib/firebase";
import { db } from "../../lib/firebase";
import { getDocs, query, collection, where } from "firebase/firestore";

import gpayLogo    from "../../assets/upi/Gpay.jpg";
import phonepeLogo from "../../assets/upi/PhonePE.jpg";
import paytmLogo   from "../../assets/upi/Paytm.png";
import bhimLogo    from "../../assets/upi/bhim.jpg";

const BAKERY_WHATSAPP = import.meta.env.VITE_BAKERY_WHATSAPP;
const DELIVERY_CHARGE = 50;
const UPI_ID = import.meta.env.VITE_UPI_ID;
const BAKERY_NAME = import.meta.env.VITE_BAKERY_NAME;

const UPI_LOGO_MAP = { gpay: gpayLogo, phonepe: phonepeLogo, paytm: paytmLogo, bhim: bhimLogo };

// ── UPI UTR validation rules ─────────────────────────────────────────────
// UPI UTR (Reference Number / RRN) is always a 12-digit numeric value.

const UTR_PATTERNS = {
  gpay: {
    regex: /^\d{12}$/,
    hint: "12-digit UPI UTR (e.g. 123456789012)",
  },

  phonepe: {
    regex: /^\d{12}$/,
    hint: "12-digit UPI UTR (e.g. 123456789012)",
  },

  paytm: {
    regex: /^\d{12}$/,
    hint: "12-digit UPI UTR (e.g. 123456789012)",
  },

  bhim: {
    regex: /^\d{12}$/,
    hint: "12-digit UPI UTR (e.g. 123456789012)",
  },
};
const UpiLogo = ({ id, mini = false }) => {
  const src = UPI_LOGO_MAP[id];
  if (!src) return null;
  return <img src={src} alt={id} className={mini ? "w-8 h-8 object-contain" : "w-11 h-11 object-contain"} />;
};

const UPI_APPS = [
  { id: "gpay",    name: "GPay",    scheme: (p) => `tez://upi/pay?${p}`,  fallback: "https://pay.google.com/" },
  { id: "phonepe", name: "PhonePe", scheme: (p) => `phonepe://pay?${p}`,  fallback: "https://www.phonepe.com/" },
  { id: "paytm",   name: "Paytm",   scheme: (p) => `paytmmp://pay?${p}`,  fallback: "https://paytm.com/" },
  { id: "bhim",    name: "BHIM",    scheme: (p) => `bhim://pay?${p}`,     fallback: "https://www.bhimupi.org.in/" },
];

const UPI_IDS = new Set(UPI_APPS.map((a) => a.id));
const PAYMENT_STEP = { IDLE: "idle", PAYING: "paying", RETURNED: "returned" };

const inputBase =
  "w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-100 focus:border-[#ec4899] placeholder:text-gray-400 text-gray-700 bg-white transition-colors";

const formatDate = (iso) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y.slice(2)}`;
};

// ── Sanitization helpers ────────────────────────────────────────────────────
// Strips HTML tags, collapses newlines/whitespace (prevents WhatsApp message
// layout injection via *bold* markers or fake line breaks), and caps length.
const sanitizeText = (str, maxLen = 300) => {
  if (typeof str !== "string") return "";
  return str
    .replace(/<[^>]*>/g, "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
};
const sanitizePhone = (str) =>
  typeof str === "string" ? str.replace(/[^\d+\-\s]/g, "").trim().slice(0, 20) : "";
const sanitizeEmail = (str) =>
  typeof str === "string" ? str.trim().toLowerCase().slice(0, 100) : "";
const sanitizePincode = (str) =>
  typeof str === "string" ? str.replace(/\D/g, "").slice(0, 6) : "";

const getSanitizedForm = (f) => ({
  name: sanitizeText(f.name, 80),
  phone: sanitizePhone(f.phone),
  email: sanitizeEmail(f.email),
  address: sanitizeText(f.address, 300),
  city: sanitizeText(f.city, 80),
  pincode: sanitizePincode(f.pincode),
  deliveryDate: f.deliveryDate,
  deliveryTime: f.deliveryTime,
  specialInstructions: sanitizeText(f.specialInstructions, 300),
  paymentMethod: f.paymentMethod,
  transactionId: sanitizeText(f.transactionId, 40),
});

// ─────────────────────────────────────────────────────────────────────────────
const CheckoutPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { cartItems, clearCart } = useCart();

  const singleProduct = location.state?.singleProduct;
  const orderItems    = singleProduct ? [singleProduct] : cartItems;

  const subtotal    = orderItems.reduce((sum, i) => sum + i.totalPrice, 0);
  const deliveryFee = subtotal >= 1000 ? 0 : DELIVERY_CHARGE;
  const total       = subtotal + deliveryFee;

  // ── UPI / QR refs & state ──────────────────────────────────────────────────
  const qrSidebarRef  = useRef(null);   // right-column QR
  const qrPanelRef    = useRef(null);   // inside open-app panel QR
  const txnInputRef   = useRef(null);
  const didReturnRef  = useRef(false);
  const datePickerRef = useRef(null);
  const isSubmittingRef = useRef(false); // guards against double-submit / duplicate orders

  const [paymentStep, setPaymentStep] = useState(PAYMENT_STEP.IDLE);
  const [payingApp,   setPayingApp]   = useState(null);
  const [copied,      setCopied]      = useState(false);
  const [tooltip,     setTooltip]     = useState({ visible: false, name: "", x: 0, y: 0 });

  const upiParams    = `pa=${UPI_ID}&pn=${encodeURIComponent(BAKERY_NAME)}&am=${total}&cu=INR`;
  const upiIntentUrl = `upi://pay?${upiParams}`;

  const drawQr = useCallback(() => {
    [qrSidebarRef, qrPanelRef].forEach((ref) => {
      if (!ref.current) return;
      QRCode.toCanvas(ref.current, upiIntentUrl, {
        width: 140, margin: 1,
        color: { dark: "#1a0a05", light: "#00000000" },
      }).catch((err) => console.warn("QR generation failed:", err));
    });
  }, [upiIntentUrl]);

  useEffect(() => { drawQr(); }, [drawQr]);

  // Detect return from UPI app
  useEffect(() => {
    if (paymentStep !== PAYMENT_STEP.PAYING) return;
    const onVisible = () => {
      if (document.visibilityState === "visible" && !didReturnRef.current) {
        didReturnRef.current = true;
        setTimeout(() => {
          setPaymentStep(PAYMENT_STEP.RETURNED);
          setTimeout(() => {
            txnInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            txnInputRef.current?.focus();
          }, 400);
        }, 300);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [paymentStep]);

  const openUpiApp = (app) => {
    setPayingApp(app.name);
    setPaymentStep(PAYMENT_STEP.PAYING);
    didReturnRef.current = false;
    window.location.href = app.scheme(upiParams);
    setTimeout(() => {
      if (document.visibilityState === "visible") window.open(app.fallback, "_blank");
    }, 1800);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Form state ─────────────────────────────────────────────────────────────
  const minDate = (() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    address: "", city: "", pincode: "",
    deliveryDate: "", deliveryTime: "",
    specialInstructions: "",
    paymentMethod: "", transactionId: "",
  });
  const [errors,  setErrors]  = useState({});
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [orderId,   setOrderId]   = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false); // true once saved — blocks resubmission

  const needsTransactionId = UPI_IDS.has(form.paymentMethod);

  // Re-draw panel QR whenever payment method changes (canvas mounts after selection)
  useEffect(() => {
    if (!form.paymentMethod) return;
    const t = setTimeout(() => {
      if (!qrPanelRef.current) return;
      QRCode.toCanvas(qrPanelRef.current, upiIntentUrl, {
        width: 140, margin: 1,
        color: { dark: "#1a0a05", light: "#00000000" },
      }).catch((err) => console.warn("QR generation failed:", err));
    }, 50);
    return () => clearTimeout(t);
  }, [form.paymentMethod, upiIntentUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
  const e = {};
  if (!form.name.trim())    e.name    = "Full name is required";
  if (!form.phone.trim())   e.phone   = "Phone number is required";
  else if (!/^\+?[\d\s-]{8,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
  if (!form.address.trim()) e.address = "Address is required";
  if (!form.city.trim())    e.city    = "City is required";
  if (form.pincode && !/^\d{6}$/.test(form.pincode)) e.pincode = "Enter a valid 6-digit pincode";
  if (!form.deliveryDate)   e.deliveryDate = "Delivery date is required";
  if (!form.deliveryTime)   e.deliveryTime = "Delivery time is required";
  if (!form.paymentMethod)  e.paymentMethod = "Please select a payment method";

  if (needsTransactionId) {
    const txn     = form.transactionId.trim();
    const appName = UPI_APPS.find((a) => a.id === form.paymentMethod)?.name;
    const rule    = UTR_PATTERNS[form.paymentMethod];
    if (!txn) {
      e.transactionId = "Transaction ID is required";
    } else if (rule && !rule.regex.test(txn)) {
      e.transactionId = `Invalid ${appName} transaction ID — expected: ${rule.hint}`;
    }
  }

  setErrors(e);
  return Object.keys(e).length === 0;
};
  const buildMessage = () => {
    const now = new Date().toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
    const selectedApp = UPI_APPS.find((a) => a.id === form.paymentMethod);
    const payLabel = selectedApp ? `${selectedApp.name} (UPI)` : form.paymentMethod;
    const deliveryTime = (() => {
      const [h, m] = form.deliveryTime.split(":");
      const hr = Number(h);
      return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
    })();      
    
    const itemLines = orderItems.map(
      (item, i) =>
        `${i + 1}. ${item.name} (${item.selectedWeight}) - Qty: ${item.quantity}  —  Rs.${item.totalPrice.toLocaleString("en-IN")}`
    );
    const lines = [
      `*${BAKERY_NAME} — New Order Request*`,
      ``,
      `*Order ID:* ${orderId}`,
      `*Placed on:* ${now}`,
      ``,
      `*------- Items -------*`,
      ...itemLines,
      ``,
      `*Subtotal:* Rs.${subtotal.toLocaleString("en-IN")}`,
      `*Delivery:* ${deliveryFee === 0 ? "Free" : `Rs.${deliveryFee}`}`,
      `*Total:* Rs.${total.toLocaleString("en-IN")}`,
      ``,
      `*------- Delivery -------*`,
      `*Name:* ${form.name}`,
      `*City:* ${form.city}${form.pincode ? ` - ${form.pincode}` : ""}`,
      `*Date:* ${formatDate(form.deliveryDate)}`,
      `*Time:* ${deliveryTime}`,
      `*Payment:* ${payLabel}`,
      form.specialInstructions
        ? `\n*Special Instructions:*\n${form.specialInstructions}`
        : null,
      ``,
      `Kindly confirm this order at your earliest convenience.`,
    ].filter(Boolean);

    return encodeURIComponent(lines.join("\n"));
  };

    const generateOrderId = () => {
    const now = new Date();
    const date = `${String(now.getDate()).padStart(2,"0")}${String(now.getMonth()+1).padStart(2,"0")}${String(now.getFullYear()).slice(2)}`;
    const rand = Math.random().toString(36).toUpperCase().slice(2,6);
    return `NB-${date}-${rand}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Guard against duplicate orders: blocks rapid double-taps (state hasn't
    // re-rendered the disabled button yet) and blocks resubmission once the
    // order has already been saved successfully.
    if (isSubmittingRef.current || sending || orderPlaced) return;
    isSubmittingRef.current = true;
    setSending(true);

    const cleanForm = getSanitizedForm(form);
    setForm((p) => ({ ...p, ...cleanForm })); // keep state in sync so buildMessage() uses the same clean values
// ── Duplicate UTR check (async, before saving) ──────────────────────────
    if (cleanForm.transactionId) {
      try {
        const dupSnap = await getDocs(
          query(collection(db, "orders"), where("transactionId", "==", cleanForm.transactionId))
        );
        if (!dupSnap.empty) {
          setErrors((p) => ({
            ...p,
            transactionId:
              "This transaction ID has already been used for another order. Please check and re-enter.",
          }));
          txnInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
          txnInputRef.current?.focus();
          isSubmittingRef.current = false;
          setSending(false);
          return;
        }
      } catch (err) {
        // Non-fatal: if the network check fails, proceed to avoid blocking the user
        console.warn("Duplicate UTR check failed:", err);
      }
    }
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    try {
      await setDoc(doc(db, "orders", newOrderId), {
        orderId: newOrderId,
        status: "pending",
        createdAt: new Date().toISOString(),
        customer: {
          name: cleanForm.name,
          phone: cleanForm.phone,
          email: cleanForm.email || "",
        },
        items: orderItems.map(i => ({
          name: i.name,
          selectedWeight: i.selectedWeight,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.totalPrice,
        })),
        subtotal,
        deliveryFee,
        total,
        address: cleanForm.address,
        city: cleanForm.city,
        pincode: cleanForm.pincode || "",
        deliveryDate: cleanForm.deliveryDate,
        deliveryTime: cleanForm.deliveryTime,
        paymentMethod: cleanForm.paymentMethod,
        transactionId: cleanForm.transactionId || "",
        specialInstructions: cleanForm.specialInstructions || "",
      });
      setOrderPlaced(true);
      setShowPopup(true);
    } catch (err) {
      console.error("Failed to save order:", err);
      setErrors((p) => ({ ...p, submit: "Something went wrong saving your order. Please try again." }));
      isSubmittingRef.current = false; // allow retry only if the save actually failed
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    setShowPopup(false);
    setSuccess(true);
    window.open(`https://wa.me/${BAKERY_WHATSAPP}?text=${buildMessage()}`, "_blank");
    clearCart();
    setTimeout(() => navigate("/shop"), 2000);   
  };

  // Closing the popup without going to WhatsApp: the order is already saved
  // in Firestore under its own orderId at this point, so reset local state
  // (in case of back/forward navigation) and send them back to the shop.
  const resetCheckout = () => {
    setForm({
      name: "", phone: "", email: "",
      address: "", city: "", pincode: "",
      deliveryDate: "", deliveryTime: "",
      specialInstructions: "",
      paymentMethod: "", transactionId: "",
    });
    setErrors({});
    setOrderId("");
    setOrderPlaced(false);
    setPaymentStep(PAYMENT_STEP.IDLE);
    isSubmittingRef.current = false;
    setShowPopup(false);
    navigate("/shop/all");
  };


  // ── Empty screen ────────────────────────────────────────────────────────────
  if (!orderItems.length) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
        <p className="text-slate-700 mb-2">No items to checkout.</p>
        <button
          onClick={() => navigate("/shop")}
          className="text-white px-6 py-2.5 rounded-full font-medium text-sm"
          style={{ backgroundColor: "#ec4899" }}
        >
          Shop Now
        </button>
      </div>
    );
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>
        <h2 className="text-2xl font-bold text-gray-800">Order Sent!</h2>
        <p className="text-gray-400">Redirecting you to WhatsApp…</p>
      </div>
    );
  }

  // ── Paying overlay ──────────────────────────────────────────────────────────
  if (paymentStep === PAYMENT_STEP.PAYING) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-6 bg-gray-50 px-4">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-amber-100 animate-ping opacity-40" />
          <div className="relative w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center">
            <Smartphone className="w-10 h-10 text-[#ec4899]" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">Opening {payingApp}…</h3>
          <p className="text-gray-400 text-sm mt-2">Complete your payment of</p>
          <p className="text-3xl font-bold mt-1" style={{ color: "#ec4899", fontFamily: "Segoe UI, Roboto, sans-serif" }}>
            ₹{total.toLocaleString("en-IN")}
          </p>
        </div>
        <p className="text-gray-400 text-xs max-w-[260px] text-center leading-relaxed">
          After paying, come back here to fill in your details and place the order.
        </p>
        <button
          type="button"
          onClick={() => {
            setPaymentStep(PAYMENT_STEP.RETURNED);
            setTimeout(() => {
              txnInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              txnInputRef.current?.focus();
            }, 400);
          }}
          className="flex items-center gap-2 text-sm font-medium bg-amber-50 hover:bg-amber-100 px-5 py-3 rounded-full transition-all"
          style={{ color: "#ec4899" }}
        >
          <ArrowLeft className="w-4 h-4" /> I've paid, fill details now
        </button>
      </div>
    );
  }

  // ── Success Popup ───────────────────────────────────────────────────────────
  if (showPopup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 24 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-xs overflow-hidden"
        >
          {/* Top accent */}
          <div className="h-1.5 w-full" style={{ background: "linear-gradient(90deg, #ec4899, #db2777)" }} />

          {/* Close button */}
          <div className="flex justify-end px-3 pt-3">
            <button
              onClick={resetCheckout}
              className="w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="px-6 pb-6 pt-1 flex flex-col items-center text-center">
            {/* Animated check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.15 }}
              className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ backgroundColor: "#fdf2f8" }}
            >
              <CheckCircle2 size={28} style={{ color: "#ec4899" }} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-lg font-black text-slate-800 mb-1">Order Placed! 🎉</h2>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                We've received your order. Tap{" "}
                <span className="font-semibold text-slate-700">Notify Us on WhatsApp</span>{" "}
                so we can start preparing it and keep you posted.              </p>
            </motion.div>

            {/* Order ID + Total — compact side-by-side */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full grid grid-cols-2 gap-2 mb-2.5"
            >
              <div className="bg-[#fdf2f8] rounded-xl px-3 py-2.5 text-left">
                <div className="flex items-center gap-1 mb-0.5">
                  <Package size={12} style={{ color: "#ec4899" }} className="shrink-0" />
                  <p className="text-[10px] text-slate-400">Order ID</p>
                </div>
                <p className="text-xs font-bold text-slate-800 truncate">{orderId}</p>
              </div>
              <div className="bg-[#fdf2f8] rounded-xl px-3 py-2.5 text-left">
                <div className="flex items-center gap-1 mb-0.5">
                  <ShieldCheck size={12} style={{ color: "#ec4899" }} className="shrink-0" />
                  <p className="text-[10px] text-slate-400">Total</p>
                </div>
                <p className="text-xs font-bold text-slate-800" style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="w-full flex items-center gap-2 bg-green-50 rounded-xl px-3 py-2.5 mb-4 text-left"
            >
              <MessageCircle size={14} className="text-green-600 shrink-0" />
              <p className="text-[11px] text-green-700 font-medium leading-snug">
                A quick WhatsApp message helps us notify you the moment your order status changes.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={handleWhatsAppRedirect}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white text-sm shadow-lg transition-all"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={16} />
              Notify Us on WhatsApp
            </motion.button>

            <p className="text-[10px] text-slate-400 mt-2.5">
              Your order is already saved — this just helps us keep you updated faster
            </p>
          </div>
        </motion.div>
      </div>
    );
  }
  // ── Main checkout layout ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="mt-8 mb-10">
          <button
            onClick={() => navigate("/shop")}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#ec4899] transition-colors mb-5 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Shop
          </button>
          <div className="flex items-end gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
          </div>
          <div className="mt-2 h-px w-12 rounded-full" style={{ backgroundColor: "#ec4899" }} />
        </div>

        {/* Order-save error banner */}
        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
            {errors.submit}
          </div>
        )}

        {/* "Returned from UPI app" banner */}
        <AnimatePresence>
          {paymentStep === PAYMENT_STEP.RETURNED && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Payment done? Great!</p>
                <p className="text-xs text-green-600 mt-0.5">
                  Fill in your details below and paste your transaction ID to complete the order.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="space-y-6">

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-base font-bold text-slate-900 mb-5">Contact Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Your full name"
                      className={`${inputBase} ${errors.name ? "border-red-400 bg-red-50" : ""}`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Phone Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className={`${inputBase} ${errors.phone ? "border-red-400 bg-red-50" : ""}`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                    className={`${inputBase} ${errors.email ? "border-red-400 bg-red-50" : ""}`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
            </motion.div>

            {/* Delivery Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-base font-bold text-slate-900 mb-5">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="address" value={form.address} onChange={handleChange}
                    rows={3} placeholder="House No., Street, Area, Landmark"
                    className={`${inputBase} resize-none ${errors.address ? "border-red-400 bg-red-50" : ""}`}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text" name="city" value={form.city} onChange={handleChange}
                      placeholder="Salem"
                      className={`${inputBase} ${errors.city ? "border-red-400 bg-red-50" : ""}`}
                    />
                    {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pincode</label>
                    <input
                      type="text" name="pincode" value={form.pincode} onChange={handleChange}
                      placeholder="636001" maxLength={6}
                      className={`${inputBase} ${errors.pincode ? "border-red-400 bg-red-50" : ""}`}
                    />
                    {errors.pincode && <p className="text-red-400 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Delivery Date */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Delivery Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={datePickerRef}
                      type="date" name="deliveryDate" value={form.deliveryDate}
                      onChange={handleChange} min={minDate}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => datePickerRef.current?.showPicker()}
                      className={`${inputBase} flex items-center justify-between text-left ${
                        errors.deliveryDate ? "border-red-400 bg-red-50" : ""
                      } ${!form.deliveryDate ? "text-gray-400" : "text-gray-800"}`}
                    >
                      <span>{form.deliveryDate ? formatDate(form.deliveryDate) : "dd-mm-yy"}</span>
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </button>
                    {errors.deliveryDate && <p className="text-red-400 text-xs mt-1">{errors.deliveryDate}</p>}
                  </div>

                  {/* Delivery Time */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Delivery Time <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="time" name="deliveryTime" value={form.deliveryTime}
                      onChange={handleChange}
                      className={`${inputBase} ${errors.deliveryTime ? "border-red-400 bg-red-50" : ""}`}
                    />
                    {form.deliveryTime && (
                      <p className="text-[11px] font-semibold mt-1.5" style={{ color: "#ec4899" }}>
                        🕐 {(() => {
                          const [h, m] = form.deliveryTime.split(":");
                          const hr = Number(h);
                          return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
                        })()}
                      </p>
                    )}
                    {errors.deliveryTime && <p className="text-red-400 text-xs mt-1">{errors.deliveryTime}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Special Instructions <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="specialInstructions" value={form.specialInstructions}
                    onChange={handleChange} rows={2}
                    placeholder="Eggless, less sugar, cake message, etc."
                    className={`${inputBase} resize-none`}
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <h2 className="text-base font-bold text-slate-900 mb-1">Payment Method</h2>
              <p className="text-xs text-gray-400 mb-5">Select your UPI app to pay.</p>

              {/* UPI App Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {UPI_APPS.map((app) => {
                  const isSelected = form.paymentMethod === app.id;
                  return (
                    <label
                      key={app.id}
                      className={`cursor-pointer border-2 rounded-2xl p-4 sm:p-3 flex flex-col items-center gap-2.5 sm:gap-2 transition-all relative ${
                        isSelected
                          ? "border-[#ec4899] bg-amber-50 shadow-md"
                          : "border-gray-200 hover:border-rose-100 bg-white"
                      }`}
                    >
                      <input
                        type="radio" name="paymentMethod" value={app.id}
                        checked={isSelected} onChange={handleChange}
                        className="hidden"
                      />
                      <div className={`absolute top-2.5 right-2.5 w-4 h-4 sm:w-3 sm:h-3 rounded-full border-2 flex items-center justify-center ${isSelected ? "border-[#ec4899]" : "border-gray-300"}`}>
                        {isSelected && <div className="w-2 h-2 sm:w-1.5 sm:h-1.5 rounded-full" style={{ backgroundColor: "#ec4899" }} />}
                      </div>
                      <div className="flex items-center justify-center h-14 sm:h-10">
                        <img
                          src={UPI_LOGO_MAP[app.id]}
                          alt={app.name}
                          className="w-14 h-14 sm:w-11 sm:h-11 object-contain"
                        />
                      </div>
                      <span className="text-xs sm:text-[11px] font-semibold text-gray-600">{app.name}</span>
                    </label>
                  );
                })}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-400 text-xs mb-3">{errors.paymentMethod}</p>
              )}

              {/* Open app panel — shows QR inside after selection */}
              <AnimatePresence>
                {form.paymentMethod && paymentStep === PAYMENT_STEP.IDLE && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-2xl border border-rose-50 bg-amber-50/40 p-4 space-y-4">
                      <p className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" style={{ color: "#ec4899" }} />
                        Tap to open {UPI_APPS.find(a => a.id === form.paymentMethod)?.name} & pay ₹{total.toLocaleString("en-IN")}
                      </p>

                      {/* Open app button */}
                      {(() => {
                        const selectedApp = UPI_APPS.find(a => a.id === form.paymentMethod);
                        return selectedApp ? (
                          <button
                            type="button"
                            onClick={() => openUpiApp(selectedApp)}
                            className="w-full flex items-center justify-center gap-3 rounded-xl py-3 px-5 bg-white hover:bg-amber-50 border-2 border-rose-50 shadow-sm transition-all active:scale-95"
                          >
                            <UpiLogo id={selectedApp.id} />
                            <span className="text-sm font-semibold" style={{ color: "#ec4899" }}>
                              Open {selectedApp.name} →
                            </span>
                          </button>
                        ) : null;
                      })()}

                      {/* Divider */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-amber-100" />
                        <span className="text-gray-400 text-[10px]">or scan QR</span>
                        <div className="flex-1 h-px bg-amber-100" />
                      </div>

                      {/* QR inside the panel */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="bg-white rounded-2xl p-3 shadow-sm">
                          <canvas ref={qrPanelRef} />
                        </div>
                        <p className="text-gray-400 text-[10px]">GPay · PhonePe · Paytm · BHIM</p>
                        <button
                          type="button" onClick={copyUpiId}
                          className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-50 border border-rose-50 rounded-full px-3 py-1.5 transition-all"
                        >
                          {copied
                            ? <Check className="w-3 h-3 text-green-500" />
                            : <Copy className="w-3 h-3" style={{ color: "#ec4899" }} />
                          }
                          <span className="text-[10px] font-medium font-mono" style={{ color: "#ec4899" }}>
                            {copied ? "Copied!" : UPI_ID}
                          </span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Transaction ID */}
            <AnimatePresence>
              {needsTransactionId && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
                      paymentStep === PAYMENT_STEP.RETURNED
                        ? "border-[#ec4899] ring-2 ring-amber-100"
                        : "border-gray-100"
                    }`}
                  >
                    {paymentStep === PAYMENT_STEP.RETURNED && (
                      <p className="text-[11px] font-semibold mb-3 flex items-center gap-1.5" style={{ color: "#ec4899" }}>
                        <Sparkles className="w-3 h-3" /> Paste your transaction ID below
                      </p>
                    )}
                    <h2 className="text-base font-bold text-slate-900 mb-1">Transaction ID</h2>
                    <p className="text-xs text-gray-400 mb-4">
                      {paymentStep === PAYMENT_STEP.RETURNED
                        ? "Open your UPI app → transaction history → copy the 12-digit UTR number."
                        : "Complete payment first, then paste your UPI transaction ID here."}
                    </p>
{/* Per-app format hint */}
                    {form.paymentMethod && UTR_PATTERNS[form.paymentMethod] && (
                      <p className="text-[11px] text-slate-400 font-mono mb-4">
                        Format: {UTR_PATTERNS[form.paymentMethod].hint}
                      </p>
                    )}
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Transaction ID / UTR <span className="text-red-400">*</span>
                    </label>
                    <input
                      ref={txnInputRef}
                      type="text" name="transactionId" value={form.transactionId}
                      onChange={handleChange}
                      placeholder="Paste your UPI transaction ID"
                      className={`${inputBase} ${
                        errors.transactionId
                          ? "border-red-400 bg-red-50"
                          : paymentStep === PAYMENT_STEP.RETURNED
                          ? "border-[#ec4899] focus:ring-amber-100"
                          : ""
                      }`}
                    />
                    {errors.transactionId && (
                      <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit — mobile */}
            <div className="lg:hidden">
              <button
                type="submit" disabled={sending || orderPlaced}
                className="w-full bg-[#ec4899] hover:bg-[#db2777] disabled:opacity-60 text-white py-4 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm"
              >
                {sending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending to WhatsApp…</>
                  : <><MessageCircle className="w-4 h-4" />Place your order</>
                }
              </button>
            </div>
          </div>

          {/* ══ RIGHT COLUMN: Order Summary + QR ══ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-24 space-y-4"
          >
            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-base font-bold text-slate-900 mb-5 text-center">Order Summary</h2>

              {/* Items */}
              <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                {orderItems.map((item, i) => (
                  <div key={i} className="flex gap-3 items-center">
                    <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-gray-800 line-clamp-1 cursor-default"
                        onMouseEnter={(e) => {
                          const r = e.currentTarget.getBoundingClientRect();
                          setTooltip({ visible: true, name: item.name, x: r.left, y: r.top });
                        }}
                        onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                      >
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.selectedWeight} · qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 flex-shrink-0 font-sans">
                      ₹{item.totalPrice.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Portal-style tooltip rendered at fixed position */}
              {tooltip.visible && (
                <div
                  className="fixed z-50 pointer-events-none"
                  style={{ left: tooltip.x, top: tooltip.y - 36 }}
                >
                  <div className="bg-slate-800 text-white text-[11px] font-medium px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap max-w-[220px]">
                    {tooltip.name}
                  </div>
                  <div className="w-2 h-2 bg-slate-800 rotate-45 ml-3 -mt-1" />
                </div>
              )}

              {/* Totals */}
              <div className="border-t border-gray-100 mt-5 pt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Sub Total</span>
                  <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery Charge</span>
                  <span
                    className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}
                    style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}
                  >
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
                {deliveryFee === 0 && (
                  <p className="text-[10px] text-gray-400 text-right">Free delivery on orders above ₹1000</p>
                )}
              </div>

              {/* Submit — desktop */}
              <button
                type="submit" disabled={sending || orderPlaced}
                className="hidden lg:flex w-full mt-5 bg-[#ec4899] hover:bg-[#ec4899] disabled:opacity-60 text-white py-3.5 rounded-full font-semibold items-center justify-center gap-2 transition-all shadow-md active:scale-95 text-sm"
              >
                {sending
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking & placing order…</>
                  : <><MessageCircle className="w-4 h-4" />Place your order</>
                }
              </button>
            </div>

            {/* QR Code — sidebar */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5" style={{ color: "#ec4899" }} />
                  <p className="text-xs font-semibold text-gray-700">
                    Scan &amp; Pay{" "}
                    <span className="font-sans">₹{total.toLocaleString("en-IN")}</span>
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mt-1">
                  <canvas ref={qrSidebarRef} />
                </div>
                <p className="text-gray-400 text-[10px]">GPay · PhonePe · Paytm · BHIM</p>
                <button
                  type="button" onClick={copyUpiId}
                  className="inline-flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 border border-rose-50 rounded-full px-3 py-1.5 transition-all"
                >
                  {copied
                    ? <Check className="w-3 h-3 text-green-500" />
                    : <Copy className="w-3 h-3" style={{ color: "#ec4899" }} />
                  }
                  <span className="text-[10px] font-medium font-mono" style={{ color: "#ec4899" }}>
                    {copied ? "Copied!" : UPI_ID}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};


export default CheckoutPage;