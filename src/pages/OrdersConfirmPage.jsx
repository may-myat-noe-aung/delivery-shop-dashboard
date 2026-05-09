
// import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
// import SummaryCards from "../components/OrderConfirm/SummaryCards";
// import OrdersTable from "../components/OrderConfirm/OrdersTable";

// // --- cookie helper ---
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

// export default function OrdersConfirm() {
//   const [orders, setOrders] = useState([]);

//   const shopId = getCookie("shopId");

//   // ✅ redirect instead of showing message
//   if (!shopId) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white  py-6">
//       {/* Summary Cards */}
//       <SummaryCards orders={orders} />

//       {/* Orders Table */}
//       <div className="mt-6">
//         <OrdersTable shopId={shopId} />
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import SummaryCards from "../components/OrderConfirm/SummaryCards";
import OrdersTable from "../components/OrderConfirm/OrdersTable";
import { getAuth } from "../utils/auth"; // ✅ add this

export default function OrdersConfirm() {
  const [orders, setOrders] = useState([]);

  const { shopId } = getAuth(); // ✅ use helper

  // redirect if no shopId
  if (!shopId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className=" bg-[#0f172a] text-white ">
      <SummaryCards orders={orders} />

      <div className="mt-6">
        <OrdersTable shopId={shopId} />
      </div>
    </div>
  );
}