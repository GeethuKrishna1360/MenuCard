import React, { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { RESTAURANT_INFO } from "../data/menuData";
import confetti from "canvas-confetti";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Receipt, 
  Send, 
  Clock, 
  ChefHat, 
  Info,
  Phone,
  User,
  CheckCircle2,
  QrCode
} from "lucide-react";

export default function CartDrawer({ isOpen, onClose, onOrderConfirmed }) {
  const { 
    cart, 
    activeTable, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    getCartTotals, 
    placeOrder,
    currentTableOrders
  } = useRestaurant();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totals = getCartTotals();

  const handleConfirmOrder = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      // Fire celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#d4af37", "#f5df88", "#22c55e", "#ffffff"],
      });
    } catch (e) {}

    setTimeout(() => {
      const placedOrder = placeOrder({
        customerName: customerName || `Table ${activeTable} Guest`,
        phone: phone,
        specialInstructions: specialInstructions,
      });

      setIsSubmitting(false);
      onClose();
      if (onOrderConfirmed) {
        onOrderConfirmed(placedOrder);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative flex h-full w-full max-w-md flex-col justify-between border-l border-[#242f44] bg-[#0c1017] shadow-2xl">
        {/* Header */}
        <div className="border-b border-[#1f2838] p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#d4af37]/50 bg-[#161d2a]">
                <Receipt className="h-5 w-5 text-[#d4af37]" />
              </div>
              <div>
                <h2 className="font-serif text-lg font-bold text-white">Your Order & Bill</h2>
                <div className="flex items-center gap-2 text-xs text-[#8e9eb5]">
                  <span className="font-semibold text-[#f5df88]">Table {activeTable < 10 ? `0${activeTable}` : activeTable}</span>
                  <span>•</span>
                  <span>{totals.itemCount} item{totals.itemCount !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-[#8e9eb5] hover:bg-[#1a2333] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 scrollbar-none touch-pan">
          {/* Active cooking orders notification if any for this table */}
          {currentTableOrders.length > 0 && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-300">
              <div className="flex items-center gap-2 font-semibold text-emerald-200">
                <ChefHat className="h-4 w-4" />
                <span>Active Table Order #{currentTableOrders[0].id}</span>
              </div>
              <p className="mt-1 text-[11px] text-emerald-300/80">
                Currently being prepared in the kitchen. Any new items added below will be sent as an additional ticket to the same table.
              </p>
            </div>
          )}

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#131a26] text-[#61738c]">
                <Receipt className="h-8 w-8 stroke-[1.5]" />
              </div>
              <p className="mt-4 font-serif text-base font-bold text-white">Your order list is empty</p>
              <p className="mt-1 max-w-xs text-xs text-[#7b8ca5]">
                Explore Mullavanam's legendary menu, add dishes like Neymeen Nirvana or Inji Puli Wings to generate your bill.
              </p>
              <button
                onClick={onClose}
                className="mt-5 rounded-xl border border-[#d4af37] bg-[#1d170a] px-5 py-2 text-xs font-bold text-[#f5df88] hover:bg-[#d4af37] hover:text-black transition"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#7d8fa8]">
                <span>SELECTED DISHES</span>
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {cart.map((item, idx) => {
                let addOnsPrice = 0;
                if (item.selectedAddOns && item.selectedAddOns.length > 0) {
                  addOnsPrice = item.selectedAddOns.reduce((s, a) => s + a.price, 0);
                }
                const unitPrice = item.dish.price + addOnsPrice;
                const lineTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={`${item.dish.id}-${idx}`}
                    className="flex flex-col gap-2 rounded-xl border border-[#1e2738] bg-[#101520] p-3 transition hover:border-[#2f3d54]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          {item.dish.isVeg ? (
                            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                          ) : (
                            <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                          )}
                          <h4 className="text-xs font-bold text-white">{item.dish.name}</h4>
                        </div>

                        {/* Add-ons list */}
                        {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                          <div className="mt-1 text-[11px] text-[#90a3bc]">
                            {item.selectedAddOns.map((a) => `+ ${a.name}`).join(", ")}
                          </div>
                        )}

                        {/* Prep Note */}
                        {item.customNotes && (
                          <div className="mt-0.5 text-[10px] text-amber-300/80 italic">
                            Note: "{item.customNotes}"
                          </div>
                        )}

                        <div className="mt-1 text-xs font-semibold text-[#f5df88]">
                          ₹{unitPrice} each
                        </div>
                      </div>

                      {/* Quantity & Delete Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-[#263347] bg-[#161e2b] p-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.dish.id, -1)}
                            className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-[#222d3d]"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.dish.id, 1)}
                            className="flex h-6 w-6 items-center justify-center rounded text-white hover:bg-[#222d3d]"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.dish.id)}
                          className="text-[#64768f] hover:text-red-400 p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between border-t border-[#1a2230] pt-1.5 text-xs">
                      <span className="text-[11px] text-[#718299]">Line Total:</span>
                      <span className="font-mono font-bold text-white">₹{lineTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {cart.length > 0 && (
            <>
              {/* Customer Info (Optional) */}
              <div className="rounded-xl border border-[#1e2738] bg-[#101520] p-3.5 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8e9eb5]">
                  Guest Details for Digital Bill:
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#5e718c]" />
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full rounded-lg border border-[#232f42] bg-[#0c1017] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#556782] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#5e718c]" />
                    <input
                      type="tel"
                      placeholder="Mobile for Bill / SMS"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-[#232f42] bg-[#0c1017] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#556782] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    rows="2"
                    placeholder="Instructions for the kitchen / allergies (e.g. Less oil, kid friendly)..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full rounded-lg border border-[#232f42] bg-[#0c1017] p-2 text-xs text-white placeholder-[#556782] focus:border-[#d4af37] focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Itemized Bill Breakdown */}
              <div className="rounded-xl border border-[#263347] bg-[#121824] p-4 text-xs space-y-2">
                <div className="flex items-center justify-between font-serif font-bold text-white border-b border-[#212b3d] pb-2">
                  <span>ESTIMATED BILL SUMMARY</span>
                  <span className="font-mono text-[11px] text-[#f5df88]">TABLE {activeTable}</span>
                </div>

                <div className="flex justify-between text-[#8e9eb5]">
                  <span>Item Subtotal</span>
                  <span className="font-mono font-medium text-white">₹{totals.subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#8e9eb5]">
                  <span>CGST (2.5%)</span>
                  <span className="font-mono text-white">₹{totals.cgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#8e9eb5]">
                  <span>SGST (2.5%)</span>
                  <span className="font-mono text-white">₹{totals.sgst.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-[#8e9eb5]">
                  <span>Restaurant Service Charge (5%)</span>
                  <span className="font-mono text-white">₹{totals.serviceCharge.toFixed(2)}</span>
                </div>

                <div className="border-t border-[#243044] pt-2 flex items-center justify-between text-sm font-bold">
                  <span className="text-white">Grand Total (Incl. Taxes)</span>
                  <span className="font-mono text-base text-[#f5df88]">₹{totals.grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Bottom Confirmation Bar */}
        {cart.length > 0 && (
          <div className="border-t border-[#1f2838] bg-[#0c1017] p-4 sm:p-5 space-y-3 safe-bottom">
            <div className="flex items-center justify-between text-xs text-[#8e9eb5]">
              <span>Table {activeTable} • {totals.itemCount} items</span>
              <span className="font-bold text-[#f5df88]">Total: ₹{totals.grandTotal.toLocaleString("en-IN")}</span>
            </div>

            <button
              disabled={isSubmitting}
              onClick={handleConfirmOrder}
              className="flex w-full items-center justify-center gap-2 rounded-xl gold-gradient-bg py-3.5 font-bold text-[#090d14] shadow-lg shadow-[#d4af37]/20 transition-all hover:brightness-110 active:scale-98 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Sending Order to Kitchen..." : "CONFIRM & SEND TO KITCHEN"}</span>
            </button>
            <p className="text-center text-[10px] text-[#6b7c94]">
              Kitchen Display System (KDS) and Floor Manager will receive ticket instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
