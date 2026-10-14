import React, { useState, useEffect, useRef } from "react";
import { RESTAURANT_INFO } from "../data/menuData";
import { 
  CheckCircle2, 
  Printer, 
  Clock, 
  ChefHat, 
  X, 
  QrCode as QrIcon, 
  Utensils, 
  ArrowRight,
  Share2
} from "lucide-react";
import QRCode from "qrcode";

export default function OrderSuccessModal({ order, isOpen, onClose, onOrderMore }) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const printRef = useRef(null);

  useEffect(() => {
    if (order) {
      // Generate UPI payment / Digital receipt QR code
      const upiUrl = `upi://pay?pa=mullavanam.kochi@okhdfcbank&pn=Mullavanam&am=${order.total}&cu=INR&tn=Bill-${order.id}-Table${order.table}`;
      QRCode.toDataURL(upiUrl, {
        width: 140,
        margin: 1,
        color: {
          dark: "#0b0e14",
          light: "#ffffff",
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusStep = (status) => {
    switch (status) {
      case "received": return 1;
      case "cooking": return 2;
      case "ready": return 3;
      case "served": return 4;
      default: return 1;
    }
  };

  const step = getStatusStep(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto scrollbar-none touch-pan rounded-3xl border border-[#d4af37]/50 bg-[#0d121c] p-4 sm:p-6 shadow-2xl shadow-black/95">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="no-print absolute right-4 top-4 rounded-full p-2 text-[#8e9eb5] hover:bg-[#1a2333] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Celebration Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/50 bg-emerald-950/60 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <span className="rounded-full border border-[#d4af37]/40 bg-[#211a09] px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#ffd700]">
            Order #{order.id} Confirmed
          </span>
          <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-3xl">
            Sent to Kitchen & Floor Manager!
          </h2>
          <p className="mt-1 text-xs text-[#8e9eb5]">
            Table <strong className="text-white">{order.table}</strong> • Est. Preparation Time: 15–20 Mins
          </p>
        </div>

        {/* Live Order Progress Stepper */}
        <div className="no-print mt-6 rounded-2xl border border-[#212d40] bg-[#101622] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#7e8fa8] mb-3">
            Real-Time Kitchen Status:
          </p>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            {/* Step 1 */}
            <div className={`flex flex-col items-center ${step >= 1 ? "text-emerald-400 font-semibold" : "text-[#556782]"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border mb-1.5 transition ${
                step >= 1 ? "border-emerald-400 bg-emerald-950 text-emerald-300" : "border-[#303f57] bg-[#161e2b]"
              }`}>
                🛎️
              </div>
              <span>Received</span>
            </div>

            {/* Step 2 */}
            <div className={`flex flex-col items-center ${step >= 2 ? "text-amber-400 font-semibold" : "text-[#556782]"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border mb-1.5 transition ${
                step >= 2 ? "border-amber-400 bg-amber-950 text-amber-300" : "border-[#303f57] bg-[#161e2b]"
              }`}>
                👨‍🍳
              </div>
              <span>Cooking</span>
            </div>

            {/* Step 3 */}
            <div className={`flex flex-col items-center ${step >= 3 ? "text-blue-400 font-semibold" : "text-[#556782]"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border mb-1.5 transition ${
                step >= 3 ? "border-blue-400 bg-blue-950 text-blue-300" : "border-[#303f57] bg-[#161e2b]"
              }`}>
                🌿
              </div>
              <span>Plating</span>
            </div>

            {/* Step 4 */}
            <div className={`flex flex-col items-center ${step >= 4 ? "text-purple-400 font-semibold" : "text-[#556782]"}`}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border mb-1.5 transition ${
                step >= 4 ? "border-purple-400 bg-purple-950 text-purple-300" : "border-[#303f57] bg-[#161e2b]"
              }`}>
                🍽️
              </div>
              <span>Served</span>
            </div>
          </div>
        </div>

        {/* Printable Official Digital Tax Bill / Invoice */}
        <div 
          ref={printRef}
          className="mt-6 rounded-2xl border border-[#2b3a52] bg-white p-5 text-black shadow-lg"
        >
          {/* Bill Top Header */}
          <div className="border-b border-stone-200 pb-3 text-center">
            <h3 className="font-serif text-lg font-bold tracking-tight text-stone-900">
              MULLAVANAM (മുല്ലവനം)
            </h3>
            <p className="text-[11px] text-stone-600">
              Maradu, Kochi - 682304
            </p>
            <p className="text-[10px] text-stone-500">
              GSTIN: {RESTAURANT_INFO.gstin} | FSSAI: {RESTAURANT_INFO.fssai}
            </p>
            <div className="mt-2 flex items-center justify-between border-t border-dashed border-stone-300 pt-2 text-[11px] text-stone-700">
              <span>Token: <strong>#{order.id}</strong></span>
              <span>Table: <strong>TABLE {order.table}</strong></span>
              <span>{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="my-3 space-y-2 text-xs">
            <div className="flex justify-between border-b border-stone-200 pb-1 font-bold text-stone-700 text-[11px]">
              <span className="w-1/2">Item Description</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-16 text-right">Rate</span>
              <span className="w-16 text-right">Amount</span>
            </div>

            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-stone-800 text-[11px]">
                <div className="w-1/2 pr-1">
                  <div className="font-medium">{it.name}</div>
                  {it.notes && (
                    <div className="text-[9px] text-stone-500 italic">"{it.notes}"</div>
                  )}
                </div>
                <div className="w-12 text-center font-mono">{it.quantity}</div>
                <div className="w-16 text-right font-mono">₹{it.price}</div>
                <div className="w-16 text-right font-mono font-semibold">₹{it.price * it.quantity}</div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown */}
          <div className="border-t border-dashed border-stone-300 pt-2 space-y-1 text-xs text-stone-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono">₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST (2.5%)</span>
              <span className="font-mono">₹{order.cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST (2.5%)</span>
              <span className="font-mono">₹{order.sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Charge (5%)</span>
              <span className="font-mono">₹{order.serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t-2 border-stone-800 pt-1.5 text-sm font-bold text-stone-900">
              <span>NET PAYABLE AMOUNT</span>
              <span className="font-mono text-base">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Bottom QR Code for instant UPI payment */}
          <div className="mt-4 flex items-center justify-between border-t border-stone-200 pt-3">
            <div className="text-[10px] text-stone-600">
              <p className="font-semibold text-stone-800">Scan & Pay via UPI:</p>
              <p>Google Pay / PhonePe / Paytm</p>
              <p className="mt-1 font-mono text-[9px] text-stone-500">UPI ID: mullavanam.kochi@okhdfcbank</p>
            </div>
            {qrDataUrl && (
              <img src={qrDataUrl} alt="UPI QR Code" className="h-16 w-16 rounded border border-stone-300" />
            )}
          </div>
          <p className="mt-2 text-center text-[10px] italic text-stone-500">
            Thank you for dining at Mullavanam!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#3b4b66] bg-[#161f2e] py-3 text-xs font-semibold text-white hover:bg-[#202b3d] transition"
          >
            <Printer className="h-4 w-4" />
            Print / Save Receipt
          </button>

          <button
            onClick={() => {
              onClose();
              if (onOrderMore) onOrderMore();
            }}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl gold-gradient-bg py-3 text-xs font-bold text-black hover:brightness-110 transition"
          >
            <Utensils className="h-4 w-4" />
            Order More Dishes
          </button>
        </div>
      </div>
    </div>
  );
}
