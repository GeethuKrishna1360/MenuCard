import React, { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { MENU_ITEMS, RESTAURANT_INFO } from "../data/menuData";
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  DollarSign, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Search, 
  Printer, 
  CheckCircle2, 
  Flame, 
  Eye, 
  ShieldAlert, 
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import OrderSuccessModal from "./OrderSuccessModal";

export default function ManagerDashboard() {
  const { 
    orders, 
    tables, 
    updateOrderStatus, 
    outOfStock, 
    toggleStock 
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState("floor"); // 'floor' | 'orders' | 'menu_stock'
  const [selectedOrderForBill, setSelectedOrderForBill] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "cancelled" ? o.total : 0), 0);
  const activeOrders = orders.filter((o) => o.status !== "paid" && o.status !== "cancelled");
  const completedOrders = orders.filter((o) => o.status === "paid");
  const occupiedTables = tables.filter((t) => {
    return orders.some((o) => o.table === t.id && o.status !== "paid" && o.status !== "cancelled");
  });

  return (
    <div className="min-h-screen bg-[#080b10] p-4 text-[#e6ebf2] sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col gap-4 border-b border-[#1f2838] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4af37]/50 bg-[#161d2b] text-[#ffd700] shadow-lg shadow-[#d4af37]/10">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
                  Manager Floor & Order Dispatch Console
                </h1>
                <span className="rounded-full bg-[#1e1708] border border-[#d4af37]/40 px-2.5 py-0.5 text-xs font-semibold text-[#f5df88]">
                  MULLAVANAM • KOCHI
                </span>
              </div>
              <p className="text-xs text-[#8e9eb5]">
                Real-time Table Matrix, Live Billing & Kitchen Coordination
              </p>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex overflow-x-auto scrollbar-none touch-pan rounded-xl border border-[#232f44] bg-[#111724] p-1 gap-1">
            <button
              onClick={() => setActiveTab("floor")}
              className={`shrink-0 rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition ${
                activeTab === "floor"
                  ? "gold-gradient-bg text-black shadow-sm"
                  : "text-[#8e9eb5] hover:text-white"
              }`}
            >
              Floor Plan ({occupiedTables.length}/{tables.length})
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`shrink-0 rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition ${
                activeTab === "orders"
                  ? "gold-gradient-bg text-black shadow-sm"
                  : "text-[#8e9eb5] hover:text-white"
              }`}
            >
              All Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("menu_stock")}
              className={`shrink-0 rounded-lg px-3 sm:px-4 py-2 text-xs font-bold transition ${
                activeTab === "menu_stock"
                  ? "gold-gradient-bg text-black shadow-sm"
                  : "text-[#8e9eb5] hover:text-white"
              }`}
            >
              Menu Stock Manager (86 List)
            </button>
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-[#1f2b3e] bg-[#0f1522] p-4 shadow-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7e8fa8]">
              Total Daily Sales
            </span>
            <div className="mt-1 font-serif text-xl font-bold text-[#f5df88] sm:text-2xl">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </div>
            <span className="mt-1 flex items-center gap-1 text-[11px] text-emerald-400">
              <TrendingUp className="h-3 w-3" /> Live Kitchen Billing
            </span>
          </div>

          <div className="rounded-2xl border border-[#1f2b3e] bg-[#0f1522] p-4 shadow-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7e8fa8]">
              Active Kitchen Orders
            </span>
            <div className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
              {activeOrders.length}
            </div>
            <span className="mt-1 flex items-center gap-1 text-[11px] text-amber-400">
              <Clock className="h-3 w-3" /> In Prep / Ready
            </span>
          </div>

          <div className="rounded-2xl border border-[#1f2b3e] bg-[#0f1522] p-4 shadow-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7e8fa8]">
              Table Occupancy
            </span>
            <div className="mt-1 font-serif text-xl font-bold text-white sm:text-2xl">
              {Math.round((occupiedTables.length / tables.length) * 100)}%
            </div>
            <span className="mt-1 text-[11px] text-[#8e9eb5]">
              {occupiedTables.length} of {tables.length} tables active
            </span>
          </div>

          <div className="rounded-2xl border border-[#1f2b3e] bg-[#0f1522] p-4 shadow-md">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7e8fa8]">
              Completed & Settled
            </span>
            <div className="mt-1 font-serif text-xl font-bold text-emerald-400 sm:text-2xl">
              {completedOrders.length}
            </div>
            <span className="mt-1 text-[11px] text-[#8e9eb5]">
              Avg Bill: ₹{orders.length ? Math.round(totalRevenue / orders.length) : 0}
            </span>
          </div>
        </div>

        {/* TAB 1: FLOOR MAP MATRIX */}
        {activeTab === "floor" && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-white">Floor Status Matrix</h2>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-stone-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1f2838]" /> Available
                </span>
                <span className="flex items-center gap-1.5 text-amber-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" /> In Kitchen
                </span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500" /> Ready to Serve
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tables.map((table) => {
                const activeOrder = orders.find(
                  (o) => o.table === table.id && o.status !== "paid" && o.status !== "cancelled"
                );

                return (
                  <div
                    key={table.id}
                    className={`rounded-2xl border p-4 transition-all ${
                      activeOrder
                        ? activeOrder.status === "ready"
                          ? "border-blue-500/70 bg-gradient-to-b from-[#10192e] to-[#0d131f] shadow-lg shadow-blue-500/10"
                          : "border-amber-500/70 bg-gradient-to-b from-[#211a0c] to-[#121622] shadow-lg shadow-amber-500/10"
                        : "border-[#1d2738] bg-[#0f1420] hover:border-[#2d3d57]"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-xl font-black text-white">
                          Table {table.id < 10 ? `0${table.id}` : table.id}
                        </span>
                        <p className="text-[11px] text-[#8192a8]">{table.section}</p>
                      </div>

                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          activeOrder
                            ? activeOrder.status === "ready"
                              ? "bg-blue-900/60 text-blue-300 border border-blue-500/40"
                              : "bg-amber-900/60 text-amber-300 border border-amber-500/40"
                            : "bg-[#182130] text-[#718299]"
                        }`}
                      >
                        {activeOrder ? activeOrder.status : "Vacant"}
                      </span>
                    </div>

                    {activeOrder ? (
                      <div className="mt-3 border-t border-[#232f42] pt-3 text-xs space-y-2">
                        <div className="flex justify-between text-[#8e9eb5]">
                          <span>Order Token:</span>
                          <span className="font-mono font-bold text-white">#{activeOrder.id}</span>
                        </div>
                        <div className="flex justify-between text-[#8e9eb5]">
                          <span>Guest:</span>
                          <span className="text-white font-medium">{activeOrder.customerName}</span>
                        </div>
                        <div className="flex justify-between text-[#8e9eb5]">
                          <span>Current Bill:</span>
                          <span className="font-bold text-[#f5df88]">₹{activeOrder.total}</span>
                        </div>

                        {/* Actions for active table */}
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => setSelectedOrderForBill(activeOrder)}
                            className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-[#3b4c66] bg-[#172030] py-1.5 text-[11px] font-semibold text-white hover:bg-[#202c42]"
                          >
                            <Eye className="h-3 w-3" /> View Bill
                          </button>
                          <button
                            onClick={() => updateOrderStatus(activeOrder.id, "paid")}
                            className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-1.5 text-[11px] font-bold text-white"
                          >
                            Mark Paid
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center justify-between text-xs text-[#5f7087]">
                        <span>Capacity: {table.capacity} Guests</span>
                        <span className="text-emerald-500 font-semibold">Available</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: ALL ORDERS TABLE */}
        {activeTab === "orders" && (
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
              <h2 className="font-serif text-lg font-bold text-white">Master Orders Stream</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#5e718c]" />
                <input
                  type="text"
                  placeholder="Search table, token or guest..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#232f42] bg-[#0c1017] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#556782] focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-none touch-pan rounded-2xl border border-[#1f2b3e] bg-[#0c1017]">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1f2b3e] bg-[#121824] text-[11px] font-bold uppercase tracking-wider text-[#7e8fa8]">
                  <tr>
                    <th className="p-3.5">Token / ID</th>
                    <th className="p-3.5">Table</th>
                    <th className="p-3.5">Guest & Phone</th>
                    <th className="p-3.5">Ordered Items</th>
                    <th className="p-3.5 text-right">Bill Total</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182130]">
                  {orders
                    .filter((ord) => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        ord.id.toLowerCase().includes(q) ||
                        String(ord.table).includes(q) ||
                        ord.customerName.toLowerCase().includes(q)
                      );
                    })
                    .map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#121927]">
                        <td className="p-3.5 font-mono font-bold text-[#ffd700]">#{ord.id}</td>
                        <td className="p-3.5 font-bold text-white">Table {ord.table}</td>
                        <td className="p-3.5">
                          <p className="font-semibold text-white">{ord.customerName}</p>
                          <p className="text-[10px] text-[#7889a0]">{ord.phone}</p>
                        </td>
                        <td className="p-3.5 max-w-xs truncate text-[#a0b0c4]">
                          {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-white">
                          ₹{ord.total.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3.5 text-center">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              ord.status === "paid"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                                : ord.status === "ready"
                                ? "bg-blue-950 text-blue-400 border border-blue-500/30"
                                : ord.status === "cooking"
                                ? "bg-amber-950 text-amber-400 border border-amber-500/30"
                                : "bg-purple-950 text-purple-400 border border-purple-500/30"
                            }`}
                          >
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedOrderForBill(ord)}
                              className="rounded-lg border border-[#30415a] bg-[#162030] p-1.5 text-white hover:bg-[#202c42]"
                              title="View Invoice"
                            >
                              <Receipt className="h-3.5 w-3.5" />
                            </button>
                            {ord.status !== "paid" && (
                              <button
                                onClick={() => updateOrderStatus(ord.id, "paid")}
                                className="rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500"
                              >
                                Settle Bill
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: MENU STOCK MANAGER (86'D ITEMS) */}
        {activeTab === "menu_stock" && (
          <div className="mt-6">
            <div className="mb-4">
              <h2 className="font-serif text-lg font-bold text-white">Live Kitchen Menu Availability</h2>
              <p className="text-xs text-[#8e9eb5]">
                Toggle dishes below to instantly mark items "Sold Out / 86" or "In Stock" on guest digital menus.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {MENU_ITEMS.map((dish) => {
                const isOut = Boolean(outOfStock[dish.id]);
                return (
                  <div
                    key={dish.id}
                    className={`flex items-center justify-between rounded-xl border p-3 transition ${
                      isOut
                        ? "border-red-500/40 bg-red-950/20"
                        : "border-[#1d293d] bg-[#0e1420]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="h-10 w-10 rounded-lg object-cover"
                        onError={(e) => { e.target.src = "/images/fish_nirvana.jpg"; }}
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{dish.name}</p>
                        <p className="text-[11px] text-[#8e9eb5]">₹{dish.price} • {dish.category}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleStock(dish.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition ${
                        isOut
                          ? "bg-red-500 text-white"
                          : "bg-[#1f2c42] text-emerald-400 hover:bg-[#283854]"
                      }`}
                    >
                      {isOut ? "SOLD OUT (86)" : "IN STOCK"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bill Preview Modal */}
      {selectedOrderForBill && (
        <OrderSuccessModal
          order={selectedOrderForBill}
          isOpen={Boolean(selectedOrderForBill)}
          onClose={() => setSelectedOrderForBill(null)}
        />
      )}
    </div>
  );
}
