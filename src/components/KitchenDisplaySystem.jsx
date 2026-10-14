import React, { useState, useEffect } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Bell, 
  Volume2, 
  VolumeX, 
  Filter, 
  ArrowRight,
  AlertTriangle,
  Utensils
} from "lucide-react";

export default function KitchenDisplaySystem() {
  const { orders, updateOrderStatus, playAlertChime } = useRestaurant();
  const [filterStation, setFilterStation] = useState("all"); // 'all' | 'received' | 'cooking' | 'ready'
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every 10 seconds for ticket timers
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // Filter orders (excluding settled/paid)
  const activeOrders = orders.filter((o) => o.status !== "paid" && o.status !== "cancelled");
  const filteredOrders = activeOrders.filter((order) => {
    if (filterStation === "all") return true;
    return order.status === filterStation;
  });

  // Calculate elapsed minutes
  const getElapsedMinutes = (timestamp) => {
    const elapsedMs = currentTime - new Date(timestamp);
    return Math.max(0, Math.floor(elapsedMs / 60000));
  };

  const handleAdvanceStatus = (orderId, currentStatus) => {
    if (currentStatus === "received") {
      updateOrderStatus(orderId, "cooking");
    } else if (currentStatus === "cooking") {
      updateOrderStatus(orderId, "ready");
    } else if (currentStatus === "ready") {
      updateOrderStatus(orderId, "served");
    }
  };

  return (
    <div className="min-h-screen bg-[#080b10] p-4 text-[#e6ebf2] sm:p-6">
      {/* Top KDS Header */}
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 border-b border-[#1f2838] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/50 bg-gradient-to-br from-amber-950/60 to-black text-amber-400 shadow-lg shadow-amber-500/10">
              <ChefHat className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Kitchen Display System (KDS)
                </h1>
                <span className="flex items-center gap-1 rounded-full bg-emerald-950 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-[#8e9eb5]">
                Mullavanam Line Station • Real-Time Kitchen Order Tickets (KOT)
              </p>
            </div>
          </div>

          {/* Action Controls & Sound Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playAlertChime("ready");
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                soundEnabled
                  ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                  : "border-[#253247] bg-[#141b26] text-stone-400"
              }`}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{soundEnabled ? "Audio Chime ON" : "Muted"}</span>
            </button>

            <button
              onClick={() => playAlertChime("order")}
              className="flex items-center gap-1.5 rounded-xl border border-[#374763] bg-[#162030] px-3 py-2 text-xs font-semibold text-white hover:bg-[#202c42]"
            >
              <Bell className="h-3.5 w-3.5 text-amber-400" />
              <span>Test Chime</span>
            </button>
          </div>
        </div>

        {/* Status Filter Chips */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Active Tickets", count: activeOrders.length },
            { id: "received", label: "New (Received)", count: activeOrders.filter((o) => o.status === "received").length, color: "text-emerald-400" },
            { id: "cooking", label: "In Preparation", count: activeOrders.filter((o) => o.status === "cooking").length, color: "text-amber-400" },
            { id: "ready", label: "Ready for Server", count: activeOrders.filter((o) => o.status === "ready").length, color: "text-blue-400" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStation(tab.id)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition ${
                filterStation === tab.id
                  ? "border-[#d4af37] bg-[#221c0b] text-[#ffd700] shadow-md"
                  : "border-[#202b3d] bg-[#101522] text-[#8e9eb5] hover:border-[#334460] hover:text-white"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`rounded-full bg-black/40 px-2 py-0.5 text-[11px] ${tab.color || "text-white"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tickets Grid */}
        {filteredOrders.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#212d40] bg-[#121824] text-[#61738c]">
              <ChefHat className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-white">All Kitchen Stations Clear!</h3>
            <p className="mt-1 max-w-sm text-xs text-[#8394ad]">
              No active orders in this queue. When guests place orders from their table QR code, tickets will arrive here with sound notification.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => {
              const elapsedMinutes = getElapsedMinutes(order.timestamp);
              const isUrgent = elapsedMinutes >= 15;
              const isWarning = elapsedMinutes >= 8 && elapsedMinutes < 15;

              return (
                <div
                  key={order.id}
                  className={`flex flex-col justify-between rounded-2xl border bg-gradient-to-b from-[#121824] to-[#0c1017] p-5 shadow-xl transition-all ${
                    order.status === "ready"
                      ? "border-blue-500/60 shadow-blue-500/10"
                      : order.status === "cooking"
                      ? "border-amber-500/60 shadow-amber-500/10"
                      : "border-emerald-500/60 shadow-emerald-500/10"
                  } ${isUrgent ? "ring-2 ring-red-500/50" : ""}`}
                >
                  <div>
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between border-b border-[#212c40] pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xl font-black text-white">
                            TABLE {order.table < 10 ? `0${order.table}` : order.table}
                          </span>
                          <span className="rounded bg-[#1c2638] px-2 py-0.5 font-mono text-[11px] font-bold text-[#f5df88]">
                            #{order.id}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-[#8c9cb3]">
                          <span>{order.customerName}</span>
                          <span>•</span>
                          <span>{order.items.reduce((s, it) => s + it.quantity, 0)} Items</span>
                        </div>
                      </div>

                      {/* Elapsed Time Badge */}
                      <div
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${
                          isUrgent
                            ? "bg-red-950 text-red-300 border border-red-500/50 animate-pulse"
                            : isWarning
                            ? "bg-amber-950 text-amber-300 border border-amber-500/50"
                            : "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                        }`}
                      >
                        <Clock className="h-3 w-3" />
                        <span>{elapsedMinutes}m ago</span>
                      </div>
                    </div>

                    {/* Special Preparation Instructions Alert */}
                    {order.specialInstructions && (
                      <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs text-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Special Prep Request:</strong>
                          <span>{order.specialInstructions}</span>
                        </div>
                      </div>
                    )}

                    {/* Checklist of Items */}
                    <div className="my-4 space-y-2.5">
                      {order.items.map((it, idx) => (
                        <div
                          key={idx}
                          className="flex items-start justify-between rounded-lg bg-[#0a0e16] p-2.5 border border-[#1b2536]"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#253347] font-mono text-xs font-bold text-[#ffd700]">
                              {it.quantity}×
                            </span>
                            <div>
                              <p className="text-xs font-bold text-white">{it.name}</p>
                              {it.notes && (
                                <p className="text-[11px] text-amber-300/90 italic">
                                  "{it.notes}"
                                </p>
                              )}
                              {it.spiceLevel && (
                                <p className="text-[10px] text-[#7d90a8]">
                                  Spice: {it.spiceLevel === 1 ? "Mild" : it.spiceLevel === 2 ? "Traditional" : "Fiery"}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advance Kitchen Workflow Button */}
                  <div className="border-t border-[#202c40] pt-3">
                    {order.status === "received" && (
                      <button
                        onClick={() => handleAdvanceStatus(order.id, "received")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 py-2.5 font-bold text-black transition"
                      >
                        <Flame className="h-4 w-4" />
                        <span>START PREPARING (COOKING)</span>
                      </button>
                    )}

                    {order.status === "cooking" && (
                      <button
                        onClick={() => handleAdvanceStatus(order.id, "cooking")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 py-2.5 font-bold text-white transition"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>MARK READY FOR SERVER</span>
                      </button>
                    )}

                    {order.status === "ready" && (
                      <button
                        onClick={() => handleAdvanceStatus(order.id, "ready")}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-bold text-white transition"
                      >
                        <Utensils className="h-4 w-4" />
                        <span>DISPATCHED TO TABLE {order.table}</span>
                      </button>
                    )}

                    {order.status === "served" && (
                      <div className="rounded-lg bg-[#14231b] p-2 text-center text-xs font-semibold text-emerald-400">
                        Food Served • Awaiting Bill Payment
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
