// import React, { useState } from "react";
// import ProfileTab from "../components/Setting/ProfileTab";
// import AccountTab from "../components/Setting/AccountTab";
// import DeliveryTab from "../components/Setting/DeliveryTab";
// import PaymentTab from "../components/Setting/PaymentTab";

// const tabs = [
//   { key: "profile", label: "Profile" },
//   { key: "account", label: "Account" },
//   { key: "delivery", label: "Delivery" },
//   { key: "payment", label: "Payment" },
// ];

// export default function SettingsPage1() {
//   const [active, setActive] = useState("profile");

//   return (
//     <div className="min-h-screen bg-[#0b1220] text-white">

//       {/* 🔥 TOP BAR */}
//       <div className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800">

//         <div className="max-w-6xl mx-auto px-6 py-4">


//           {/* TABS */}
//           <div className="flex gap-6 overflow-x-auto">

//             {tabs.map((tab) => (
//               <button
//                 key={tab.key}
//                 onClick={() => setActive(tab.key)}
//                 className={`pb-2 text-sm font-medium transition border-b-2
//                   ${
//                     active === tab.key
//                       ? "border-blue-500 text-white"
//                       : "border-transparent text-gray-400 hover:text-white"
//                   }
//                 `}
//               >
//                 {tab.label}
//               </button>
//             ))}

//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="max-w-4xl mx-auto p-6">

//         {active === "profile" && <ProfileTab />}
//         {active === "account" && <AccountTab />}
//         {active === "delivery" && <DeliveryTab />}
//         {active === "payment" && <PaymentTab />}

//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import ShopAccountSettings from "../components/Setting/ShopAccountSettings";

export default function SettingsPageOne() {
  const navigate = useNavigate();
  const { shopId } = getAuth();

  if (!shopId) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6"> 
      <ShopAccountSettings shopId={shopId} />
    </div>
  );
}