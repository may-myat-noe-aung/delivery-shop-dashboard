

// import React, { useEffect, useState } from "react";
// import OrdersTable from "../components/OrdersTable";
// import SummaryCards from "../components/SummaryCards";

// export default function OrdersConfirm() {
//   const [shopId, setShopId] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [orders, setOrders] = useState([]); // Track orders here for summary

  

//   useEffect(() => {
//     const fetchShops = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const res = await fetch("http://38.60.244.137:3000/shops");
//         const data = await res.json();

//         if (data.length > 0) {
//           const activeShop = data.find((shop) => shop.status === "active");
//           setShopId(activeShop ? activeShop.id : data[0].id);
//         } else {
//           setError("No shops found.");
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to fetch shops.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchShops();
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white px-6 py-6">
//       {loading ? (
//         <div className="text-center text-slate-400 py-10">Loading shops...</div>
//       ) : error ? (
//         <div className="text-center text-red-500 py-10">{error}</div>
//       ) : (
//         <>
//           {/* --- Summary Cards instead of Page Header --- */}
//           <SummaryCards orders={orders} />

//           {/* Orders Table */}
//           <div className="">
//             <OrdersTable shopId={shopId} setOrders={setOrders} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
// src/pages/OrdersConfirm.jsx
import React, { useState } from "react";
import OrdersTable from "../components/OrdersTable";
import SummaryCards from "../components/SummaryCards";

// --- cookie helper ---
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export default function OrdersConfirm() {
  // Orders state for summary cards
  const [orders, setOrders] = useState([]);

  // Get shopId directly from cookie
  const shopId = getCookie("shopId");

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-6 py-6">
      {!shopId ? (
        <div className="text-center text-red-500 py-10">
          Shop ID not found. Please login again.
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <SummaryCards orders={orders} />

          {/* Orders Table */}
          <div className="mt-6">
            <OrdersTable shopId={shopId} />
          </div>
        </>
      )}
    </div>
  );
}