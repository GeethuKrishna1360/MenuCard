import React, { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { X, QrCode, Check, Camera, Users } from "lucide-react";

export default function TableSelectorModal({ isOpen, onClose }) {
  const { activeTable, changeTable, tables } = useRestaurant();
  const [activeTab, setActiveTab] = useState("select"); // 'select' | 'scanner'
  const [scannedFeedback, setScannedFeedback] = useState(null);

  if (!isOpen) return null;

  const handleTablePick = (tableId) => {
    changeTable(tableId);
    onClose();
  };

  const simulateQrScan = (tableId) => {
    setScannedFeedback(`Scanned Table ${tableId} QR successfully! Connecting...`);
    setTimeout(() => {
      changeTable(tableId);
      setScannedFeedback(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#d4af37]/40 bg-[#0d121c] p-4 sm:p-6 shadow-2xl shadow-black/90">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-[#8896ab] transition hover:bg-[#1a2333] hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/50 bg-[#161e2e]">
            <QrCode className="h-6 w-6 text-[#d4af37]" />
          </div>
          <h2 className="font-serif text-xl font-bold text-white">Select Your Dining Table</h2>
          <p className="text-xs text-[#8a9bb2] mt-1">
            Orders placed will be sent directly to the kitchen and manager for this table
          </p>
        </div>

        {/* Tabs: Choose Table vs Simulated Camera Scanner */}
        <div className="flex rounded-xl bg-[#131b28] p-1 border border-[#1f2b40] mb-5">
          <button
            onClick={() => setActiveTab("select")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
              activeTab === "select"
                ? "gold-gradient-bg text-[#0b0e14] font-bold shadow-md"
                : "text-[#8a9bb2] hover:text-white"
            }`}
          >
            Table Number Selector
          </button>
          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              activeTab === "scanner"
                ? "gold-gradient-bg text-[#0b0e14] font-bold shadow-md"
                : "text-[#8a9bb2] hover:text-white"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            Scan Table QR Code
          </button>
        </div>

        {/* Tab 1: Table Grid */}
        {activeTab === "select" && (
          <div className="max-h-72 overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
              {tables.map((t) => {
                const isCurrent = t.id === activeTable;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTablePick(t.id)}
                    className={`group relative flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${
                      isCurrent
                        ? "border-[#d4af37] bg-gradient-to-b from-[#251f0b] to-[#141b28] shadow-lg shadow-[#d4af37]/20"
                        : "border-[#222d3f] bg-[#101622] hover:border-[#3b4c69] hover:bg-[#161f30]"
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4af37] text-black">
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                    )}
                    <span className="font-mono text-lg font-bold text-white group-hover:text-[#f3e5ab]">
                      T-{t.id < 10 ? `0${t.id}` : t.id}
                    </span>
                    <span className="text-[10px] text-[#8696ab] mt-0.5">{t.section}</span>
                    <span className="mt-1 flex items-center gap-1 text-[10px] text-[#637287]">
                      <Users className="h-2.5 w-2.5" /> {t.capacity} Seats
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Simulated Live Scanner View */}
        {activeTab === "scanner" && (
          <div className="space-y-4">
            <div className="relative mx-auto flex h-48 w-full max-w-xs flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#d4af37]/60 bg-[#070a10]">
              {/* Scan target frame */}
              <div className="relative h-32 w-32 rounded-xl border-2 border-[#d4af37] p-2 flex items-center justify-center">
                <div className="absolute -top-1 -left-1 h-3 w-3 border-t-2 border-l-2 border-[#f5df88]"></div>
                <div className="absolute -top-1 -right-1 h-3 w-3 border-t-2 border-r-2 border-[#f5df88]"></div>
                <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-[#f5df88]"></div>
                <div className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-[#f5df88]"></div>
                
                {/* Laser animation line */}
                <div className="h-0.5 w-full bg-red-500 shadow-[0_0_8px_#ff0000] animate-pulse"></div>
              </div>

              <div className="mt-2 text-center">
                <p className="text-[11px] text-[#9aa7bc]">Point camera at the QR Stand on your table</p>
                {scannedFeedback && (
                  <p className="mt-1 text-xs font-bold text-emerald-400 animate-bounce">{scannedFeedback}</p>
                )}
              </div>
            </div>

            {/* Quick Simulation Buttons */}
            <div>
              <p className="text-[11px] font-semibold text-[#8a9bb2] uppercase tracking-wider mb-2 text-center">
                Quick Test Scanning:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[2, 4, 6, 8, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => simulateQrScan(num)}
                    className="rounded-lg border border-[#303f57] bg-[#161f30] px-3 py-1.5 text-xs text-[#dce5f2] transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
                  >
                    Scan Table {num < 10 ? `0${num}` : num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between border-t border-[#1d2738] pt-4 text-xs text-[#7e8da3]">
          <span>Currently ordering for: <strong className="text-white">Table {activeTable}</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#1f293b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#2b3952]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
