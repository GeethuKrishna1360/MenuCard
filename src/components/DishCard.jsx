import React from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { Plus, Minus, Star, Flame, Clock, Crown, Info } from "lucide-react";

export default function DishCard({ dish, viewMode = "emerald", onOpenDetail }) {
  const { cart, addToCart, updateCartQuantity, outOfStock } = useRestaurant();

  // Find if this item is currently in cart
  const cartItem = cart.find((item) => item.dish.id === dish.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;
  const isSoldOut = Boolean(outOfStock[dish.id]);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isSoldOut) return;
    addToCart(dish);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateCartQuantity(dish.id, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateCartQuantity(dish.id, -1);
  };

  return (
    <div
      onClick={() => onOpenDetail(dish)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${
        viewMode === "emerald"
          ? "border-[#1d4a36]/60 bg-gradient-to-b from-[#092218]/90 via-[#0d171d]/90 to-[#07130e]/95 hover:border-[#d4af37]/60 hover:shadow-xl hover:shadow-[#0c3121]/30"
          : "border-[#232e42]/80 bg-gradient-to-b from-[#151c28]/90 via-[#101520]/95 to-[#0b0e14] hover:border-[#d4af37]/60 hover:shadow-xl hover:shadow-black/60"
      } ${isSoldOut ? "opacity-60 grayscale-[50%]" : ""}`}
    >
      {/* Top Banner Tag for Chef's Signatures */}
      {dish.isChefSpecial && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1 rounded-full border border-[#d4af37]/70 bg-gradient-to-r from-[#2a2007] to-[#161205] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#ffd700] shadow-md">
          <Crown className="h-3 w-3 text-[#ffd700]" />
          <span>CHEF'S SPECIAL</span>
        </div>
      )}

      {/* Out of Stock Overlay */}
      {isSoldOut && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/75 backdrop-blur-[2px]">
          <span className="rounded-lg border border-red-500/50 bg-red-950/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-red-200 shadow-lg">
            Sold Out For Today
          </span>
        </div>
      )}

      {/* Dish Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-[#0d131a] sm:h-52">
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          loading="lazy"
          onError={(e) => {
            // Elegant fallback if network image fails
            e.target.src = "/images/fish_nirvana.jpg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d14] via-transparent to-transparent opacity-85" />

        {/* Veg / Non-Veg Indicator Icon (Indian Standard) */}
        <div className="absolute top-3 right-3 z-10 rounded-md bg-[#080d14]/80 p-1 backdrop-blur-sm">
          {dish.isVeg ? (
            <div className="flex h-5 w-5 items-center justify-center rounded-sm border-2 border-emerald-500 p-0.5" title="Pure Vegetarian">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            </div>
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-sm border-2 border-red-600 p-0.5" title="Non-Vegetarian">
              <div className="h-0 w-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-red-600"></div>
            </div>
          )}
        </div>

        {/* Prep Time & Calories Floating Pill */}
        <div className="absolute bottom-2.5 left-3 flex items-center gap-2 text-[11px] text-[#cfd9e8]">
          <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
            <Clock className="h-3 w-3 text-[#d4af37]" />
            {dish.prepTime}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{dish.rating}</span>
          </span>
        </div>
      </div>

      {/* Dish Information Content */}
      <div className="flex flex-1 flex-col justify-between p-3.5 sm:p-4">
        <div>
          {/* Malayalam Script Subtitle */}
          {dish.malayalamName && (
            <p className="font-serif text-[11px] font-medium tracking-wide text-[#a2b49e] opacity-90">
              {dish.malayalamName}
            </p>
          )}

          {/* Dish Title */}
          <h3 className="font-serif text-base font-bold text-white transition-colors group-hover:text-[#f3e5ab] sm:text-lg">
            {dish.name}
          </h3>

          {/* Spice Level Indicator */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center" title={`Spice level: ${dish.spiceLevel}/3`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <Flame
                  key={i}
                  className={`h-3 w-3 ${
                    i < dish.spiceLevel ? "fill-orange-500 text-orange-500" : "text-[#344258]"
                  }`}
                />
              ))}
            </div>
            {dish.portion && (
              <span className="text-[11px] text-[#7d8eab]">• {dish.portion}</span>
            )}
          </div>

          {/* Short Description */}
          <p className="mt-2 text-xs leading-relaxed text-[#94a5bd] line-clamp-2">
            {dish.description}
          </p>

          {/* Tags */}
          {dish.tags && dish.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {dish.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-md border border-[#2b3a4f] bg-[#121a26] px-2 py-0.5 text-[10px] font-medium text-[#c0cee0]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Add to Cart Controls */}
        <div className="mt-4 flex items-center justify-between border-t border-[#1d2738] pt-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#8192a8]">Price</span>
            <div className="font-serif text-lg font-bold text-[#f5df88] sm:text-xl">
              ₹{dish.price}
            </div>
          </div>

          {/* Cart Quantity Controller */}
          <div onClick={(e) => e.stopPropagation()}>
            {currentQuantity === 0 ? (
              <button
                disabled={isSoldOut}
                onClick={handleAdd}
                className="flex items-center gap-1.5 rounded-xl border border-[#d4af37]/60 bg-gradient-to-r from-[#211a0b] to-[#121620] px-3.5 py-1.5 text-xs font-bold text-[#ffd700] shadow-md transition-all hover:border-[#d4af37] hover:from-[#d4af37] hover:to-[#b8860b] hover:text-[#0b0e14] active:scale-95 disabled:pointer-events-none"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                ADD
              </button>
            ) : (
              <div className="flex items-center rounded-xl border border-[#d4af37] bg-[#171e2c] p-0.5 shadow-md">
                <button
                  onClick={handleDecrement}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#242f44] text-white transition hover:bg-[#34435e] active:scale-90"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center font-mono text-xs font-bold text-[#f5df88]">
                  {currentQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d4af37] text-black transition hover:bg-[#eac266] active:scale-90"
                >
                  <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
