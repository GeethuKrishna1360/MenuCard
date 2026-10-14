# Restaurant Chef Pillai, Kochi (Marad) — Digital QR Menu & Smart Ordering System

A fine-dining web application built with React, Vite, and modern CSS/Tailwind, inspired by the culinary creations of **Chef Suresh Pillai (Le Méridien / Crowne Plaza, Maradu, Kochi)** and the luxury aesthetic of obsidian slate and gold-trimmed emerald menu boards.

---

## 🌟 Key Highlights & Features

1. **📱 Scan QR Code to Dine-In**:
   - Customers scan the table QR code (or access with `?table=N`) to open the digital menu for their exact dining table.
   - Built-in camera QR scanner simulator and table selector for 12 tables.

2. **🍛 Authentic Chef Pillai Menu**:
   - Signature **Neymeen Nirvana (Seer Fish)**, **Karimeen Pollichathu**, **Venad Paal Konch**, **Inji Puli Chicken Wings**, **Thalassery Biryani**, **Palada Cheesecake**, and more.
   - Real high-resolution culinary photography for all signature dishes.
   - Dietary filters (Pure Veg, Non-Veg, Chef's Special) and spice intensity badges.

3. **🧾 Live Bill Generation**:
   - Dynamic cart and live bill calculations with itemized dish rates.
   - Automated breakdown of **Subtotal**, **CGST (2.5%)**, **SGST (2.5%)**, **Restaurant Service Charge (5%)**, and **Grand Total**.
   - Optional guest name & phone number for digital receipt delivery.

4. **👨‍🍳 Live Kitchen Display System (KDS)**:
   - When an order is confirmed, it is dispatched in real time to the kitchen.
   - Visual Kitchen Order Tickets (KOT) with order timers (Green, Amber, Red for delays).
   - One-touch status progression: *Received* ➔ *Cooking* ➔ *Ready for Server* ➔ *Served*.
   - Web Audio API kitchen chimes.

5. **📊 Manager Floor & Order Console**:
   - 12-table floor status matrix (Available, Occupied, Order in Prep, Ready, Settled).
   - Real-time gross revenue metrics and average ticket size.
   - Live 86 / Stock Inventory Manager to mark dishes sold out or in stock.

6. **🖨️ Printable Table QR Code Stands**:
   - Printable table tent stands with live generated QR codes for tables 1 through 12.

---

## 🚀 Running the App

```bash
npm install
npm run dev
```

Visit the local dev URL (e.g. `http://localhost:5174/`).

To open directly for Table 4:
```
http://localhost:5174/?table=4
```
