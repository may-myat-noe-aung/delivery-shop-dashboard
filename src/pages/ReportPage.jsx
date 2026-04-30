// import React from "react";
// import ReportTable from "../components/Report/ReportTable";

// // ✅ Cookie helper (same as your MenuPage)
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

// export default function ReportPage() {
//   const shopId = getCookie("shopId");

//   if (!shopId) {
//     return (
//       <div className="text-center text-red-500 py-6">
//         Shop ID not found
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <ReportTable shopId={shopId} />
//     </div>
//   );
// }

import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import ReportTable from "../components/Report/ReportTable";

export default function ReportPage() {
  // const navigate = useNavigate();
  const { shopId } = getAuth();

  // if (!shopId) {
  //   navigate("/login");
  //   return null;
  // }
    if (!shopId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className=""> 
      <ReportTable shopId={shopId} />
    </div>
  );
}