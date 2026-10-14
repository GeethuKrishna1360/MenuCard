import React, { useState, useMemo } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { MENU_ITEMS, CATEGORIES, RESTAURANT_INFO } from "../data/menuData";
import Navbar from "../components/Navbar";
import DishCard from "../components/DishCard";
import DishDetailModal from "../components/DishDetailModal";
import CartDrawer from "../components/CartDrawer";
import OrderSuccessModal from "../components/OrderSuccessModal";
import TableSelectorModal from "../components/TableSelectorModal";
import KitchenDisplaySystem from "../components/KitchenDisplaySystem";
import ManagerDashboard from "../components/ManagerDashboard";
import TableQRStands from "../components/TableQRStands";
import { 
  Search, 
  Crown, 
  Flame, 
  Leaf, 
  Drumstick, 
  QrCode, 
  ShoppingBag, 
  ChevronRight,
  SlidersHorizontal,
  Star,
  MapPin,
  UtensilsCrossed,
  ChefHat
} from "lucide-react";

export default function Home() {
  const { 
    activeView, 
    activeTable, 
    getCartTotals, 
    currentTableOrders, 
    addToCart 
  } = useRestaurant();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState("all"); // 'all' | 'veg' | 'non-veg' | 'chef-special'
  const [cardAesthetic, setCardAesthetic] = useState("emerald"); // 'emerald' (Image 3) | 'slate' (Image 2)

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedDishDetail, setSelectedDishDetail] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const cartTotals = getCartTotals();

  // Filtered dishes
  const filteredDishes = useMemo(() => {
    return MENU_ITEMS.filter((dish) => {
      // Category filter
      if (selectedCategory !== "all" && dish.category !== selectedCategory) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter === "veg" && !dish.isVeg) return false;
      if (dietaryFilter === "non-veg" && dish.isVeg) return false;
      if (dietaryFilter === "chef-special" && !dish.isChefSpecial) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = dish.name.toLowerCase().includes(query);
        const matchesDesc = dish.description.toLowerCase().includes(query);
        const matchesTag = dish.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesMalayalam = dish.malayalamName?.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesTag && !matchesMalayalam) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, dietaryFilter, searchQuery]);

  // If activeView is KDS, Floor Manager or QR stands, render those screens
  if (activeView === "kds") {
    return (
      <div className="min-h-screen bg-[#080b10]">
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTableSelector={() => setIsTableModalOpen(true)}
        />
        <KitchenDisplaySystem />
      </div>
    );
  }

  if (activeView === "manager") {
    return (
      <div className="min-h-screen bg-[#080b10]">
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTableSelector={() => setIsTableModalOpen(true)}
        />
        <ManagerDashboard />
      </div>
    );
  }

  if (activeView === "qr_stands") {
    return (
      <div className="min-h-screen bg-[#080b10]">
        <Navbar 
          onOpenCart={() => setIsCartOpen(true)}
          onOpenTableSelector={() => setIsTableModalOpen(true)}
        />
        <TableQRStands />
      </div>
    );
  }

  // Signature Hero Dish (Fish Nirvana)
  const heroDish = MENU_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#080b10] text-[#e5e9f0] pb-24">
      {/* Top Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTableSelector={() => setIsTableModalOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-3 sm:px-6">
        {/* HERO SECTION: Fine Dining Kerala Gastronomy */}
        <section className="relative mt-4 overflow-hidden rounded-3xl border border-[#d4af37]/40 bg-gradient-to-r from-[#0d161d] via-[#091e17] to-[#121c27] p-5 sm:p-8 shadow-2xl">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#d4af37]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative z-10 grid gap-6 lg:grid-cols-12 lg:items-center">
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-[#161f1a]/80 px-3 py-1 text-xs text-[#f5df88] backdrop-blur-sm">
                <Crown className="h-3.5 w-3.5 text-[#ffd700]" />
                <span className="font-semibold tracking-wide">MULLAVANAM HERITAGE RESTAURANT</span>
              </div>

              <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Mullavanam <span className="gold-gradient-text font-serif">Menu</span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9fb3cc] sm:text-base">
                Welcome to <strong>Table {activeTable < 10 ? `0${activeTable}` : activeTable}</strong> at <strong>Mullavanam (മുല്ലവനം)</strong>, Maradu, Kochi. Savor authentic backwater delicacies, fragrant Thalassery biryanis, and traditional coastal masterpieces directly at your table.
              </p>

              {/* Table Status Callout */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs">
                <button
                  onClick={() => setIsTableModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-[#d4af37] bg-[#1d170a] px-3.5 py-2 font-bold text-[#f5df88] hover:bg-[#d4af37] hover:text-black transition shadow-md"
                >
                  <QrCode className="h-4 w-4" />
                  <span>Dine-In: Table {activeTable < 10 ? `0${activeTable}` : activeTable}</span>
                  <span className="text-[10px] underline font-normal">Change</span>
                </button>

                {currentTableOrders.length > 0 && (
                  <button
                    onClick={() => setConfirmedOrder(currentTableOrders[0])}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/60 px-3.5 py-2 font-semibold text-emerald-300 hover:bg-emerald-900/60 transition"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Track Kitchen Order #{currentTableOrders[0].id}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right Hero Feature Card: Fish Nirvana */}
            <div className="lg:col-span-5">
              <div 
                onClick={() => setSelectedDishDetail(heroDish)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#162029] to-[#0d141e] p-4 shadow-xl transition-all duration-300 hover:border-[#d4af37] hover:shadow-2xl hover:shadow-[#d4af37]/20"
              >
                <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl">
                  <img
                    src={heroDish.image}
                    alt={heroDish.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 rounded-full border border-[#d4af37] bg-black/80 px-2.5 py-1 text-[10px] font-bold text-[#ffd700] backdrop-blur-sm">
                    ★ WORLD FAMOUS
                  </div>
                </div>

                <div className="mt-3 flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-serif text-[#a6cca4]">
                      {heroDish.malayalamName}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-[#f5df88]">
                      {heroDish.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#8c9fb8] line-clamp-2">
                      {heroDish.description}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#232f44] pt-2.5">
                  <div className="font-serif text-lg font-bold text-[#f5df88]">
                    ₹{heroDish.price}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(heroDish);
                    }}
                    className="rounded-xl gold-gradient-bg px-4 py-1.5 text-xs font-bold text-black hover:brightness-110 active:scale-95 transition"
                  >
                    + ADD TO TABLE
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEARCH, DIETARY FILTERS & AESTHETIC TOGGLE BAR */}
        <section className="relative sm:sticky sm:top-[68px] z-20 mt-4 sm:mt-6 rounded-2xl border border-[#1e2a3c] bg-[#0c1017]/95 p-3 sm:p-4 backdrop-blur-lg shadow-lg">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#5e718c]" />
              <input
                type="text"
                placeholder="Search Mullavanam delicacies, ingredients (e.g. Fish Nirvana, Appam, Prawns)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-[#232f44] bg-[#121824] pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#5d6f8a] focus:border-[#d4af37] focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-xs text-[#718299] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setDietaryFilter("all")}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  dietaryFilter === "all"
                    ? "bg-[#253247] text-white font-bold"
                    : "text-[#8e9eb5] hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setDietaryFilter("veg")}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  dietaryFilter === "veg"
                    ? "border-emerald-500 bg-emerald-950/60 text-emerald-300 font-bold"
                    : "border-[#212d3f] bg-[#101622] text-[#8e9eb5] hover:text-white"
                }`}
              >
                <Leaf className="h-3 w-3 text-emerald-400" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietaryFilter("non-veg")}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  dietaryFilter === "non-veg"
                    ? "border-red-500 bg-red-950/60 text-red-300 font-bold"
                    : "border-[#212d3f] bg-[#101622] text-[#8e9eb5] hover:text-white"
                }`}
              >
                <Drumstick className="h-3 w-3 text-red-400" />
                Non-Veg
              </button>
              <button
                onClick={() => setDietaryFilter("chef-special")}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                  dietaryFilter === "chef-special"
                    ? "border-[#d4af37] bg-[#221c0b] text-[#ffd700] font-bold"
                    : "border-[#212d3f] bg-[#101622] text-[#8e9eb5] hover:text-white"
                }`}
              >
                <Crown className="h-3 w-3 text-[#d4af37]" />
                Chef's Special
              </button>
            </div>

            {/* Aesthetic View Switcher (Emerald vs Slate) */}
            <div className="hidden sm:flex items-center rounded-xl border border-[#232f44] bg-[#111724] p-0.5 text-xs">
              <button
                onClick={() => setCardAesthetic("emerald")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  cardAesthetic === "emerald"
                    ? "bg-[#113a29] text-emerald-200 font-bold"
                    : "text-[#8192a8] hover:text-white"
                }`}
                title="Emerald & Gold Luxury Card Style (Image 3)"
              >
                Emerald Style
              </button>
              <button
                onClick={() => setCardAesthetic("slate")}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                  cardAesthetic === "slate"
                    ? "bg-[#253247] text-white font-bold"
                    : "text-[#8192a8] hover:text-white"
                }`}
                title="Obsidian Minimalist Slate Style (Image 2)"
              >
                Slate Style
              </button>
            </div>
          </div>

          {/* Category Horizontal Scrolling Tabs */}
          <div className="mt-3 flex overflow-x-auto gap-2 pb-1 scrollbar-none touch-pan -mx-1 px-1 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? "border-[#d4af37] bg-gradient-to-r from-[#2a200b] to-[#151c28] text-[#f5df88] font-bold shadow-md"
                    : "border-[#1e2a3c] bg-[#111724] text-[#8e9eb5] hover:border-[#324563] hover:text-white"
                }`}
              >
                {cat.highlight && <Crown className="h-3 w-3 text-[#ffd700]" />}
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* RESULTS COUNT & STATUS */}
        <div className="mt-5 flex items-center justify-between text-xs text-[#7e8fa8]">
          <div>
            Showing <strong className="text-white">{filteredDishes.length}</strong> delicacies from Mullavanam's kitchen
          </div>
          <div className="flex items-center gap-2">
            <span>Dining Table:</span>
            <strong className="text-[#f5df88]">Table {activeTable}</strong>
          </div>
        </div>

        {/* DISHES GRID */}
        {filteredDishes.length === 0 ? (
          <div className="my-20 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#232f42] bg-[#111724] text-[#556782]">
              <Search className="h-8 w-8 stroke-[1.5]" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-bold text-white">No dishes matched your search</h3>
            <p className="mt-1 text-xs text-[#7c8da5]">
              Try searching for something else like "Nirvana", "Biryani", "Appam", or clear your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setDietaryFilter("all");
              }}
              className="mt-4 rounded-xl border border-[#d4af37] bg-[#1c160a] px-4 py-2 text-xs font-bold text-[#f5df88]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                viewMode={cardAesthetic}
                onOpenDetail={(d) => setSelectedDishDetail(d)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FLOATING BOTTOM CART BAR (FOR MOBILE & EASY DESKTOP ACCESS) */}
      {cartTotals.itemCount > 0 && (
        <div className="fixed bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-40 mx-auto max-w-xl animate-bounceIn safe-bottom">
          <div
            onClick={() => setIsCartOpen(true)}
            className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-[#d4af37] bg-gradient-to-r from-[#171e2b] via-[#101520] to-[#171e2b] p-3 sm:p-3.5 shadow-2xl shadow-black transition hover:brightness-105"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#d4af37] text-black font-bold">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow">
                  {cartTotals.itemCount}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Table {activeTable} • {cartTotals.itemCount} item{cartTotals.itemCount !== 1 ? "s" : ""}
                </p>
                <p className="text-[11px] text-[#9eb0c7]">
                  Tap to view live bill breakdown & confirm
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-[#8e9eb5] uppercase tracking-wider block">Estimated Total</span>
                <span className="font-serif text-base font-bold text-[#f5df88]">
                  ₹{cartTotals.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#273347] text-white">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DISH DETAIL MODAL */}
      <DishDetailModal
        dish={selectedDishDetail}
        isOpen={Boolean(selectedDishDetail)}
        onClose={() => setSelectedDishDetail(null)}
      />

      {/* CART & BILL DRAWER */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOrderConfirmed={(newOrder) => {
          setConfirmedOrder(newOrder);
        }}
      />

      {/* TABLE SELECTOR / QR CODE SCANNER MODAL */}
      <TableSelectorModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      {/* ORDER CONFIRMATION & BILL RECEIPT MODAL */}
      <OrderSuccessModal
        order={confirmedOrder}
        isOpen={Boolean(confirmedOrder)}
        onClose={() => setConfirmedOrder(null)}
        onOrderMore={() => {
          setConfirmedOrder(null);
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}
