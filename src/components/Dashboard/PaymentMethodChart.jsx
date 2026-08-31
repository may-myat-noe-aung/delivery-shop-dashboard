import React, { useEffect, useState } from "react";
import { Wallet } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { apiFetch } from "../../api";

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

export default function PaymentMethodChart({ shopId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (!shopId) return;

  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);

  //       const res = await fetch(
  //         `https://api.pwezayshops.com/payments-chart-shops/${shopId}`
  //       );

  //       const json = await res.json();

  //       if (json.success) {
  //         setData(json.data || []);
  //       } else {
  //         setData([]);
  //       }
  //     } catch (err) {
  //       console.log("Payment chart error:", err);
  //       setData([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [shopId]);

  const fetchData = async (showLoading = false) => {
  try {
    if (showLoading) {
      setLoading(true);
    }

    const res = await apiFetch(
      `https://api.pwezayshops.com/payments-chart-shops/${shopId}`,
    );
if (!res) return;
    const json = await res.json();

    if (json.success) {
      setData(json.data || []);
    } else {
      setData([]);
    }
  } catch (err) {
    console.log("Payment chart error:", err);
    setData([]);
  } finally {
    if (showLoading) {
      setLoading(false);
    }
  }
};

useEffect(() => {
  if (!shopId) return;

  // First load (show spinner)
  fetchData(true);

  // Refresh every 5 seconds (no spinner)
  const interval = setInterval(() => {
    fetchData();
  }, 5000);

  return () => clearInterval(interval);
}, [shopId]);



  const total = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-xl ">
          Payment Methods
        </h3>
        <Wallet className="h-4 w-4 text-neutral-400" />
      </div>
       <p className="text-sm text-neutral-400 ">
          Most Used Payment Methods This Month
      </p>

      <div className="h-[295px]">
        {/* LOADING */}
        {loading ? (
          <div className="h-[240px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* PIE CHART */}
            <div className="2xl:h-[240px] h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="total"
                    nameKey="method"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.method}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>

                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* ONE ROW LEGEND */}
            <div className="flex flex-wrap justify-center gap-3 mt-2">
              {data.slice(0, 3).map((item, index) => (
                <div
                  key={item.method}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="text-xs text-slate-300">
                    {item.method}
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