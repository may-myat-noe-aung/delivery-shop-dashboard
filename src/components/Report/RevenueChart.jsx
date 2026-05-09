// function fetchRevenueData(type) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       if (type === "hour") {
//         resolve([
//           { time: "8 AM", value: 40 },
//           { time: "9 AM", value: 65 },
//           { time: "10 AM", value: 90 },
//           { time: "11 AM", value: 120 },
//           { time: "12 PM", value: 180 },
//           { time: "1 PM", value: 160 },
//           { time: "2 PM", value: 140 },
//           { time: "3 PM", value: 110 },
//           { time: "4 PM", value: 95 },
//           { time: "5 PM", value: 130 },
//           { time: "6 PM", value: 190 },
//           { time: "7 PM", value: 250 },
//           { time: "8 PM", value: 310 },
//         ]);
//       }

//       if (type === "weekly") {
//         resolve([
//           { time: "Mon", value: 1200 },
//           { time: "Tue", value: 1500 },
//           { time: "Wed", value: 1800 },
//           { time: "Thu", value: 2200 },
//           { time: "Fri", value: 2600 },
//           { time: "Sat", value: 3200 },
//           { time: "Sun", value: 3000 },
//         ]);
//       }

//       if (type === "monthly") {
//         resolve([
//           { time: "Week 1", value: 8000 },
//           { time: "Week 2", value: 12000 },
//           { time: "Week 3", value: 15000 },
//           { time: "Week 4", value: 17000 },
//         ]);
//       }
//     }, 700);
//   });
// }

// import React, { useEffect, useState } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// export default function RevenueChart() {
//   const [type, setType] = useState("hour");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const loadData = async (selectedType) => {
//     setLoading(true);
//     try {
//       const res = await fetchRevenueData(selectedType);
//       setData(res);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadData(type);
//   }, [type]);

//   return (
//     <div className="col-span-2 bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Total Revenue</h2>

//         <div className="flex gap-2">
//           {["hour", "weekly", "monthly"].map((item) => (
//             <button
//               key={item}
//               onClick={() => setType(item)}
//               className={`px-3 py-1 rounded-lg text-sm ${
//                 type === item
//                   ? "bg-indigo-500 text-white"
//                   : "bg-neutral-800 text-neutral-400"
//               }`}
//             >
//               {item.charAt(0).toUpperCase() + item.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {loading ? (
//         <div className="h-64 flex items-center justify-center text-neutral-400 animate-pulse">
//           Loading revenue...
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={280}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#333" />
//             <XAxis dataKey="time" stroke="#aaa" />
//             <YAxis stroke="#aaa" />
//             <Tooltip
//               formatter={(value) => `$${value}`}
//               contentStyle={{
//                 background: "#0f172a",
//                 border: "1px solid #334155",
//                 borderRadius: "8px",
//               }}
//               labelStyle={{ color: "#94a3b8" }}
//             />
//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#6366f1"
//               strokeWidth={3}
//               dot={{ r: 4 }}
//               activeDot={{ r: 6 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const API_URL =
  "http://38.60.244.137:3000/report-revenuecharts-by-shops/S001";

export default function RevenueChart() {
  const [type, setType] = useState("hour");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);

    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      if (json?.success) {
        setData(json.data[type] || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("API Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [type]);

  return (
    <div className="col-span-2 bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Total Revenue</h2>

        <div className="flex gap-2">
          {["hour", "weekly", "yearly"].map((item) => (
            <button
              key={item}
              onClick={() => setType(item)}
              className={`px-3 py-1 rounded-lg text-sm ${
                type === item
                  ? "bg-indigo-500 text-white"
                  : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-neutral-400 animate-pulse">
          Loading revenue...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip
              formatter={(value) => `Ks ${value.toLocaleString()}`}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}