// import React, { useEffect, useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// // 🎯 Fake API داخل component
// function fetchCategoryData() {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve({
//         success: true,
//         data: {
//           snack: 120,
//           alcoholic: 50,
//           breakfast: 90,
//           cake: 70,
//           coffee: 150,
//           drink: 110,
//           fastfood: 200,
//           lunch: 180,
//           morning: 60,
//           sweets: 95,
//         },
//       });
//     }, 800);
//   });
// }

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

// export default function CategoryPieChart() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadData = async () => {
//     setLoading(true);

//     try {
//       const json = await fetchCategoryData();

//       if (json?.success) {
//         const formatted = Object.entries(json.data).map(
//           ([key, value]) => ({
//             name: key,
//             value,
//           })
//         );

//         // sort top category first
//         formatted.sort((a, b) => b.value - a.value);

//         setData(formatted);
//       } else {
//         setData([]);
//       }
//     } catch (err) {
//       console.error(err);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData();
//   }, []);

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
//                   key={`cell-${index}`}
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
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// 🎨 Colors
const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f97316",
  "#ef4444",
  "#eab308",
  "#06b6d4",
  "#a855f7",
  "#84cc16",
  "#f43f5e",
  "#14b8a6",
];

const API_URL =
  "http://38.60.244.137:3000/report-categories-by-shops/S001";

export default function CategoryPieChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json?.success) {
        // 🔥 Convert object → array for recharts
        const formatted = Object.entries(json.data || {}).map(
          ([key, value]) => ({
            name: key,
            value,
          })
        );

        // 🔥 Sort highest category first
        formatted.sort((a, b) => b.value - a.value);

        setData(formatted);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Category API Error:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-[#1a2030]/80 border border-slate-700 rounded-3xl p-6 shadow-2xl">
      
      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        Top Food Categories
      </h2>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-400 animate-pulse">
          Loading chart...
        </div>
      ) : data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No category data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => `${value} orders`}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}