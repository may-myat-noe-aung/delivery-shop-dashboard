// import React from "react";
// import ShopDashboard from "../components/Dashboard/ShopDashboard";
// import { getAuth } from "../auth";
// import SummaryCards from "../components/Dashboard/SummaryCards";
// import LocationInput from "../components/Dashboard/LocationInput";

// const DashboardPage = () => {
//   const { shopId } = getAuth();
//   if (!shopId) {
//     return <Navigate to="/login" replace />;
//   }
//   return (
//     <div className=" bg-[#0f172a] text-white space-y-6 ">
//       <SummaryCards shopId={shopId} />
//       <ShopDashboard shopId={shopId} />

//       {/* <LocationInput/> */}
//     </div>
//   );
// };

// export default DashboardPage;
import React from "react";
import { Navigate } from "react-router-dom";

import ShopDashboard from "../components/Dashboard/ShopDashboard";
import SummaryCards from "../components/Dashboard/SummaryCards";
// import LocationInput from "../components/Dashboard/LocationInput";

import { getAuth } from "../auth";

const DashboardPage = () => {
  const { shopId, isLoggedIn } = getAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-[#0f172a] text-white space-y-6">
      <SummaryCards shopId={shopId} />
      <ShopDashboard shopId={shopId} />

      {/* <LocationInput /> */}
    </div>
  );
};

export default DashboardPage;
