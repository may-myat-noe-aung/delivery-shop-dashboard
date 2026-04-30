import React from 'react'
import ShopDashboard from '../components/Dashboard/ShopDashboard'
import { getAuth } from '../auth';

const DashboardPage = () => {
    const { shopId } = getAuth();
    if (!shopId) {
    return <Navigate to="/login" replace />;
  }
  return (
 <ShopDashboard/>
  )
}

export default DashboardPage

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