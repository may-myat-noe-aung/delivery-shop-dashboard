// import { MdShoppingCart, MdAttachMoney, MdPeople, MdPending } from "react-icons/md";

// export default function Dashboard() {
//   return (
//     <div className="space-y-8">

//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
//           Dashboard Overview
//         </h2>
//         <p className="text-slate-400 text-sm mt-1">
//           Welcome back! Here’s what’s happening in your shop today.
//         </p>
//       </div>

//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

//         {/* Total Orders */}
//         <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
//             <MdShoppingCart size={22} />
//           </div>
//           <div>
//             <p className="text-slate-400 text-sm">Total Orders</p>
//             <h3 className="text-xl font-bold">128</h3>
//           </div>
//         </div>

//         {/* Revenue */}
//         <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
//             <MdAttachMoney size={22} />
//           </div>
//           <div>
//             <p className="text-slate-400 text-sm">Total Revenue</p>
//             <h3 className="text-xl font-bold">2,450,000 Ks</h3>
//           </div>
//         </div>

//         {/* Customers */}
//         <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-cyan-600 flex items-center justify-center">
//             <MdPeople size={22} />
//           </div>
//           <div>
//             <p className="text-slate-400 text-sm">Customers</p>
//             <h3 className="text-xl font-bold">342</h3>
//           </div>
//         </div>

//         {/* Pending Orders */}
//         <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
//           <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center">
//             <MdPending size={22} />
//           </div>
//           <div>
//             <p className="text-slate-400 text-sm">Pending Orders</p>
//             <h3 className="text-xl font-bold">14</h3>
//           </div>
//         </div>

//       </div>

//       {/* Recent Orders Preview */}
//       <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6">
//         <h3 className="text-lg font-semibold mb-4 text-indigo-400">
//           Recent Orders
//         </h3>

//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="text-slate-400 border-b border-slate-800">
//               <tr>
//                 <th className="py-3 text-left">Order ID</th>
//                 <th className="py-3 text-left">Customer</th>
//                 <th className="py-3 text-left">Total</th>
//                 <th className="py-3 text-left">Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               <tr className="border-b border-slate-800 hover:bg-slate-800/40">
//                 <td className="py-3 text-cyan-400 font-medium">O001</td>
//                 <td className="py-3">Zwe</td>
//                 <td className="py-3">20,000 Ks</td>
//                 <td className="py-3">
//                   <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-400">
//                     Pending
//                   </span>
//                 </td>
//               </tr>

//               <tr className="border-b border-slate-800 hover:bg-slate-800/40">
//                 <td className="py-3 text-cyan-400 font-medium">O002</td>
//                 <td className="py-3">Aung</td>
//                 <td className="py-3">35,000 Ks</td>
//                 <td className="py-3">
//                   <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
//                     Confirmed
//                   </span>
//                 </td>
//               </tr>

//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   );
// }

import { useEffect, useState } from "react";
import {
  MdShoppingCart,
  MdAttachMoney,
  MdPeople,
  MdPending,
} from "react-icons/md";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

/* ------------------ Reusable Components ------------------ */

function SummaryCard({ title, value, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6 flex items-center gap-4 cursor-pointer hover:scale-[1.02] transition duration-300"
    >
      <div
        className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm">{title}</p>
        <h3 className="text-xl font-bold">{value}</h3>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/20 text-amber-400",
    Confirmed: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ------------------ Dashboard ------------------ */

export default function Dashboard() {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    customers: 0,
    pending: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Fake API Data (Replace with real API)
    setStats({
      orders: 128,
      revenue: 2450000,
      customers: 342,
      pending: 14,
    });

    setChartData([
      { name: "Mon", revenue: 400000 },
      { name: "Tue", revenue: 320000 },
      { name: "Wed", revenue: 500000 },
      { name: "Thu", revenue: 610000 },
      { name: "Fri", revenue: 720000 },
      { name: "Sat", revenue: 680000 },
      { name: "Sun", revenue: 900000 },
    ]);
  }, []);

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Welcome back! Here’s what’s happening in your shop today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <SummaryCard
          title="Total Orders"
          value={stats.orders}
          icon={<MdShoppingCart size={22} />}
          color="bg-indigo-600"
        />

        <SummaryCard
          title="Total Revenue"
          value={`${stats.revenue.toLocaleString()} Ks`}
          icon={<MdAttachMoney size={22} />}
          color="bg-emerald-600"
        />

        <SummaryCard
          title="Customers"
          value={stats.customers}
          icon={<MdPeople size={22} />}
          color="bg-cyan-600"
        />

        <SummaryCard
          title="Pending Orders"
          value={stats.pending}
          icon={<MdPending size={22} />}
          color="bg-amber-500"
        />
      </div>

      {/* Weekly Revenue Chart */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-400">
          Weekly Revenue
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#1e293b] border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 text-indigo-400">
          Recent Orders
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 text-left">Order ID</th>
                <th className="py-3 text-left">Customer</th>
                <th className="py-3 text-left">Total</th>
                <th className="py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="py-3 text-cyan-400 font-medium">O001</td>
                <td className="py-3">Zwe</td>
                <td className="py-3">20,000 Ks</td>
                <td className="py-3">
                  <StatusBadge status="Pending" />
                </td>
              </tr>

              <tr className="border-b border-slate-800 hover:bg-slate-800/40">
                <td className="py-3 text-cyan-400 font-medium">O002</td>
                <td className="py-3">Aung</td>
                <td className="py-3">35,000 Ks</td>
                <td className="py-3">
                  <StatusBadge status="Confirmed" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}