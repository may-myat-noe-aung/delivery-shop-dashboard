import React, { useState } from "react";

import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export default function ShopDeliveryManCardsPopup({ driver, close }) {
  const [tab, setTab] = useState("notCleared");

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111827] border border-neutral-700 rounded-3xl w-full max-w-2xl overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-neutral-800 px-6 py-5">
          <div className="flex items-center gap-4">
            <img
              src={
                driver.photo
                  ? `http://38.60.244.137:3000/deliverymen-uploads/${driver.photo}`
                  : "/default-avatar.png"
              }
              alt={driver.name}
              className="w-14 h-14 rounded-full object-cover border border-neutral-700"
            />

            <div>
              <h2 className="text-2xl font-bold text-white">{driver.name}</h2>

              <p className="text-gray-400 text-sm mt-1"> Shop Delivery </p>
            </div>
          </div>

          <button
            onClick={close}
            className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-red-500 flex items-center justify-center text-gray-300 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6">
          {/* TABS */}
          <div className="grid grid-cols-2 gap-4">
            {/* NOT CLEARED */}
            <button
              onClick={() => setTab("notCleared")}
              className={`rounded-2xl p-5 border transition ${
                tab === "notCleared"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-[#1f2937] border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 text-red-400">
                <AlertTriangle size={18} />
                <span className="font-semibold">Not Cleared</span>
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="text-white text-sm">
                  Total Orders:
                  <span className="ml-2 text-red-400">
                    {driver.not_cleared_orders?.total_way || 0}
                  </span>
                </p>

                <p className="text-white text-sm">
                  Delivery Fees:
                  <span className="ml-2 text-red-400">
                    {driver.not_cleared_orders?.total_delivy_fees || 0} Ks
                  </span>
                </p>

                <p className="text-white text-sm">
                  Total Kilo:
                  <span className="ml-2 text-red-400">
                    {driver.not_cleared_orders?.total_kilo || 0}
                  </span>
                </p>
              </div>
            </button>

            {/* CLEARED */}
            <button
              onClick={() => setTab("cleared")}
              className={`rounded-2xl p-5 border transition ${
                tab === "cleared"
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-[#1f2937] border-neutral-700"
              }`}
            >
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle2 size={18} />
                <span className="font-semibold">Cleared</span>
              </div>

              <div className="mt-4 space-y-2 text-left">
                <p className="text-white text-sm">
                  Total Orders:
                  <span className="ml-2 text-green-400">
                    {driver.cleared_orders?.total_way || 0}
                  </span>
                </p>

                <p className="text-white text-sm">
                  Delivery Fees:
                  <span className="ml-2 text-green-400">
                    {driver.cleared_orders?.total_delivy_fees || 0} Ks
                  </span>
                </p>

                <p className="text-white text-sm">
                  Total Kilo:
                  <span className="ml-2 text-green-400">
                    {driver.cleared_orders?.total_kilo || 0}
                  </span>
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
