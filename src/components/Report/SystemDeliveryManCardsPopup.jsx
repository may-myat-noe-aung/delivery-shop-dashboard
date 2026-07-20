import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";
import { useAlert } from "../../AlertProvider";

// =========================
// MAIN COMPONENT
// =========================
export default function SystemDeliveryManCardsPopup({  shopId,driver,close,
  refreshData}) {
  const [tab, setTab] = useState("notCleared");
  const [clearing, setClearing] = useState(false);
  const token = localStorage.getItem("shopToken");

  const { showAlert, confirm } = useAlert();



  // =========================
  // ESC CLOSE
  // =========================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close]);

  // =========================
  // CLEAR WAY
  // =========================
  const handleClearWay = async () => {
    const ok = await confirm(
      `Are you sure you want to clear ${driver.name} orders?`,
    );

    if (!ok) return;

    try {
      setClearing(true);

      const response = await fetch(
        `https://api.pwezayshops.com/clearedOrders-by-shops/${driver.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `MSHteam ${token}`,
          },
          body: JSON.stringify({
          shopId,
          }),
        },
      );

      const result = await response.json();

     if (response.ok) {
  showAlert(
    result.message || "Orders cleared successfully",
    "success"
  );

  await refreshData();
} else {
        showAlert(result.message || "Failed to clear orders", "error");
      }
    } catch (error) {
      showAlert("Server error", "error");
    } finally {
      setClearing(false);
    }
  };

  // =========================
  // SAFETY
  // =========================
  if (!driver) return null;

  // =========================
  // DATA SELECTOR
  // =========================
  const data =
    tab === "notCleared" ? driver.not_cleared_orders : driver.cleared_orders;

  const isCleared = tab === "cleared";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* BACKDROP CLOSE */}
      <div className="absolute inset-0" onClick={close} />

      {/* MODAL */}
      <div className="relative bg-[#0f172a] w-full max-w-xl rounded-2xl border border-neutral-700 overflow-hidden shadow-2xl">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center px-5 py-3 border-b border-neutral-800">
          <div className="flex items-center gap-4">
            {/* PHOTO */}
            {driver.photo ? (
              <img
                src={`https://api.pwezayshops.com/deliverymen-uploads/${driver.photo}`}
                alt={driver.name}
                className="w-14 h-14 rounded-full object-cover border border-neutral-700"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                {driver.name?.charAt(0).toUpperCase() || "?"}
              </div>
            )}

            {/* INFO */}
            <div>
              <h2 className="text-white text-xl font-bold">{driver.name}</h2>

              <p className="text-gray-400 text-sm">{driver.work_type}</p>

              {/* <p className="text-gray-500 text-xs mt-1">
                {driver.phone}
              </p> */}
            </div>
          </div>

          {/* CLOSE */}
          <button
            onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-red-500 transition"
          >
            <X className="text-white" size={18} />
          </button>
        </div>

        {/* ================= TABS ================= */}
        <div className="grid grid-cols-2 gap-3 p-5">
          <button
            onClick={() => setTab("notCleared")}
            className={`px-4 py-2 rounded-xl border transition ${
              tab === "notCleared"
                ? "border-red-500 bg-red-500/10"
                : "border-neutral-700 hover:border-neutral-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-red-400" />

              <div className="text-left">
                <p className="text-white font-medium">Not Cleared</p>

                <p className="text-xs text-gray-400 mt-1">
                  Pending delivery fees
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setTab("cleared")}
            className={`px-4 py-2 rounded-xl border transition ${
              tab === "cleared"
                ? "border-green-500 bg-green-500/10"
                : "border-neutral-700 hover:border-neutral-500"
            }`}
          >
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-green-400" />

              <div className="text-left">
                <p className="text-white font-medium">Cleared</p>

                <p className="text-xs text-gray-400 mt-1">
                  Completed delivery fees
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="px-5 pb-6 space-y-5">
          {/* TITLE */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3
                className={`text-lg font-bold ${
                  isCleared ? "text-green-400" : "text-red-400"
                }`}
              >
                {isCleared ? "Cleared Orders" : "Not Cleared Orders"}
              </h3>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  isCleared
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {isCleared ? "Completed" : "Pending"}
              </span>
            </div>

            {!isCleared && data?.ways?.length > 0 && (
              <button
                onClick={handleClearWay}
                disabled={clearing}
                className="
                  px-4 py-2 rounded-xl
                  bg-gradient-to-r from-indigo-600 to-indigo-500
                  hover:scale-105
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  transition
                  text-white text-sm font-semibold
                "
              >
                {clearing ? "Clearing..." : "Clear Way"}
              </button>
            )}
          </div>

          {/* ================= SUMMARY ================= */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1f2937] p-4 rounded-xl text-center border border-neutral-800">
              <p className="text-gray-400 text-xs">Orders</p>

              <p className="text-white font-bold text-xl mt-1">
                {data?.total_way || 0}
              </p>
            </div>

            <div className="bg-[#1f2937] p-4 rounded-xl text-center border border-neutral-800">
              <p className="text-gray-400 text-xs">Fees</p>

              <p
                className={`font-bold text-xl mt-1 ${
                  isCleared ? "text-green-400" : "text-red-400"
                }`}
              >
                {(data?.total_delivy_fees || 0).toLocaleString()} Ks
              </p>
            </div>

            <div className="bg-[#1f2937] p-4 rounded-xl text-center border border-neutral-800">
              <p className="text-gray-400 text-xs">Kilo</p>

              <p className="text-white font-bold text-xl mt-1">
                {Number(data?.total_kilo || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* ================= ORDERS ================= */}
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {data?.ways?.length === 0 && (
              <div className="text-center text-gray-400 py-10 border border-dashed border-neutral-700 rounded-xl">
                No orders found
              </div>
            )}

            {data?.ways?.map((order) => (
              <div
                key={order.orderId}
                className="
                  bg-[#1f2937]
                  p-4
                  rounded-xl
                  border border-neutral-800
                  flex flex-col md:flex-row
                  gap-3
                  md:items-center
                  md:justify-between
                  hover:bg-[#273449]
                  transition
                "
              >
                {/* LEFT */}
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">
                      #{order.orderId}
                    </span>

                    <span className="text-gray-500">|</span>

                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md">
                      {order.menu} menus
                    </span>
                  </div>

                  {/* <span className="text-gray-500">
                    |
                  </span> */}

                </div>

                {/* RIGHT */}
                {/* <span
                  className={`text-xs px-3 py-1 rounded-full w-fit ${
                    isCleared
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {isCleared ? "Cleared" : "Pending"}
                </span> */}
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">
                      {order.kilo} kilo
                    </span>

                    <span className="text-gray-500">|</span>

                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md">
                      {order.delivey_fees?.toLocaleString()} Ks
                    </span>
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
