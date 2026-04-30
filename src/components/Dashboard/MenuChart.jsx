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

// ✅ Fake API
function fetchChartData(type) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (type === "hour") {
        resolve([
          { time: "8 AM", value: 5 },
          { time: "9 AM", value: 8 },
          { time: "10 AM", value: 12 },
          { time: "11 AM", value: 15 },
          { time: "12 PM", value: 20 },
          { time: "1 PM", value: 18 },
          { time: "2 PM", value: 14 },
          { time: "3 PM", value: 10 },
          { time: "4 PM", value: 9 },
          { time: "5 PM", value: 11 },
          { time: "6 PM", value: 16 },
          { time: "7 PM", value: 22 },
          { time: "8 PM", value: 25 },
        ]);
      }

      if (type === "weekly") {
        resolve([
          { time: "Mon", value: 120 },
          { time: "Tue", value: 150 },
          { time: "Wed", value: 180 },
          { time: "Thu", value: 200 },
          { time: "Fri", value: 250 },
          { time: "Sat", value: 300 },
          { time: "Sun", value: 280 },
        ]);
      }

      if (type === "monthly") {
        resolve([
          { time: "Week 1", value: 800 },
          { time: "Week 2", value: 1200 },
          { time: "Week 3", value: 1500 },
          { time: "Week 4", value: 1700 },
        ]);
      }
    });
  });
}

export default function MenuChart() {
  const [type, setType] = useState("hour"); // hour | weekly | monthly
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (selectedType) => {
    setLoading(true);
    const res = await fetchChartData(selectedType);
    setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData(type);
  }, [type]);

  return (
    <div className=" col-span-2 bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Menu Orders Chart</h2>

        {/* Filter Buttons */}
        <div className="flex gap-2">
          {["hour", "weekly", "monthly"].map((item) => (
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
      {loading ? (
        <div className="h-64 flex items-center justify-center text-neutral-400">
          Loading chart...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
