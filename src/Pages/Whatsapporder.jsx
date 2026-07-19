import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, MessageCircle, ChevronDown, Loader2,
  CheckCircle2, Package, Upload, QrCode, Trash2, ChevronUp,
  Smartphone, Copy, Check, ArrowLeft, Sparkles
} from "lucide-react";
import QRCode from "qrcode";

const BAKERY_WHATSAPP = "9094860563";
const DELIVERY_CHARGE = 50;
const UPI_ID = "bakery@upi";
const BAKERY_NAME = "Crave Bakery";

const UPI_APPS = [
  {
    name: "GPay",
    scheme: (p) => `tez://upi/pay?${p}`,
    fallback: "https://pay.google.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png",
  },
  {
    name: "PhonePe",
    scheme: (p) => `phonepe://pay?${p}`,
    fallback: "https://www.phonepe.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png",
  },
  {
    name: "Paytm",
    scheme: (p) => `paytmmp://pay?${p}`,
    fallback: "https://paytm.com/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png",
  },
  {
    name: "BHIM",
    scheme: (p) => `bhim://pay?${p}`,
    fallback: "https://www.bhimupi.org.in/",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/BHIM_SVG_logo.svg/512px-BHIM_SVG_logo.svg.png",
  },
];

// Payment steps for the UPI flow
const PAYMENT_STEP = { IDLE: "idle", PAYING: "paying", RETURNED: "returned" };

export default function WhatsAppOrderModal({
  product,
  products,
  total,
  subtotal,
  deliveryFee,
  onClose,
}) {
  const isBulkOrder = products && products.length > 0;
  const qrCanvasRef = useRef(null);
  const qrCanvasRefDesktop = useRef(null);
  const txnInputRef = useRef(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentStep, setPaymentStep] = useState(PAYMENT_STEP.IDLE);
  const [payingApp, setPayingApp] = useState(null);
  const didReturnRef = useRef(false);

  const orderSubtotal = isBulkOrder
    ? subtotal
    : (product?.unitPrice || 0) * (product?.quantity || 1);
  const orderDelivery = isBulkOrder ? (deliveryFee ?? DELIVERY_CHARGE) : DELIVERY_CHARGE;
  const orderTotal = isBulkOrder ? total : orderSubtotal + orderDelivery;

  const upiParams = `pa=${UPI_ID}&pn=${encodeURIComponent(BAKERY_NAME)}&am=${orderTotal}&cu=INR`;
  const upiIntentUrl = `upi://pay?${upiParams}`;

  const [form, setForm] = useState({
    name: "", phone: "", email: "",
    address: "", deliveryDate: "",
    specialInstructions: "", paymentMethod: "", transactionId: "",
  });
  const [errors, setErrors] = useState({});
  const [screenshot, setScreenshot] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const needsTransactionId = ["UPI", "Card Payment", "Bank Transfer"].includes(form.paymentMethod);

  const minDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  })();

  // ── Draw QR on both canvases ──
  const drawQr = useCallback(() => {
    [qrCanvasRef, qrCanvasRefDesktop].forEach((ref) => {
      if (!ref.current) return;
      QRCode.toCanvas(ref.current, upiIntentUrl, {
        width: 148, margin: 1,
        color: { dark: "#1a0a05", light: "#00000000" },
      }).catch(() => {});
    });
  }, [upiIntentUrl]);

  useEffect(() => { drawQr(); }, [drawQr, summaryOpen]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Detect return from UPI app ──
  useEffect(() => {
    if (paymentStep !== PAYMENT_STEP.PAYING) return;

    const onVisible = () => {
      if (document.visibilityState === "visible" && !didReturnRef.current) {
        didReturnRef.current = true;
        setTimeout(() => {
          setPaymentStep(PAYMENT_STEP.RETURNED);
          // Auto-set payment method to UPI and scroll to txn field
          setForm((p) => ({ ...p, paymentMethod: "UPI" }));
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

  const handleScreenshot = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot({ file, preview: URL.createObjectURL(file) });
  };
  const removeScreenshot = () => {
    if (screenshot?.preview) URL.revokeObjectURL(screenshot.preview);
    setScreenshot(null);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openUpiApp = (app) => {
    setPayingApp(app.name);
    setPaymentStep(PAYMENT_STEP.PAYING);
    didReturnRef.current = false;
    window.location.href = app.scheme(upiParams);
    // Fallback: if app not installed, open website
    setTimeout(() => {
      if (document.visibilityState === "visible") {
        window.open(app.fallback, "_blank");
      }
    }, 1800);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    else if (!/^\+?[\d\s-]{8,15}$/.test(form.phone.trim())) e.phone = "Enter a valid phone number";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Delivery address is required";
    if (!form.deliveryDate) e.deliveryDate = "Delivery date is required";
    if (!form.paymentMethod) e.paymentMethod = "Please select a payment method";
    if (needsTransactionId && !form.transactionId.trim()) e.transactionId = "Transaction ID is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const buildMessage = () => {
    const now = new Date().toLocaleString("en-IN");
    let itemLines = [];
    if (isBulkOrder) {
      itemLines = products.map((item, i) =>
        `${i + 1}. ${item.name} (${item.selectedWeight})\n   Qty: ${item.quantity} x Rs.${item.unitPrice} = Rs.${item.totalPrice}`
      );
    } else {
      itemLines = [
        `Product: ${product.name}`,
        `Weight: ${product.selectedWeight}`,
        `Qty: ${product.quantity} x Rs.${product.unitPrice} = Rs.${product.totalPrice}`,
      ];
    }
    const lines = [
      `NEW ORDER - ${BAKERY_NAME}`, ``,
      `Customer:`,
      `Name: ${form.name}`, `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null, ``,
      `Order Details:`, ...itemLines, ``,
      `Subtotal: Rs.${orderSubtotal.toLocaleString("en-IN")}`,
      `Delivery: Rs.${orderDelivery}`,
      `Total: Rs.${orderTotal.toLocaleString("en-IN")}`, ``,
      `Delivery Date: ${new Date(form.deliveryDate).toLocaleDateString("en-IN", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      })}`,
      `Address: ${form.address}`, ``,
      `Payment: ${form.paymentMethod}`,
      needsTransactionId ? `Transaction ID: ${form.transactionId}` : null,
      screenshot ? `Payment screenshot: [attached]` : null, ``,
      form.specialInstructions ? `Notes: ${form.specialInstructions}\n` : null,
      `---`, `Order placed via website on ${now}`,
    ].filter(Boolean);
    return encodeURIComponent(lines.join("\n"));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      window.open(`https://wa.me/${BAKERY_WHATSAPP}?text=${buildMessage()}`, "_blank");
      setTimeout(onClose, 2500);
    }, 1200);
  };

  const inputBase =
    "w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 placeholder:text-slate-400 text-slate-700 bg-white transition-colors";
  const inputError = "border-red-400 bg-red-50";
  const inputNormal = "border-gray-300";

  // ── Reusable: 4-app grid ──
  const UpiAppButtons = ({ light = false }) => (
    <div className="grid grid-cols-4 gap-2">
      {UPI_APPS.map((app) => (
        <button
          key={app.name}
          type="button"
          onClick={() => openUpiApp(app)}
          className={`flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all active:scale-95 border
            ${light
              ? "bg-white hover:bg-violet-50 border-violet-100 shadow-sm"
              : "bg-white/10 hover:bg-white/20 border-white/10"
            }`}
        >
          <img
            src={app.logo}
            alt={app.name}
            className="w-8 h-8 object-contain rounded-lg"
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <span className={`text-[10px] font-medium leading-none ${light ? "text-slate-600" : "text-white/70"}`}>
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );

  // ── Reusable: QR block (dark bg) ──
  const QrBlock = ({ canvasRef, compact = false }) => (
    <div className={`bg-white/10 border border-white/20 rounded-xl
      ${compact ? "p-3 flex items-center gap-4" : "p-4 flex flex-col items-center gap-3"}`}>
      <div className="bg-white rounded-xl p-2 flex-shrink-0 shadow-md">
        <canvas ref={canvasRef} />
      </div>
      <div className={compact ? "min-w-0 flex-1" : "text-center w-full"}>
        <p className={`text-white/50 text-[10px] mb-2 flex items-center gap-1 ${compact ? "" : "justify-center"}`}>
          <QrCode className="w-3 h-3" /> Scan to pay Rs.{orderTotal.toLocaleString("en-IN")}
        </p>
        <p className={`text-white/40 text-[10px] mb-2 ${compact ? "" : "text-center"}`}>
          GPay · PhonePe · Paytm · BHIM
        </p>
        <button
          type="button"
          onClick={copyUpiId}
          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 rounded-lg px-2.5 py-1.5 transition-all"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-white/60" />}
          <span className="text-white/70 text-[10px] font-medium font-mono">
            {copied ? "Copied!" : UPI_ID}
          </span>
        </button>
      </div>
    </div>
  );

  // ── "Paying..." overlay — shown while user is in UPI app ──
  const PayingOverlay = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full bg-violet-100 animate-ping opacity-40" />
        <div className="relative w-20 h-20 bg-violet-50 rounded-full flex items-center justify-center">
          <Smartphone className="w-8 h-8 text-violet-500" />
        </div>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-800">Opening {payingApp}...</h3>
        <p className="text-gray-400 text-sm mt-1">Complete your payment of</p>
        <p className="text-2xl font-bold text-violet-600 mt-1" style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}>
          Rs.{orderTotal.toLocaleString("en-IN")}
        </p>
      </div>
      <p className="text-gray-400 text-xs max-w-[220px] leading-relaxed">
        After paying, come back here to fill in your details and place the order.
      </p>
      <button
        type="button"
        onClick={() => {
          setPaymentStep(PAYMENT_STEP.RETURNED);
          setForm((p) => ({ ...p, paymentMethod: "UPI" }));
          setTimeout(() => {
            txnInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            txnInputRef.current?.focus();
          }, 400);
        }}
        className="mt-2 flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-800 bg-violet-50 hover:bg-violet-100 px-4 py-2.5 rounded-full transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> I've paid, fill details now
      </button>
    </div>
  );

  // ── "Welcome back" banner shown after returning ──
  const ReturnedBanner = () => (
    <div className="mx-4 sm:mx-6 mt-4 bg-green-50 border border-green-200 rounded-xl p-3.5 flex items-start gap-3">
      <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-green-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-green-800">Payment done? Great!</p>
        <p className="text-xs text-green-600 mt-0.5">
          Fill in your details below and paste your transaction ID to complete the order.
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div className="
        relative z-10 flex flex-col
        w-full max-h-[96vh] rounded-t-2xl
        sm:max-w-4xl sm:max-h-[90vh] sm:rounded-2xl sm:mx-4
        bg-white shadow-2xl overflow-hidden
        md:flex-row
      ">

        {/* ══ MOBILE: top bar + accordion ══ */}
        <div className="md:hidden flex-shrink-0 bg-[#3a1d10]">
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-10 h-1 bg-white/30 rounded-full" />
          </div>

          <button
            type="button"
            onClick={() => setSummaryOpen((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-3 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/15 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
                {isBulkOrder
                  ? <Package className="w-4 h-4 text-white/80" />
                  : <img src={product?.image} alt="" className="w-8 h-8 object-cover" />
                }
              </div>
              <div className="text-left">
                <p className="text-[11px] text-white/60 leading-none">
                  {isBulkOrder ? `${products.length} items` : product?.name}
                </p>
                <p className="text-sm font-bold text-white mt-0.5" style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}>
                  Rs.{orderTotal.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-white/40">{summaryOpen ? "Hide" : "Summary & Pay"}</span>
              {summaryOpen ? <ChevronUp className="w-4 h-4 text-white/50" /> : <ChevronDown className="w-4 h-4 text-white/50" />}
            </div>
          </button>

          {summaryOpen && (
            <div className="px-4 pb-4 space-y-3 max-h-[55vh] overflow-y-auto">
              {/* Items */}
              {isBulkOrder ? (
                <div className="space-y-2">
                  {products.map((item, i) => (
                    <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-2.5 flex gap-2.5">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white text-xs line-clamp-1">{item.name}</p>
                        <p className="text-white/50 text-[11px] mt-0.5">{item.selectedWeight} x {item.quantity}</p>
                        <p className="text-white/90 text-sm font-semibold" style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}>Rs.{item.totalPrice}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-3 items-center bg-white/8 border border-white/10 rounded-xl p-2.5">
                  <img src={product?.image} alt={product?.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium text-sm line-clamp-2">{product?.name}</p>
                    <p className="text-white/50 text-xs mt-0.5">{product?.selectedWeight} x {product?.quantity}</p>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="border-t border-white/10 pt-3 space-y-1.5">
                <div className="flex justify-between text-white/60 text-xs">
                  <span>Subtotal</span>
                  <span style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}>₹{orderSubtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-white/60 text-xs">
                  <span>Delivery</span>
                  <span style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}>₹{orderDelivery}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-1.5 border-t border-white/10">
                  <span>Total</span>
                  <span style={{ fontFamily: "Segoe UI, Roboto, sans-serif" }}>₹{orderTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Pay section */}
              <div className="space-y-2.5">
                <p className="text-white/60 text-[10px] flex items-center gap-1.5">
                  <Smartphone className="w-3 h-3" /> Pay Rs.{orderTotal.toLocaleString("en-IN")} now
                </p>
                <UpiAppButtons light={false} />
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-white/30 text-[10px]">or scan QR</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>
                <QrBlock canvasRef={qrCanvasRef} compact={true} />
              </div>
            </div>
          )}
        </div>

        {/* ══ DESKTOP LEFT PANEL ══ */}
        <div className="hidden md:flex md:w-2/5 bg-[#3a1d10] p-6 overflow-y-auto flex-shrink-0 flex-col gap-5">
          <h3 className="text-base font-semibold text-white/90 tracking-wide text-center">Order Summary</h3>

          {isBulkOrder ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white/60 text-xs">
                <Package className="w-4 h-4" />
                <span>{products.length} items in cart</span>
              </div>
              {products.map((item, i) => (
                <div key={i} className="bg-white/8 border border-white/10 rounded-xl p-3 flex gap-3">
                  <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white text-xs leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-white/50 text-xs mt-1">{item.selectedWeight} x {item.quantity}</p>
                    <p className="text-white/90 text-sm font-semibold mt-1" style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{item.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-white/10">
                <img src={product?.image} alt={product?.name} className="w-full h-44 object-cover" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-base leading-snug">{product?.name}</h4>
                <p className="text-white/50 text-xs mt-1">{product?.selectedWeight} x {product?.quantity}</p>
              </div>
            </div>
          )}

          <div className="border-t border-white/10 pt-4 space-y-2">
            <div className="flex justify-between text-white/60 text-xs">
              <span>Subtotal</span>
              <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{orderSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-white/60 text-xs">
              <span>Delivery</span>
              <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{orderDelivery}</span>
            </div>
            <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-white/10">
              <span>Total</span>
              <span style={{ fontFamily: "Segoe UI, Roboto, Arial, sans-serif" }}>₹{orderTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <p className="text-white/60 text-xs flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5" /> Pay with UPI
            </p>
            <UpiAppButtons light={false} />
            <div className="flex items-center gap-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/30 text-[10px]">or scan QR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <QrBlock canvasRef={qrCanvasRefDesktop} compact={false} />
          </div>
        </div>

        {/* ══ FORM PANEL ══ */}
        <div className="flex-1 overflow-y-auto bg-white flex flex-col min-h-0">

          {/* Header */}
          <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-rose-50 rounded-full flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">Place Your Order</h3>
                <p className="text-gray-400 text-[11px] sm:text-xs">We'll confirm via WhatsApp</p>
              </div>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">Order Sent!</h3>
              <p className="text-gray-400 text-sm">Redirecting you to WhatsApp...</p>
            </div>

          /* Paying state — user switched to UPI app */
          ) : paymentStep === PAYMENT_STEP.PAYING ? (
            <PayingOverlay />

          /* Normal / Returned state */
          ) : (
            <>
              {paymentStep === PAYMENT_STEP.RETURNED && <ReturnedBanner />}
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 sm:space-y-7">

                {/* Section 1 — Customer */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
                    <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wide">Customer Details</h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Your full name"
                        className={`${inputBase} ${errors.name ? inputError : inputNormal}`} />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-400">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={`${inputBase} ${errors.phone ? inputError : inputNormal}`} />
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                  <div className="mt-2.5 sm:mt-3">
                    <label className="block text-xs font-medium text-slate-700 mb-1.5">Email <span className="text-slate-400 font-normal">(optional)</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="your@email.com"
                      className={`${inputBase} ${errors.email ? inputError : inputNormal}`} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Section 2 — Delivery */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
                    <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wide">Delivery Details</h4>
                  </div>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Delivery Address <span className="text-red-400">*</span></label>
                      <textarea name="address" value={form.address} onChange={handleChange}
                        rows={3} placeholder="Full address with pincode"
                        className={`${inputBase} resize-none ${errors.address ? inputError : inputNormal}`} />
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Delivery Date <span className="text-red-400">*</span></label>
                      <input type="date" name="deliveryDate" value={form.deliveryDate}
                        onChange={handleChange} min={minDate}
                        className={`${inputBase} ${errors.deliveryDate ? inputError : inputNormal}`} />
                      {errors.deliveryDate && <p className="text-red-400 text-xs mt-1">{errors.deliveryDate}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Special Instructions <span className="text-slate-400 font-normal">(optional)</span></label>
                      <textarea name="specialInstructions" value={form.specialInstructions}
                        onChange={handleChange} rows={2}
                        placeholder="Eggless, less sugar, cake message, etc."
                        className={`${inputBase} resize-none ${inputNormal}`} />
                    </div>
                  </div>
                </div>

                {/* Section 3 — Payment */}
                <div>
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
                    <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wide">Payment</h4>
                  </div>
                  <div className="space-y-2.5 sm:space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">Payment Method <span className="text-red-400">*</span></label>
                      <div className="relative">
                        <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}
                          className={`${inputBase} appearance-none pr-9 ${errors.paymentMethod ? inputError : inputNormal}`}>
                          <option value="">Choose payment method...</option>
                          <option value="Cash on Delivery">Cash on Delivery</option>
                          <option value="UPI">UPI</option>
                          <option value="Card Payment">Card Payment</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                      </div>
                      {errors.paymentMethod && <p className="text-red-400 text-xs mt-1">{errors.paymentMethod}</p>}
                    </div>

                    {/* UPI quick-pay card */}
                    {form.paymentMethod === "UPI" && paymentStep === PAYMENT_STEP.IDLE && (
                      <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3.5 space-y-3">
                        <p className="text-xs font-medium text-violet-700 flex items-center gap-1.5">
                          <Smartphone className="w-3.5 h-3.5" />
                          Tap to pay Rs.{orderTotal.toLocaleString("en-IN")} instantly
                        </p>
                        <UpiAppButtons light={true} />
                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-xs text-slate-500">
                            UPI: <span className="font-mono font-medium text-slate-700">{UPI_ID}</span>
                          </span>
                          <button type="button" onClick={copyUpiId}
                            className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors">
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            {copied ? "Copied!" : "Copy ID"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Transaction ID — highlighted when returned */}
                    {needsTransactionId && (
                      <div className={`rounded-xl transition-all ${paymentStep === PAYMENT_STEP.RETURNED ? "ring-2 ring-violet-300 bg-violet-50/40 p-3" : ""}`}>
                        {paymentStep === PAYMENT_STEP.RETURNED && (
                          <p className="text-[11px] font-semibold text-violet-700 mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" /> Paste your transaction ID below
                          </p>
                        )}
                        <label className="block text-xs font-medium text-slate-700 mb-1.5">
                          Transaction ID / UTR <span className="text-red-400">*</span>
                        </label>
                        <input
                          ref={txnInputRef}
                          type="text" name="transactionId" value={form.transactionId}
                          onChange={handleChange} placeholder="Paste your UPI transaction ID"
                          className={`${inputBase} ${errors.transactionId ? inputError : paymentStep === PAYMENT_STEP.RETURNED ? "border-violet-300 focus:ring-violet-200 focus:border-violet-400" : inputNormal}`}
                        />
                        <p className="text-gray-400 text-xs mt-1.5">
                          {paymentStep === PAYMENT_STEP.RETURNED
                            ? "Open your UPI app → transaction history → copy the 12-digit UTR number."
                            : "Complete payment first, then paste the transaction ID here."}
                        </p>
                        {errors.transactionId && <p className="text-red-400 text-xs mt-1">{errors.transactionId}</p>}
                      </div>
                    )}

                    {/* Screenshot */}
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1.5">
                        Payment Screenshot <span className="text-slate-400 font-normal">(optional)</span>
                      </label>
                      {!screenshot ? (
                        <label className="flex flex-col items-center justify-center w-full h-24 sm:h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50/30 transition-all group">
                          <Upload className="w-5 h-5 text-gray-300 group-hover:text-pink-400 transition mb-1.5" />
                          <p className="text-xs text-gray-400 group-hover:text-pink-500 transition">Tap to upload screenshot</p>
                          <p className="text-[10px] text-gray-300 mt-1">PNG, JPG up to 5MB</p>
                          <input type="file" accept="image/*" className="hidden" onChange={handleScreenshot} />
                        </label>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200">
                          <img src={screenshot.preview} alt="Payment screenshot" className="w-full h-36 sm:h-40 object-cover" />
                          <button type="button" onClick={removeScreenshot}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition shadow-md">
                            <Trash2 size={13} />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-3 py-1.5">
                            <p className="text-white text-[10px] truncate">{screenshot.file.name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="space-y-2 pt-1">
                  <button type="submit" disabled={sending}
                    className="w-full bg-[#25D366] hover:bg-[#1eb358] active:bg-[#17a24d] disabled:opacity-60 text-white py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:scale-[1.01] disabled:hover:scale-100">
                    {sending
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending to WhatsApp...</>
                      : <><MessageCircle className="w-4 h-4" /> Send Order via WhatsApp</>}
                  </button>
                  <button type="button" onClick={onClose}
                    className="w-full py-3 border border-gray-200 rounded-full text-sm text-slate-600 font-medium hover:border-gray-400 hover:text-gray-700 active:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}