
import React, { useEffect, useState } from "react";
import { Utensils } from "lucide-react";

export default function TopMenus({ shopId }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenus = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.pwezayshops.com/top5-less-menu-by-shops/${shopId}`
        );

        const json = await res.json();

        if (json.success) {
          setMenus(json.data || []);
        } else {
          setError("Failed to load menus");
        }
      } catch (err) {
        setError("Failed to load menus");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) loadMenus();
  }, [shopId]);

  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-xl text-red-400">Less 5 Menus</h3>
        <Utensils className="h-4 w-4 text-neutral-400" />
      </div>
       <p className="text-sm text-neutral-400 ">
   Lowest selling menus this month
      </p>

      {/* List */}
      <div className=" h-[295px] custom-scrollbar overflow-y-auto">

        {loading ? (
          <div className="text-neutral-500 text-sm text-center mt-4">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center ">
            {error}
          </div>
        ) : menus.length > 0 ? (
          menus.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg border-b border-slate-800 hover:bg-white/[0.03] transition-all duration-200"
            >

              {/* RANK */}
              <div className="text-indigo-400 font-bold w-12">
                #{i + 1}
              </div>

              {/* NAME */}
              <div className="flex-1 text-white font-medium text-sm">
                {m.name}
              </div>

              {/* CATEGORY */}
              <div className="flex-1 text-center">
                <span className="px-2 py-1 rounded-md text-xs bg-neutral-700/20 text-neutral-300 border border-neutral-700">
                  {m.category}
                </span>
              </div>

              {/* ORDERS */}
              <div className="text-right w-24">
                <span className="text-indigo-400 font-semibold">
                  {m.orders} orders
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="text-neutral-500 text-sm text-center mt-4">
            No menu data.
          </div>
        )}
      </div>
    </div>
  );
}