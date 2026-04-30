

import React from "react";
import { Navigate } from "react-router-dom"; // ✅ ADD THIS
import AddDeliveryMan from "../components/Delivery/AddDeliveryMan";
import DeliveryToggle from "../components/Delivery/DeliveryToggle";
import { getAuth } from "../utils/auth";

const DeliveryPage = () => {
  const { shopId } = getAuth();

  // ✅ ONLY CHANGE: redirect instead of showing message
  if (!shopId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="">
      <DeliveryToggle shopId={shopId} />
      <AddDeliveryMan shopId={shopId} />
    </section>
  );
};

export default DeliveryPage;
// import React from "react";
// import { Navigate } from "react-router-dom";
// import AddDeliveryMan from "../components/Delivery/AddDeliveryMan";
// import DeliveryToggle from "../components/Delivery/DeliveryToggle";

// // ✅ cookie helper
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

// const DeliveryPage = () => {
//   const shopId = getCookie("shopId"); // ✅ direct cookie use

//   // 🔐 auth check
//   if (!shopId) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <section>
//       <DeliveryToggle shopId={shopId} />
//       <AddDeliveryMan shopId={shopId} />
//     </section>
//   );
// };

// export default DeliveryPage;