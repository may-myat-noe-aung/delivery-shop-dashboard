// import React, { useState } from "react";

// import { CheckCircle2, AlertTriangle, X } from "lucide-react";

// import { useAlert } from "../../AlertProvider";

// export default function SystemDeliveryManCardsPopup({ driver, close }) {
//   const [tab, setTab] = useState("notCleared");
//   const [clearing, setClearing] = useState(false);

//   const { showAlert } = useAlert();

//   // =========================
//   // CLEAR ORDERS API
//   // =========================
//   const handleClearOrders = async () => {
//     setClearing(true);

//     try {
//       const res = await fetch(
//         `http://38.60.244.137:3000/clearedOrders-by-shops/${driver.id}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             shop_id: driver.shop_id || "S001",
//           }),
//         },
//       );

//       const data = await res.json();

//       if (data.success) {
//         showAlert?.(data.message || "Cleared successfully", "success");
//       } else {
//         showAlert?.(data.message || "No finished orders found", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert?.("Server error", "error");
//     } finally {
//       setClearing(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
//       <div className="bg-[#0f172a] border border-neutral-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
//         {/* HEADER */}
//         <div className="flex justify-between items-center border-b border-neutral-800 px-6 py-5">
//           <div className="flex items-center gap-4">
//             <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#1f2937] flex items-center justify-center border border-neutral-700 shadow-md">
//               {driver.photo ? (
//                 <img
//                   src={`http://38.60.244.137:3000/deliverymen-uploads/${driver.photo}`}
//                   alt={driver.name}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.target.style.display = "none";
//                   }}
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center bg-indigo-500 text-white text-lg font-bold">
//                   {driver.name?.charAt(0).toUpperCase() || "?"}
//                 </div>
//               )}

//               {/* subtle glow ring */}
//               <div className="absolute inset-0 rounded-full ring-2 ring-indigo-500/20"></div>
//             </div>

//             <div>
//               <h2 className="text-2xl font-bold text-white">{driver.name}</h2>

//               <p className="text-gray-400 text-sm mt-1">Shop Delivery</p>
//             </div>
//           </div>

//           <button
//             onClick={close}
//             className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-red-500 flex items-center justify-center text-gray-300 hover:text-white transition"
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="p-6">
//           {/* TABS */}
//           <div className="grid grid-cols-2 gap-4">
//             {/* NOT CLEARED */}
//             <button
//               onClick={() => setTab("notCleared")}
//               className={`rounded-2xl p-5 border transition-all duration-200 ${
//                 tab === "notCleared"
//                   ? "bg-red-500/10 border-red-500/30 shadow-md"
//                   : "bg-[#1f2937] border-neutral-700"
//               }`}
//             >
//               <div className="flex items-center gap-2 text-red-400">
//                 <AlertTriangle size={18} />
//                 <span className="font-semibold">Not Cleared</span>
//               </div>

//               <div className="mt-4 space-y-2 text-left">
//                 <p className="text-white text-sm">
//                   Total Orders:
//                   <span className="ml-2 text-red-400">
//                     {driver.not_cleared_orders?.total_way || 0}
//                   </span>
//                 </p>

//                 <p className="text-white text-sm">
//                   Delivery Fees:
//                   <span className="ml-2 text-red-400">
//                     {driver.not_cleared_orders?.total_delivy_fees || 0} Ks
//                   </span>
//                 </p>

//                 <p className="text-white text-sm">
//                   Total Kilo:
//                   <span className="ml-2 text-red-400">
//                     {driver.not_cleared_orders?.total_kilo || 0}
//                   </span>
//                 </p>
//               </div>
//             </button>

//             {/* CLEARED */}
//             <button
//               onClick={() => setTab("cleared")}
//               className={`rounded-2xl p-5 border transition-all duration-200 ${
//                 tab === "cleared"
//                   ? "bg-green-500/10 border-green-500/30 shadow-md"
//                   : "bg-[#1f2937] border-neutral-700"
//               }`}
//             >
//               <div className="flex items-center gap-2 text-green-400">
//                 <CheckCircle2 size={18} />
//                 <span className="font-semibold">Cleared</span>
//               </div>

//               <div className="mt-4 space-y-2 text-left">
//                 <p className="text-white text-sm">
//                   Total Orders:
//                   <span className="ml-2 text-green-400">
//                     {driver.cleared_orders?.total_way || 0}
//                   </span>
//                 </p>

//                 <p className="text-white text-sm">
//                   Delivery Fees:
//                   <span className="ml-2 text-green-400">
//                     {driver.cleared_orders?.total_delivy_fees || 0} Ks
//                   </span>
//                 </p>

//                 <p className="text-white text-sm">
//                   Total Kilo:
//                   <span className="ml-2 text-green-400">
//                     {driver.cleared_orders?.total_kilo || 0}
//                   </span>
//                 </p>
//               </div>
//             </button>
//           </div>

//           {/* =========================
//               CLEAR BUTTON (NEW UI)
//           ========================= */}
//           <div className="mt-6 flex justify-end">
//             <button
//               onClick={handleClearOrders}
//               disabled={clearing}
//               className="
//                 px-5 py-2 rounded-xl
//                 bg-indigo-500 hover:bg-indigo-600
//                 disabled:opacity-50 disabled:cursor-not-allowed
//                 text-white text-sm font-medium
//                 shadow-md transition-all
//               "
//             >
//               {clearing ? "Clearing..." : "Clear Orders"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState } from "react";
// import { CheckCircle2, AlertTriangle, X } from "lucide-react";
// import { useAlert } from "../../AlertProvider";

// const API_BASE = "http://38.60.244.137:3000";

// export default function SystemDeliveryManCardsPopup({ driverId, close }) {
//   const [tab, setTab] = useState("notCleared");
//   const [clearing, setClearing] = useState(false);
//   const [driver, setDriver] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const { showAlert } = useAlert();

//   // =========================
//   // FETCH DRIVER API
//   // =========================
//   useEffect(() => {
//     const fetchDriver = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(`${API_BASE}/drivers`);
//         const json = await res.json();

//         if (json.success) {
//           const found = json.data.find((d) => d.id === driverId);
//           setDriver(found || null);
//         }
//       } catch (err) {
//         console.error(err);
//         showAlert?.("Failed to load driver", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDriver();
//   }, [driverId]);

//   // =========================
//   // CLEAR ORDERS (FAKE for now)
//   // =========================
//   const handleClearOrders = async () => {
//     setClearing(true);

//     setTimeout(() => {
//       showAlert?.("Orders cleared (mock)", "success");
//       setClearing(false);
//     }, 800);
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center text-white bg-black/60">
//         Loading...
//       </div>
//     );
//   }

//   if (!driver) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center text-white bg-black/60">
//         Driver not found
//       </div>
//     );
//   }

//   const orders =
//     tab === "notCleared"
//       ? driver.not_cleared_orders
//       : driver.cleared_orders;

//   const getStatus = (order) => {
//     // backend doesn't send status → we generate it
//     if (tab === "cleared") return "cleared";
//     return "pending";
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "cleared":
//         return "text-green-400 bg-green-500/20";
//       case "pending":
//         return "text-red-400 bg-red-500/20";
//       default:
//         return "text-yellow-400 bg-yellow-500/20";
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">

//       <div className="bg-[#0f172a] border border-neutral-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">

//         {/* HEADER */}
//         <div className="flex justify-between items-center px-6 py-5 border-b border-neutral-800">
//           <div>
//             <h2 className="text-2xl font-bold text-white">{driver.name}</h2>
//             <p className="text-gray-400 text-sm">{driver.work_type}</p>
//           </div>

//           <button onClick={close}>
//             <X className="text-white" />
//           </button>
//         </div>

//         {/* TABS */}
//         <div className="grid grid-cols-2 gap-4 p-6">

//           <button
//             onClick={() => setTab("notCleared")}
//             className={`p-4 rounded-xl border ${
//               tab === "notCleared"
//                 ? "border-red-500 bg-red-500/10"
//                 : "border-neutral-700"
//             }`}
//           >
//             <AlertTriangle className="text-red-400" />
//             <p className="text-white mt-2">Not Cleared</p>
//           </button>

//           <button
//             onClick={() => setTab("cleared")}
//             className={`p-4 rounded-xl border ${
//               tab === "cleared"
//                 ? "border-green-500 bg-green-500/10"
//                 : "border-neutral-700"
//             }`}
//           >
//             <CheckCircle2 className="text-green-400" />
//             <p className="text-white mt-2">Cleared</p>
//           </button>

//         </div>

//         {/* ORDERS */}
//         <div className="px-6 pb-4 space-y-3">

//           {orders?.ways?.map((order) => {
//             const status = getStatus(order);

//             return (
//               <div
//                 key={order.orderId}
//                 className="bg-[#1f2937] p-4 rounded-xl flex justify-between items-center"
//               >
//                 <div>
//                   <p className="text-white font-semibold">
//                     Order: {order.orderId}
//                   </p>

//                   <p className="text-gray-400 text-sm">
//                     Menu: {order.menu} | Kilo: {order.kilo}kg | Fee:{" "}
//                     {order.delivey_fees} Ks
//                   </p>
//                 </div>

//                 <span
//                   className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
//                     status,
//                   )}`}
//                 >
//                   {status}
//                 </span>
//               </div>
//             );
//           })}

//         </div>

//         {/* ACTION */}
//         <div className="px-6 pb-6 flex justify-end">
//           <button
//             onClick={handleClearOrders}
//             disabled={clearing}
//             className="bg-indigo-500 px-5 py-2 rounded-xl text-white disabled:opacity-50"
//           >
//             {clearing ? "Clearing..." : "Clear Orders"}
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

// =========================
// FAKE API (inside file)
// =========================
const fakeDriversResponse = {
  success: true,
  data: [
    {
      id: "D002",
      name: "Kyaw",
      email: "kyaw@gmail.com",
      phone: "09458484",
      photo: "D002.png",
      status: "active",
      work_type: "let eat",

      not_cleared_orders: {
        total_way: 3,
        total_delivy_fees: 15000,
        total_kilo: 25,
        ways: [
          {
            orderId: "O001",
            menu: 3,
            delivey_fees: 5000,
            kilo: 10,
          },
          {
            orderId: "O003",
            menu: 2,
            delivey_fees: 4000,
            kilo: 8,
          },
          {
            orderId: "O005",
            menu: 1,
            delivey_fees: 6000,
            kilo: 7,
          },
        ],
      },

      cleared_orders: {
        total_way: 2,
        total_delivy_fees: 9000,
        total_kilo: 18,
        ways: [
          {
            orderId: "O002",
            menu: 5,
            delivey_fees: 2500,
            kilo: 10,
          },
          {
            orderId: "O004",
            menu: 2,
            delivey_fees: 6500,
            kilo: 8,
          },
        ],
      },
    },
  ],
};

// fake API delay
const fetchFakeDrivers = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve(fakeDriversResponse), 700);
  });

// =========================
// MAIN COMPONENT
// =========================
export default function SystemDeliveryManCardsPopup({
  driverId = "D002",
  close,
}) {
  const [driver, setDriver] = useState(null);
  const [tab, setTab] = useState("notCleared");
  const [loading, setLoading] = useState(true);

  // load fake API
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const res = await fetchFakeDrivers();
      const found = res.data.find((d) => d.id === driverId);

      setDriver(found || null);
      setLoading(false);
    };

    load();
  }, [driverId]);

  // =========================
  // LOADING UI
  // =========================
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 text-white">
        Loading...
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60 text-white">
        Driver not found
      </div>
    );
  }

  // =========================
  // DATA SELECTOR
  // =========================
  const data =
    tab === "notCleared" ? driver.not_cleared_orders : driver.cleared_orders;

  const isCleared = tab === "cleared";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0f172a] w-full max-w-2xl rounded-2xl border border-neutral-700 overflow-hidden">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center p-5 border-b border-neutral-800">
          <div>
            <h2 className="text-white text-xl font-bold">{driver.name}</h2>
            <p className="text-gray-400 text-sm">{driver.work_type}</p>
          </div>

          <button
            onClick={close}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-neutral-800 hover:bg-red-500"
          >
            <X className="text-white" size={18} />
          </button>
        </div>

        {/* ================= TABS ================= */}
        <div className="grid grid-cols-2 gap-3 p-5">
          <button
            onClick={() => setTab("notCleared")}
            className={`p-4 rounded-xl border transition ${
              tab === "notCleared"
                ? "border-red-500 bg-red-500/10"
                : "border-neutral-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <AlertTriangle className="text-red-400" />
              <p className="text-white font-medium">Not Cleared</p>
            </div>
          </button>

          <button
            onClick={() => setTab("cleared")}
            className={`p-4 rounded-xl border transition ${
              tab === "cleared"
                ? "border-green-500 bg-green-500/10"
                : "border-neutral-700"
            }`}
          >
            <div className="flex items-center gap-4">
              <CheckCircle2 className="text-green-400" />
              <p className="text-white font-medium">Cleared</p>
            </div>
          </button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="px-5 pb-6 space-y-5">
          {/* TITLE */}
          <div className="flex items-center justify-between">
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

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1f2937] p-3 rounded-xl text-center">
              <p className="text-gray-400 text-xs">Orders</p>
              <p className="text-white font-bold text-lg">{data.total_way}</p>
            </div>

            <div className="bg-[#1f2937] p-3 rounded-xl text-center">
              <p className="text-gray-400 text-xs">Fees</p>
              <p
                className={`font-bold text-lg ${
                  isCleared ? "text-green-400" : "text-red-400"
                }`}
              >
                {data.total_delivy_fees} Ks
              </p>
            </div>

            <div className="bg-[#1f2937] p-3 rounded-xl text-center">
              <p className="text-gray-400 text-xs">KL</p>
              <p className="text-white font-bold text-lg">{data.total_kilo}</p>
            </div>
          </div>

        {/* ORDERS LIST */}
<div className="space-y-3">
  {data.ways?.length === 0 && (
    <div className="text-center text-gray-400 py-6">
      No orders found
    </div>
  )}

  {data.ways.map((order) => (
    <div
      key={order.orderId}
      className="bg-[#1f2937] p-4 rounded-xl flex justify-between items-center hover:bg-[#273449] transition"
    >
      {/* LEFT : colorful values */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-md">
          #{order.orderId}
        </span>

        <span className="text-gray-500">|</span>

        <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-md">
          {order.menu} menus
        </span>

        <span className="text-gray-500">|</span>

        <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-md">
          {order.kilo} Kg
        </span>

        <span className="text-gray-500">|</span>

        <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-md">
          {order.delivey_fees.toLocaleString()} Ks
        </span>
      </div>

      {/* RIGHT : status badge */}
      <span
        className={`text-xs px-3 py-1 rounded-full ${
          isCleared
            ? "bg-green-500/20 text-green-400"
            : "bg-red-500/20 text-red-400"
        }`}
      >
        {isCleared ? "Cleared" : "Pending"}
      </span>
    </div>
  ))}
</div>
        </div>
      </div>
    </div>
  );
}
