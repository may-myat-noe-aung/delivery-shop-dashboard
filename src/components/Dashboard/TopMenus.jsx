import React, { useEffect, useState } from "react";
import { Utensils } from "lucide-react";

// ✅ Fake API
function fetchTopMenus() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Fried Rice", category: "Main Dish", orders: 120 },
        { name: "Burger", category: "Fast Food", orders: 95 },
        { name: "Milk Tea", category: "Drink", orders: 150 },
        { name: "Pizza", category: "Fast Food", orders: 80 },
        { name: "Noodles", category: "Main Dish", orders: 110 },
      ]);
    }, 700);
  });
}

export default function TopMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMenus = async () => {
      try {
        const res = await fetchTopMenus();
        setMenus(res);
      } catch (err) {
        setError("Failed to load menus");
      } finally {
        setLoading(false);
      }
    };

    loadMenus();
  }, []);

  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-xl">Top 5 Menus</h3>
        <Utensils className="h-4 w-4 text-neutral-400" />
      </div>

      {/* List */}
      <div className="space-y-3 h-[280] overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-neutral-800">
        
        {loading ? (
          <div className="text-neutral-500 text-sm text-center mt-4">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center mt-4">
            {error}
          </div>
        ) : menus.length > 0 ? (
          menus.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-neutral-800 pb-2 last:border-none hover:bg-neutral-900/50 transition-colors rounded-md px-2"
            >
              {/* Left */}
              <div>
                <div className="font-medium">{m.name}</div>
                <div className="text-xs text-neutral-500">
                  {m.category}
                </div>
              </div>

              {/* Right */}
              <div className="text-sm text-indigo-400 font-semibold">
                {m.orders} orders
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