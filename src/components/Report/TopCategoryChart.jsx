
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
  const token = localStorage.getItem("shopToken");
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
          `https://api.pwezayshops.com/report-categories-by-shops/${shopId}`,{
            headers: {
              Authorization: `MSHteam ${token}`,
            }
          }
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
