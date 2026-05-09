import React from "react";
import ShopDashboard from "../components/Dashboard/ShopDashboard";
import { getAuth } from "../auth";
import SummaryCards from "../components/Dashboard/SummaryCards";

const DashboardPage = () => {
  const { shopId } = getAuth();
  if (!shopId) {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="h-screen overflow-hidden bg-[#0f172a] text-white space-y-6">
      <SummaryCards shopId={shopId} />
      <ShopDashboard shopId={shopId} />
    </div>
  );
};

export default DashboardPage;

// import React from "react";
// import { Navigate } from "react-router-dom";
// import ShopDashboard from "../components/Dashboard/ShopDashboard";

// // ✅ cookie helper
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

// const DashboardPage = () => {
//   const shopId = getCookie("shopId"); // ✅ direct cookie

//   // 🔐 auth check
//   if (!shopId) {
//     return <Navigate to="/login" replace />;
//   }

//   return <ShopDashboard />;
// };

// export default DashboardPage;
