import React, { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { X, Star, Clock, Flame, Crown, Plus, Minus, Check, ChefHat } from "lucide-react";

export default function DishDetailModal({ dish, isOpen, onClose }) {
  const { addToCart } = useRestaurant();

  if (!isOpen || !dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedSpice, setSelectedSpice] = useState(dish.spiceLevel || 2);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [customNotes, setCustomNotes] = useState("");

  // Toggle add-on
  const handleToggleAddon = (addon) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.id === addon.id);
      if (exists) {
        return prev.filter((a) => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  // Calculate dynamic total
  const addOnsTotal = selectedAddOns.reduce((sum, item) => sum + item.price, 0);
  const itemTotalPrice = (dish.price + addOnsTotal) * quantity;

  const handleAddDish = () => {
    addToCart(dish, {
      quantity,
      selectedSpice,
      selectedAddOns,
      customNotes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#d4af37]/40 bg-[#0d121c] p-0 shadow-2xl shadow-black/95">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-md transition hover:bg-black"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative h-52 sm:h-72 w-full overflow-hidden bg-black">
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.src = "/images/fish_nirvana.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d121c] via-[#0d121c]/40 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {dish.isChefSpecial && (
                <span className="flex items-center gap-1 rounded-full border border-[#d4af37] bg-black/80 px-3 py-1 text-xs font-bold text-[#ffd700] backdrop-blur-md">
                  <Crown className="h-3.5 w-3.5" /> Chef Suresh Pillai Signature
                </span>
              )}
              <span className="rounded-full bg-black/80 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                {dish.prepTime}
              </span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-xs font-bold text-amber-300 backdrop-blur-md">
              <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
              <span>{dish.rating}</span>
              <span className="text-stone-400 font-normal">({dish.reviews})</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7">
          {/* Title & Malayalam name */}
          {dish.malayalamName && (
            <span className="text-sm font-serif font-medium text-[#9ec4a7]">
              {dish.malayalamName}
            </span>
          )}
          <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl mt-0.5">
            {dish.name}
          </h2>

          {/* Description */}
          <p className="mt-2 text-sm leading-relaxed text-[#9fb1c7]">
            {dish.description}
          </p>

          {/* Story Box if available */}
          {dish.story && (
            <div className="mt-4 rounded-xl border border-[#d4af37]/30 bg-gradient-to-r from-[#171e16] to-[#121822] p-4 text-xs text-[#d6e3d2]">
              <div className="flex items-center gap-2 font-serif font-bold text-[#f3e5ab] mb-1">
                <ChefHat className="h-4 w-4 text-[#d4af37]" />
                <span>Culinary Heritage & Story</span>
              </div>
              <p className="italic leading-relaxed">{dish.story}</p>
            </div>
          )}

          {/* Spice Level Selector */}
          <div className="mt-6 border-t border-[#1e2738] pt-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e9eb5] mb-2.5">
              Customize Spice Intensity:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { level: 1, label: "Mild & Subtle", desc: "Gentle spices, coconut-forward" },
                { level: 2, label: "Traditional", desc: "Authentic Kerala coastal heat" },
                { level: 3, label: "Fiery Hot", desc: "Extra bird's eye chilies & pepper" }
              ].map((sp) => (
                <button
                  key={sp.level}
                  onClick={() => setSelectedSpice(sp.level)}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    selectedSpice === sp.level
                      ? "border-[#d4af37] bg-[#221c0b] text-[#f7e4a6] shadow-md"
                      : "border-[#202b3d] bg-[#121722] text-[#8e9eb5] hover:border-[#384a69]"
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold text-xs text-white">
                    <Flame className={`h-3.5 w-3.5 ${selectedSpice === sp.level ? "text-orange-400 fill-orange-400" : "text-stone-500"}`} />
                    {sp.label}
                  </div>
                  <div className="text-[10px] text-[#738299] mt-0.5">{sp.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Add-Ons Options */}
          {dish.addOns && dish.addOns.length > 0 && (
            <div className="mt-6 border-t border-[#1e2738] pt-5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e9eb5] mb-2.5">
                Recommended Pairings & Add-Ons:
              </label>
              <div className="space-y-2">
                {dish.addOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 transition ${
                        isChecked
                          ? "border-[#d4af37] bg-[#1a1f18]"
                          : "border-[#202b3d] bg-[#121722] hover:border-[#364866]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isChecked
                              ? "border-[#d4af37] bg-[#d4af37] text-black"
                              : "border-[#485973]"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium text-white">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-[#f5df88]">
                        {addon.price === 0 ? "Complimentary" : `+₹${addon.price}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions Input */}
          <div className="mt-6 border-t border-[#1e2738] pt-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8e9eb5] mb-2">
              Note for the Kitchen & Chef:
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g. Less oil, extra curry leaves, serve piping hot..."
              className="w-full rounded-xl border border-[#253247] bg-[#101520] px-3.5 py-2.5 text-xs text-white placeholder-[#556782] focus:border-[#d4af37] focus:outline-none"
            />
          </div>

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-0 z-20 mt-6 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 flex items-center justify-between border-t border-[#1e2738] bg-[#0d121c]/95 px-5 py-4 sm:px-7 sm:py-5 backdrop-blur-md">
            {/* Quantity Controller */}
            <div className="flex items-center rounded-xl border border-[#2d3b52] bg-[#121722] p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f2838] text-white hover:bg-[#2b374d]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 sm:w-10 text-center font-mono text-xs sm:text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4af37] text-black hover:bg-[#eac266]"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Add to Order Button */}
            <button
              onClick={handleAddDish}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl gold-gradient-bg px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-[#0a0e14] shadow-lg shadow-[#d4af37]/20 transition-all hover:brightness-110 active:scale-95"
            >
              <span>Add to Order</span>
              <span className="font-bold">• ₹{itemTotalPrice.toLocaleString("en-IN")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
