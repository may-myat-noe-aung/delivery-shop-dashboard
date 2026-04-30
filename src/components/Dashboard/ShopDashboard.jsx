// import React, { useEffect, useState } from "react";
// import SummaryCards from "./SummaryCards";
// import MenuChart from "./MenuChart";

// export default function ShopDashboard() {
//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white px-6 py-6">
//       <main className="">
//         {/* Summary Cards */}
//         <SummaryCards />
//         <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <MenuChart />
//         </section>
//       </main>
//     </div>
//   );
// }
import SummaryCards from "./SummaryCards";
import MenuChart from "./MenuChart";
import TopMenus from "./TopMenus";

export default function ShopDashboard() {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white py-6 space-y-6">

      <SummaryCards />


      {/* Top Menu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <MenuChart />

        <TopMenus />
      </div>

    </div>
  );
}