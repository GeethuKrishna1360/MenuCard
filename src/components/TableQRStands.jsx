import React, { useState, useEffect } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { RESTAURANT_INFO } from "../data/menuData";
import { Printer, QrCode, ExternalLink, ChefHat, Download, Info } from "lucide-react";
import QRCode from "qrcode";

export default function TableQRStands() {
  const { tables, changeTable, setActiveView } = useRestaurant();
  const [qrCodeUrls, setQrCodeUrls] = useState({});

  useEffect(() => {
    // Generate QR codes for all tables
    const baseUrl = window.location.origin + window.location.pathname;
    const promises = tables.map(async (table) => {
      const targetUrl = `${baseUrl}?table=${table.id}`;
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 220,
        margin: 1,
        color: {
          dark: "#0b0f17",
          light: "#ffffff",
        },
      });
      return { id: table.id, url: dataUrl, targetUrl };
    });

    Promise.all(promises).then((results) => {
      const map = {};
      results.forEach((r) => {
        map[r.id] = { qrImage: r.url, targetUrl: r.targetUrl };
      });
      setQrCodeUrls(map);
    });
  }, [tables]);

  const handlePrint = () => {
    window.print();
  };

  const handleOpenTableMenu = (tableId) => {
    changeTable(tableId);
    setActiveView("customer");
  };

  return (
    <div className="min-h-screen bg-[#080b10] p-4 text-[#e6ebf2] sm:p-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="no-print flex flex-col gap-4 border-b border-[#1f2838] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d4af37]/50 bg-[#171e2c] text-[#ffd700]">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-bold tracking-tight text-white sm:text-2xl">
                Table QR Code Stands & Printables
              </h1>
              <p className="text-xs text-[#8e9eb5]">
                Place these tent cards on restaurant tables. Guests scan with their smartphone camera to open the menu for that exact table.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl gold-gradient-bg px-4 py-2 text-xs font-bold text-black shadow-lg hover:brightness-110 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print All Table QR Stands</span>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="no-print my-6 rounded-2xl border border-[#2b3a52] bg-[#0f1522] p-4 text-xs text-[#9bb0cc] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-[#d4af37] shrink-0" />
            <span>
              Each QR code directly encodes <code className="text-[#f5df88]">?table=N</code>. Scanning it from any device or mobile browser automatically sets the dining table and dispatches orders to that table!
            </span>
          </div>
        </div>

        {/* Printable Grid of Table Stands */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {tables.map((table) => {
            const qrData = qrCodeUrls[table.id];

            return (
              <div
                key={table.id}
                className="relative flex flex-col items-center justify-between rounded-3xl border-2 border-[#d4af37]/60 bg-gradient-to-b from-[#131926] via-[#0b0e14] to-[#07090f] p-6 text-center shadow-xl shadow-black/80 break-inside-avoid print:bg-white print:text-black print:border-black"
              >
                {/* Gold Crest / Logo */}
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#d4af37] bg-[#211a09] text-[#ffd700]">
                  <ChefHat className="h-5 w-5" />
                </div>

                <div className="border-b border-[#242f44] pb-2 w-full">
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-white">
                    Mullavanam <span className="text-xs font-normal text-[#f5df88]">മുല്ലവനം</span>
                  </h3>
                  <p className="text-[10px] tracking-wide text-[#8a9bb2]">
                    Kochi • Maradu
                  </p>
                </div>

                {/* Table Callout */}
                <div className="my-3 rounded-xl border border-[#d4af37]/40 bg-[#1a1608] px-4 py-1 text-[#f5df88]">
                  <span className="font-mono text-xl font-black">
                    TABLE {table.id < 10 ? `0${table.id}` : table.id}
                  </span>
                  <div className="text-[9px] uppercase tracking-wider text-[#9aa7bc]">
                    {table.section}
                  </div>
                </div>

                {/* Real Scannable QR Code */}
                <div className="my-2 rounded-2xl border-4 border-[#d4af37] bg-white p-2.5 shadow-lg">
                  {qrData ? (
                    <img
                      src={qrData.qrImage}
                      alt={`Table ${table.id} QR Code`}
                      className="h-36 w-36"
                    />
                  ) : (
                    <div className="flex h-36 w-36 items-center justify-center text-xs text-stone-500">
                      Generating QR...
                    </div>
                  )}
                </div>

                {/* Instructions */}
                <div className="mt-2 space-y-0.5">
                  <p className="font-serif text-xs font-bold text-white">
                    Scan with Phone Camera
                  </p>
                  <p className="text-[10px] text-[#7d8fa8]">
                    Explore Menu & Order Directly to This Table
                  </p>
                </div>

                {/* Action button (hidden in print) */}
                <div className="no-print mt-4 w-full border-t border-[#1d2638] pt-3">
                  <button
                    onClick={() => handleOpenTableMenu(table.id)}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#303f57] bg-[#141b26] py-2 text-xs font-semibold text-[#f5df88] hover:border-[#d4af37] hover:bg-[#1f2838] transition"
                  >
                    <span>Test Scan / Open Table {table.id}</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
