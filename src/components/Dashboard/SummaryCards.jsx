import React, { useEffect, useState } from "react";
import {
  Utensils,
  DollarSign,
  CreditCard,
  Truck,
  TrendingUp,
} from "lucide-react";

// ✅ Fake API
function fetchDashboardSummary() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalMenu: 120,
        totalIncome: 2500000,
        totalWays: 320,
        deliveryCost: 150000,
        profit: 2350000,
      });
    });
  });
}

// ✅ Reusable Card Component
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

// ✅ Main Component
export default function SummaryCards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchDashboardSummary();
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-neutral-400 py-10">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load data.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

      {/* Total Menu */}
      <SummaryCard
        title="Total Menu"
        value={data.totalMenu}
        icon={<Utensils className="w-5 h-5" />}
        color="from-indigo-400/50 to-transparent"
      />

      {/* Total Income */}
      <SummaryCard
        title="Total Income"
        value={`${data.totalIncome.toLocaleString()} Ks`}
        icon={<DollarSign className="w-5 h-5" />}
        color="from-emerald-400/50 to-transparent"
      />

      {/* Total Ways */}
      <SummaryCard
        title="Total Ways"
        value={data.totalWays}
        icon={<CreditCard className="w-5 h-5" />}
        color="from-sky-400/50 to-transparent"
      />

      {/* Delivery Cost */}
      <SummaryCard
        title="Delivery Cost"
        value={`${data.deliveryCost.toLocaleString()} Ks`}
        icon={<Truck className="w-5 h-5" />}
        color="from-rose-400/50 to-transparent"
      />

      {/* Profit (အမြတ်) */}
      <SummaryCard
        title="Profit (အမြတ်)"
        value={`${data.profit.toLocaleString()} Ks`}
        icon={<TrendingUp className="w-5 h-5" />}
        color="from-yellow-400/50 to-transparent"
      />

    </section>
  );
}