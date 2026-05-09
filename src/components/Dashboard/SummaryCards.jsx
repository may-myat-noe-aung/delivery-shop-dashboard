import React, { useEffect, useState } from "react";
import {
  Utensils,
  DollarSign,
  CreditCard,
  Truck,
  TrendingUp,
} from "lucide-react";

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-600 p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />

      <div className="relative">
        <div className="flex items-center justify-between text-lg text-neutral-100 mb-2">
          <span>{title}</span>
          {icon}
        </div>

        <div className="text-xl font-semibold text-white">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function SummaryCards({ shopId }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch(
          `http://38.60.244.137:3000/dashboard-summaries-by-shops/${shopId}`
        );

        const result = await response.json();

        console.log(result);

        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) {
      fetchSummary();
    }
  }, [shopId]);

  if (loading) {
    return (
      <div className="text-center text-white py-10">
        Loading...
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

      <SummaryCard
        title="Total Menu"
        value={data.today_menu_count || 0}
        icon={<Utensils className="w-5 h-5" />}
        color="from-indigo-400/50 to-transparent"
      />

      <SummaryCard
        title="Total Income"
        value={`${(data.today_amount || 0).toLocaleString()} Ks`}
        icon={<DollarSign className="w-5 h-5" />}
        color="from-emerald-400/50 to-transparent"
      />

      <SummaryCard
        title="Total Users"
        value={data.today_users_count || 0}
        icon={<CreditCard className="w-5 h-5" />}
        color="from-sky-400/50 to-transparent"
      />

      <SummaryCard
        title="Delivery Cost"
        value={`${(data.today_delivery_fees || 0).toLocaleString()} Ks`}
        icon={<Truck className="w-5 h-5" />}
        color="from-rose-400/50 to-transparent"
      />

      <SummaryCard
        title="Profit (အမြတ်)"
        value={`${(data.today_profits || 0).toLocaleString()} Ks`}
        icon={<TrendingUp className="w-5 h-5" />}
        color="from-yellow-400/50 to-transparent"
      />

    </section>
  );
}