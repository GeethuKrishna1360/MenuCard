import React, { createContext, useContext, useState, useEffect } from "react";
import { MENU_ITEMS, RESTAURANT_INFO, INITIAL_TABLES } from "../data/menuData";

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
  // 1. Table from URL query param e.g. ?table=7 or default Table 4
  const [activeTable, setActiveTable] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("table");
      if (t && !isNaN(t)) return parseInt(t, 10);
    } catch (e) {}
    return 4;
  });

  // Current view: 'customer' | 'kds' | 'manager' | 'qr_stands'
  const [activeView, setActiveView] = useState("customer");

  // Cart: [{ dish, quantity, selectedSpice, customNotes, selectedAddOns }]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Orders: Persisted and synchronized
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_orders");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    // Initial demo order for realism
    return [
      {
        id: "CP-1038",
        table: 2,
        customerName: "Arjun Nair",
        phone: "+91 98471 22334",
        status: "cooking", // received, cooking, ready, served, paid
        timestamp: new Date(Date.now() - 14 * 60000).toISOString(),
        items: [
          {
            dishId: "cp-starter-01",
            name: "Inji Puli Chicken Wings",
            price: 495,
            quantity: 1,
            notes: "Extra crispy glaze"
          },
          {
            dishId: "cp-nirvana-01",
            name: "Neymeen Nirvana (Seer Fish)",
            price: 995,
            quantity: 1,
            notes: "Medium spicy, fresh banana leaf"
          },
          {
            dishId: "cp-rice-04",
            name: "Steaming Lacy Appam (2 Pcs)",
            price: 90,
            quantity: 2,
            notes: "Serve steaming hot together"
          }
        ],
        subtotal: 1670,
        cgst: 41.75,
        sgst: 41.75,
        serviceCharge: 83.50,
        total: 1837,
        serverNotes: "VIP Guest from Le Méridien",
      }
    ];
  });

  // Table status map
  const [tables, setTables] = useState(() => {
    try {
      const saved = localStorage.getItem("cp_tables");
      return saved ? JSON.parse(saved) : INITIAL_TABLES;
    } catch (e) {
      return INITIAL_TABLES;
    }
  });

  // Out of stock dishes map
  const [outOfStock, setOutOfStock] = useState({});

  // Audio Chime Synthesizer
  const playAlertChime = (type = "order") => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (type === "order") {
        // High melodic double chime (C6 -> G6)
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(1046.5, now); // C6
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.3);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(1567.98, now + 0.15); // G6
        gain2.gain.setValueAtTime(0.25, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.6);
      } else if (type === "ready") {
        // Ready bell
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      }
    } catch (err) {
      console.warn("Audio chime note:", err);
    }
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("cp_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem("cp_orders", JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem("cp_tables", JSON.stringify(tables));
    } catch (e) {}
  }, [tables]);

  // Handle URL change if table query param is adjusted
  const changeTable = (newTableNumber) => {
    setActiveTable(newTableNumber);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("table", newTableNumber);
      window.history.replaceState({}, "", url.toString());
    } catch (e) {}
  };

  // Cart operations
  const addToCart = (dish, customOptions = {}) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.dish.id === dish.id &&
          item.selectedSpice === (customOptions.selectedSpice ?? dish.spiceLevel) &&
          JSON.stringify(item.selectedAddOns || []) === JSON.stringify(customOptions.selectedAddOns || [])
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += customOptions.quantity || 1;
        if (customOptions.customNotes) {
          next[existingIndex].customNotes = customOptions.customNotes;
        }
        return next;
      }

      return [
        ...prev,
        {
          dish,
          quantity: customOptions.quantity || 1,
          selectedSpice: customOptions.selectedSpice ?? dish.spiceLevel,
          customNotes: customOptions.customNotes || "",
          selectedAddOns: customOptions.selectedAddOns || [],
        },
      ];
    });
  };

  const updateCartQuantity = (dishId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.dish.id === dishId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (dishId) => {
    setCart((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const clearCart = () => setCart([]);

  // Calculate Cart Bill
  const getCartTotals = () => {
    let subtotal = 0;
    cart.forEach((item) => {
      let itemPrice = item.dish.price;
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        item.selectedAddOns.forEach((addon) => {
          itemPrice += addon.price;
        });
      }
      subtotal += itemPrice * item.quantity;
    });

    const cgst = subtotal * (RESTAURANT_INFO.gstRate / 2);
    const sgst = subtotal * (RESTAURANT_INFO.gstRate / 2);
    const serviceCharge = subtotal * RESTAURANT_INFO.serviceChargeRate;
    const grandTotal = Math.round(subtotal + cgst + sgst + serviceCharge);

    return {
      subtotal,
      cgst,
      sgst,
      gstTotal: cgst + sgst,
      serviceCharge,
      grandTotal,
      itemCount: cart.reduce((acc, it) => acc + it.quantity, 0),
    };
  };

  // Place Order (Submit to Kitchen & Manager)
  const placeOrder = ({ customerName = "Guest", phone = "", specialInstructions = "" }) => {
    if (cart.length === 0) return null;

    const totals = getCartTotals();
    const orderNumber = `CP-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.map((item) => {
      let addOnNames = "";
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        addOnNames = ` + ${item.selectedAddOns.map((a) => a.name).join(", ")}`;
      }
      let priceWithAddons = item.dish.price;
      if (item.selectedAddOns) {
        item.selectedAddOns.forEach((a) => (priceWithAddons += a.price));
      }

      return {
        dishId: item.dish.id,
        name: `${item.dish.name}${addOnNames}`,
        basePrice: item.dish.price,
        price: priceWithAddons,
        quantity: item.quantity,
        notes: item.customNotes,
        spiceLevel: item.selectedSpice,
        category: item.dish.category,
      };
    });

    const newOrder = {
      id: orderNumber,
      table: activeTable,
      customerName: customerName || `Table ${activeTable} Guest`,
      phone: phone || "Not Provided",
      status: "received", // received -> cooking -> ready -> served -> paid
      timestamp: new Date().toISOString(),
      items: orderItems,
      subtotal: totals.subtotal,
      cgst: totals.cgst,
      sgst: totals.sgst,
      serviceCharge: totals.serviceCharge,
      total: totals.grandTotal,
      specialInstructions: specialInstructions,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Update table status to occupied/active
    setTables((prev) =>
      prev.map((tbl) =>
        tbl.id === activeTable
          ? { ...tbl, status: "order_placed", currentOrderId: orderNumber }
          : tbl
      )
    );

    // Play chime sound
    playAlertChime("order");

    // Clear user cart
    clearCart();

    return newOrder;
  };

  // Update order status (From Kitchen or Manager)
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status: newStatus,
            [`${newStatus}At`]: new Date().toISOString(),
          };
        }
        return ord;
      })
    );

    if (newStatus === "ready") {
      playAlertChime("ready");
    }

    // If order is paid/completed, free up the table
    if (newStatus === "paid") {
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        setTables((prev) =>
          prev.map((tbl) =>
            tbl.id === order.table
              ? { ...tbl, status: "available", currentOrderId: null }
              : tbl
          )
        );
      }
    }
  };

  // Toggle item stock status
  const toggleStock = (dishId) => {
    setOutOfStock((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  // Get current active orders for current table (for customer live tracking)
  const currentTableOrders = orders.filter(
    (o) => o.table === activeTable && o.status !== "paid" && o.status !== "cancelled"
  );

  return (
    <RestaurantContext.Provider
      value={{
        activeTable,
        changeTable,
        activeView,
        setActiveView,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        getCartTotals,
        orders,
        placeOrder,
        updateOrderStatus,
        tables,
        setTables,
        outOfStock,
        toggleStock,
        currentTableOrders,
        playAlertChime,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error("useRestaurant must be used within RestaurantProvider");
  }
  return context;
}
