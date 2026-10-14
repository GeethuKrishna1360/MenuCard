import React, { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { RESTAURANT_INFO } from "../data/menuData";
import { 
  ShoppingBag, 
  QrCode, 
  ChefHat, 
  LayoutDashboard, 
  UtensilsCrossed, 
  Printer, 
  MapPin, 
  Phone,
  ChevronDown
} from "lucide-react";

export default function Navbar({ onOpenCart, onOpenTableSelector }) {
  const { 
    activeTable, 
    activeView, 
    setActiveView, 
    getCartTotals, 
    orders,
    currentTableOrders 
  } = useRestaurant();
  
  const totals = getCartTotals();
  const activeOrdersCount = orders.filter(o => o.status !== "paid" && o.status !== "cancelled").length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#242e42] bg-[#0b0e14]/95 backdrop-blur-md">
      {/* Top Heritage Bar */}
      <div className="hidden border-b border-[#1b2333] px-4 py-1.5 text-xs text-[#9aa7bc] sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[#d4af37]">
            <span className="font-medium tracking-wide">AUTHENTIC KERALA FINE DINING</span>
          </span>
          <span className="text-[#3b485e]">•</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#7988a2]" />
            Maradu, Kochi
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-[#d4af37]" />
            {RESTAURANT_INFO.phone.split("/")[0]}
          </span>
          <span className="rounded bg-[#1b263b] px-2 py-0.5 text-[11px] text-[#e2be67]">
            FSSAI: {RESTAURANT_INFO.fssai}
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-2.5 py-2.5 sm:px-6 sm:py-3">
        {/* Brand & Emblem */}
        <div 
          onClick={() => setActiveView("customer")}
          className="flex cursor-pointer items-center gap-2 sm:gap-3 select-none min-w-0"
        >
          <div className="relative flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border border-[#d4af37]/60 bg-gradient-to-br from-[#1c2433] to-[#0a0d14] shadow-md shadow-[#d4af37]/10">
            <span className="font-brand text-sm sm:text-lg font-bold text-[#eac266]">MV</span>
            <div className="absolute -bottom-1 -right-1 rounded-full bg-[#d4af37] p-0.5">
              <ChefHat className="h-2 w-2 sm:h-2.5 sm:w-2.5 text-[#0b0e14]" />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-serif text-base font-bold tracking-tight text-white sm:text-xl truncate">
                Mullavanam
              </h1>
              <span className="hidden sm:inline-block gold-gradient-text font-serif text-sm font-normal">
                മുല്ലവനം
              </span>
              <span className="hidden md:inline-block rounded-full border border-[#d4af37]/40 bg-[#d4af37]/10 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-[#f5df88]">
                KOCHI
              </span>
            </div>
            <p className="hidden xs:block text-[10px] sm:text-[11px] tracking-wide text-[#8a9bb2] truncate">
              Kerala Heritage & Coastal Dining
            </p>
          </div>
        </div>

        {/* View Switcher Tabs (Guest / Kitchen KDS / Manager / QR Stands) */}
        <div className="hidden lg:flex items-center rounded-xl border border-[#232f45] bg-[#101622] p-1 shadow-inner shrink-0">
          <button
            onClick={() => setActiveView("customer")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === "customer"
                ? "gold-gradient-bg text-[#0e121a] shadow-sm font-bold"
                : "text-[#97a6be] hover:text-white"
            }`}
          >
            <UtensilsCrossed className="h-3.5 w-3.5" />
            Guest Menu
          </button>
          
          <button
            onClick={() => setActiveView("kds")}
            className={`relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === "kds"
                ? "gold-gradient-bg text-[#0e121a] shadow-sm font-bold"
                : "text-[#97a6be] hover:text-white"
            }`}
          >
            <ChefHat className="h-3.5 w-3.5" />
            Kitchen KDS
            {activeOrdersCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white animate-pulse">
                {activeOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView("manager")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === "manager"
                ? "gold-gradient-bg text-[#0e121a] shadow-sm font-bold"
                : "text-[#97a6be] hover:text-white"
            }`}
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Manager Floor
          </button>

          <button
            onClick={() => setActiveView("qr_stands")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeView === "qr_stands"
                ? "gold-gradient-bg text-[#0e121a] shadow-sm font-bold"
                : "text-[#97a6be] hover:text-white"
            }`}
          >
            <Printer className="h-3.5 w-3.5" />
            QR Table Stands
          </button>
        </div>

        {/* Right Action Controls: Table Selector & Cart Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Table Selector Pill */}
          <button
            onClick={onOpenTableSelector}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-[#d4af37]/40 bg-[#161d2a] px-2 py-1.5 text-xs font-medium text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#1c2536] sm:px-3 sm:py-2"
            title="Change Dining Table"
          >
            <QrCode className="h-3.5 w-3.5 text-[#d4af37]" />
            <span className="font-semibold text-white hidden sm:inline">
              Table {activeTable < 10 ? `0${activeTable}` : activeTable}
            </span>
            <span className="font-semibold text-white sm:hidden font-mono text-[11px]">
              T-{activeTable < 10 ? `0${activeTable}` : activeTable}
            </span>
            <ChevronDown className="h-3 w-3 text-[#9aa7bc]" />
          </button>

          {/* Cart Floating / Action Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#d4af37]/50 bg-gradient-to-r from-[#1c2436] to-[#121927] px-2.5 py-1.5 text-xs font-medium text-white shadow-lg shadow-[#0b0e14]/50 transition hover:border-[#d4af37] hover:from-[#232d42] sm:px-4 sm:py-2"
          >
            <div className="relative">
              <ShoppingBag className="h-4 w-4 text-[#e2be67]" />
              {totals.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-md animate-bounce">
                  {totals.itemCount}
                </span>
              )}
            </div>
            <div className="flex flex-col text-left">
              <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-[#9aa7bc]">Live Bill</span>
              <span className="font-bold text-[#f5df88] text-xs sm:text-xs">₹{totals.grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Views Switcher Subnav */}
      <div className="flex lg:hidden overflow-x-auto scrollbar-none touch-pan border-t border-[#1c2433] bg-[#0c1017] px-2 py-1.5 text-xs gap-1">
        <button
          onClick={() => setActiveView("customer")}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${
            activeView === "customer" ? "bg-[#d4af37] text-black font-bold" : "text-[#97a6be]"
          }`}
        >
          <UtensilsCrossed className="h-3 w-3" /> Menu
        </button>
        <button
          onClick={() => setActiveView("kds")}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ml-1 ${
            activeView === "kds" ? "bg-[#d4af37] text-black font-bold" : "text-[#97a6be]"
          }`}
        >
          <ChefHat className="h-3 w-3" /> Kitchen ({activeOrdersCount})
        </button>
        <button
          onClick={() => setActiveView("manager")}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ml-1 ${
            activeView === "manager" ? "bg-[#d4af37] text-black font-bold" : "text-[#97a6be]"
          }`}
        >
          <LayoutDashboard className="h-3 w-3" /> Floor
        </button>
        <button
          onClick={() => setActiveView("qr_stands")}
          className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ml-1 ${
            activeView === "qr_stands" ? "bg-[#d4af37] text-black font-bold" : "text-[#97a6be]"
          }`}
        >
          <Printer className="h-3 w-3" /> QR Stands
        </button>
      </div>

      {/* Notification banner if current table has an active cooking order */}
      {currentTableOrders.length > 0 && activeView === "customer" && (
        <div className="bg-gradient-to-r from-[#173023] via-[#10241b] to-[#173023] border-b border-[#2a593e] px-4 py-2 text-xs flex items-center justify-between text-[#8ce2b6]">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              Order <strong>#{currentTableOrders[0].id}</strong> is currently{" "}
              <strong className="uppercase text-emerald-300">{currentTableOrders[0].status}</strong> in the kitchen!
            </span>
          </div>
          <button 
            onClick={onOpenCart} 
            className="text-white underline font-semibold text-[11px] hover:text-emerald-200"
          >
            Track Order & Bill →
          </button>
        </div>
      )}
    </header>
  );
}
