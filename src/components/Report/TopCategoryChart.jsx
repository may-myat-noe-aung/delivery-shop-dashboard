// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // 🎨 Colors
// const COLORS = [
//   "#6366f1",
//   "#22c55e",
//   "#f97316",
//   "#ef4444",
//   "#eab308",
//   "#06b6d4",
//   "#a855f7",
//   "#84cc16",
//   "#f43f5e",
//   "#14b8a6",
// ];

// export default function CategoryPieChart({ shopId }) {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API_URL = `https://api.pwezayshops.com/report-categories-by-shops/${shopId}`;

//   const loadData = async () => {
//     setLoading(true);

//     try {
//       const res = await fetch(API_URL);
//       const json = await res.json();

//       if (json?.success) {
//         const formatted = Object.entries(json.data || {}).map(
//           ([key, value]) => ({
//             name: key,
//             value,
//           })
//         );

//         formatted.sort((a, b) => b.value - a.value);

//         setData(formatted);
//       } else {
//         setData([]);
//       }
//     } catch (err) {
//       console.error("Category API Error:", err);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (shopId) {
//       loadData();
//     }
//   }, [shopId]);

//   return (
//     <div className="bg-[#1a2030]/80 border border-slate-700 rounded-3xl p-6 shadow-2xl">

//       {/* Title */}
//       <h2 className="text-xl font-semibold mb-4">
//         Top Food Categories
//       </h2>

//       {/* Chart */}
//       {loading ? (
//         <div className="h-64 flex items-center justify-center text-gray-400 animate-pulse">
//           Loading chart...
//         </div>
//       ) : data.length === 0 ? (
//         <div className="h-64 flex items-center justify-center text-gray-400">
//           No category data
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={320}>
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={120}
//               label
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={index}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>

//             <Tooltip
//               formatter={(value) => `${value} orders`}
//               contentStyle={{
//                 background: "#0f172a",
//                 border: "1px solid #334155",
//                 borderRadius: "8px",
//               }}
//               labelStyle={{ color: "#94a3b8" }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Utensils } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#84CC16",
  "#F97316",
];

export default function CategoryPieChart({ shopId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shopId) return;

    const fetchData = async (showLoading = false) => {
      try {
        if (showLoading) {
          setLoading(true);
        }

        const res = await fetch(
          `https://api.pwezayshops.com/report-categories-by-shops/${shopId}`,
        );

        const json = await res.json();

        if (json.success && json.data) {
          const chartData = Object.entries(json.data).map(
            ([category, total]) => ({
              category,
              total,
            }),
          );

          setData(chartData);
        } else {
          setData([]);
        }
      } catch (err) {
        console.log("Category chart error:", err);
        setData([]);
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    };

    // First load (show spinner)
    fetchData(true);

    // Refresh every 5 seconds (no spinner)
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [shopId]);

  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-xl">Category Sales</h3>
        <Utensils className="h-4 w-4 text-neutral-400" />
      </div>

      <p className="text-sm text-neutral-400 mb-2">
        Orders by category this month
      </p>

      <div className="h-[295px]">
        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
            No category data
          </div>
        ) : (
          <>
            <div className="2xl:h-[240px] h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {data.map((item, index) => (
                <div
                  key={item.category}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-xs text-slate-300 capitalize">
                    {item.category}
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {item.total}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
