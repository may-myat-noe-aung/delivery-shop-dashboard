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

// export default function RevenueChart({ shopId }) {
//
//   const [type, setType] = useState("hour");
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const API_URL = `https://api.pwezayshops.com/report-revenuecharts-by-shops/${shopId}`;

//   const loadData = async () => {
//     setLoading(true);

//     try {
//       const res = await fetch(API_URL);
//       const json = await res.json();

//       if (json?.success) {
//         setData(json.data[type] || []);
//       } else {
//         setData([]);
//       }
//     } catch (error) {
//       console.error("API Error:", error);
//       setData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (shopId) {
//       loadData();
//     }
//   }, [type, shopId]);

//   return (
//     <div className="col-span-3 xl:col-span-2 bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">

//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-white">
//           Total Revenue
//         </h2>

//         <div className="flex gap-2">
//           {["hour", "weekly", "yearly"].map((item) => (
//             <button
//               key={item}
//               onClick={() => setType(item)}
//               className={`px-3 py-1 rounded-lg text-sm transition ${
//                 type === item
//                   ? "bg-indigo-500 text-white"
//                   : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
//               }`}
//             >
//               {item.charAt(0).toUpperCase() + item.slice(1)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chart */}
//       {loading ? (
//         <div className="h-[290] flex items-center justify-center text-neutral-400 animate-pulse">
//           Loading revenue...
//         </div>
//       ) : (
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" stroke="#333" />

//             <XAxis dataKey="time" stroke="#aaa" />
//             <YAxis stroke="#aaa" />

//             <Tooltip
//               formatter={(value) =>
//                 `Ks ${Number(value).toLocaleString()}`
//               }
//               contentStyle={{
//                 background: "#0f172a",
//                 border: "1px solid #334155",
//                 borderRadius: "10px",
//               }}
//               labelStyle={{ color: "#94a3b8" }}
//             />

//             <Line
//               type="monotone"
//               dataKey="value"
//               stroke="#6366f1"
//               strokeWidth={3}
//               dot={{ r: 4 }}
//               activeDot={{ r: 7 }}
//             />
//           </LineChart>
//         </ResponsiveContainer>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { apiFetch } from "../../api";

export default function RevenueChart({ shopId }) {
  const [type, setType] = useState("hour");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH REVENUE DATA
  // =========================
const loadData = useCallback(async (showLoading = false) => {
  if (!shopId) return;

  if (showLoading) {
    setLoading(true);
  }

  try {
    const res = await apiFetch(
      `https://api.pwezayshops.com/report-revenuecharts-by-shops/${shopId}`
    );

    if (!res?.ok) {
      return;
    }

    const json = await res.json();

    if (json?.success) {
      setData(json.data?.[type] || []);
    }
  } catch (error) {
    console.error("Revenue API Error:", error);
  } finally {
    if (showLoading) {
      setLoading(false);
    }
  }
}, [shopId, type]);

  // =========================
  // LIVE FETCH
  // =========================
useEffect(() => {
  if (!shopId) return;

  // First load only
  loadData(true);

  // Background refresh every 5s
  const interval = setInterval(() => {
    loadData(false);
  }, 5000);

  return () => clearInterval(interval);
}, [shopId, loadData]);

  return (
    <div
      className="
      col-span-3 xl:col-span-2
      bg-[#1a2030]/80
      backdrop-blur-xl
      border border-slate-700
      rounded-3xl
      shadow-2xl
      p-6
    "
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Total Revenue</h2>

        <div className="flex gap-2">
          {["hour", "weekly", "yearly"].map((item) => (
            <button
              key={item}
              onClick={() => setType(item)}
              className={`
                px-3
                py-1
                rounded-lg
                text-sm
                transition

                ${
                  type === item
                    ? "bg-indigo-500 text-white"
                    : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700"
                }
              `}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* CHART AREA */}

      {loading ? (
        <div
          className="
          h-[300px]
          flex
          items-center
          justify-center
          text-neutral-400
          animate-pulse
        "
        >
          Loading revenue...
        </div>
      ) : data.length === 0 ? (
        <div
          className="
          h-[300px]
          flex
          items-center
          justify-center
          text-neutral-400
        "
        >
          No revenue data
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

            <XAxis dataKey="time" stroke="#94a3b8" />

            <YAxis stroke="#94a3b8" />

            <Tooltip
              formatter={(value) => `Ks ${Number(value).toLocaleString()}`}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "10px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#94a3b8",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{
                r: 4,
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
