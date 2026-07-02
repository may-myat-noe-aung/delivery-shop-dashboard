
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";

export default function TopCustomers({ shopId }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(
          `https://api.pwezayshops.com/top5-customers-by-shops/${shopId}`
        );

        const json = await res.json();

        if (json.success) {
          setCustomers(json.customers || []);
        } else {
          setError("Failed to load customers");
        }
      } catch (err) {
        setError("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    if (!shopId) return;

    fetchCustomers();

    const interval = setInterval(() => {
      fetchCustomers();
    }, 3000);

    return () => clearInterval(interval);
  }, [shopId]);

  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-xl">Top 5 Customers</h3>
        <User className="h-4 w-4 text-neutral-400" />
      </div>

      {/* List */}
      <div className="space-y-3 h-[285px] overflow-y-auto">

        {loading ? (
          <div className="text-neutral-500 text-sm text-center mt-4">
            Loading...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm text-center mt-4">
            {error}
          </div>
        ) : customers.length > 0 ? (
          customers.map((c, index) => (
            
            <div
              key={index}
              className=" flex items-center justify-between p-2 rounded-lg border-b border-slate-800 hover:bg-white/[0.03] transition-all duration-200"
            >

              {/* RANK (your UI style) */}
              <td className="pr-2">
                <div
                  className={`h-10 w-10 rounded-2xl flex items-center justify-center font-semibold text-sm ${
                    index === 0
                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      : index === 1
                      ? "bg-slate-400/10 text-slate-300 border border-slate-500/20"
                      : index === 2
                      ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  }`}
                >
                  #{index + 1}
                </div>
              </td>

              {/* NAME */}
              <div className="flex-1 font-medium text-white">
                {c.name}
              </div>

              {/* MENU */}
              <div className="flex-1 text-center">
                <span className={`px-2 py-1 rounded-md text-xs ${
                  c.most_order_menu
                    ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    : "bg-neutral-700/20 text-neutral-400"
                }`}>
                  {c.most_order_menu || "No menu"}
                </span>
              </div>

              {/* ORDERS */}
              <div className="text-right w-24">
                <span className="text-indigo-400 font-semibold">
                  {c.total_orders} orders
                </span>
              </div>

            </div>
          ))
        ) : (
          <div className="text-neutral-500 text-sm text-center mt-4">
            No customer data.
          </div>
        )}
      </div>
    </div>
  );
}