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
import { apiFetch } from "../../api";

export default function MenuChart({ shopId }) {
  const [type, setType] = useState("hour");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async (selectedType) => {
    try {
      const res = await apiFetch(
        `https://api.pwezayshops.com/values-chart-by-shops/${shopId}`,
    
      );
if (!res) return;
      const json = await res.json();

      if (json.success) {
        setData(json.data[selectedType] || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 LIVE AUTO REFRESH (every 1000ms)
  useEffect(() => {
    if (!shopId) return;

    const interval = setInterval(() => {
      fetchChartData(type);
    }, 1000);

    // initial fetch immediately
    fetchChartData(type);

    return () => clearInterval(interval);
  }, [type, shopId]);

  return (
    <div className="col-span-2 bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Orders Chart</h2>

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
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}

      <div className="h-[300px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-neutral-400">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />

              <XAxis dataKey="time" stroke="#aaa" />

              <YAxis stroke="#aaa" tickFormatter={(value) => ` ${value}`} />

              <Tooltip
                formatter={(value) => [` ${value}`, "Orders"]}
                contentStyle={{
                  backgroundColor: "#111827",
                  border: "1px solid #374151",
                  borderRadius: "10px",
                }}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke="#6366f1"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
