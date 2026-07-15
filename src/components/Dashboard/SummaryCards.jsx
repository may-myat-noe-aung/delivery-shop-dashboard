
import React, { useEffect, useState } from "react";
import {
  Utensils,
  Users,
  DollarSign,
  Truck,
  TrendingUp,
} from "lucide-react";

/* ================= CARD ================= */
function DashboardCard({ title, value, icon, gradient, iconBg }) {
  return (
    <div
      className="
        relative overflow-hidden rounded-3xl border border-white/10
        bg-white/5 backdrop-blur-xl
        p-3 lg:p-4 xl:p-5 2xl:p-6
        transition-all duration-300 hover:scale-[1.02]
      "
    >
      <div
        className={`absolute inset-0 opacity-20 bg-gradient-to-br ${gradient}`}
      />

      <div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${iconBg} opacity-20`}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-[10px] lg:text-[11px] xl:text-xs 2xl:text-sm text-slate-300">
            {title}
          </p>

          <h2 className="mt-1 font-bold text-white text-sm lg:text-base xl:text-lg 2xl:text-xl">
            {value}
          </h2>
        </div>

        <div
          className={`
            flex items-center justify-center border border-white/10 rounded-xl
            ${iconBg}
            w-8 h-8
            lg:w-9 lg:h-9
            xl:w-10 xl:h-10
            2xl:w-12 2xl:h-12
          `}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================= LOADING ================= */
function LoadingCard() {
  return (
    <div className="h-[120px] rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
  );
}

/* ================= MAIN ================= */
export default function ShopSummary({ shopId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://api.pwezayshops.com/dashboard-summaries-by-shops/${shopId}`
        );

        const result = await res.json();

        if (result.success) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [shopId]);

  if (loading || !data) {
    return (
      <section className="grid grid-cols-5 gap-3 lg:gap-4 xl:gap-5 mb-5">
        {[...Array(5)].map((_, i) => (
          <LoadingCard key={i} />
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-5 gap-3 lg:gap-4 xl:gap-5 mb-5">
      {/* MENU */}
      <DashboardCard
        title="Today's Menu"
        value={data.today_menu_count}
        icon={
          <Utensils className="text-indigo-300 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
        }
        gradient="from-indigo-500 to-transparent"
        iconBg="bg-indigo-500/20"
      />

      {/* USERS */}
      <DashboardCard
        title="Today's Users"
        value={data.today_users_count}
        icon={
          <Users className="text-emerald-300 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
        }
        gradient="from-emerald-500 to-transparent"
        iconBg="bg-emerald-500/20"
      />

      {/* AMOUNT */}
      <DashboardCard
        title="Today's Amount"
        value={`${Number(data.today_amount || 0).toLocaleString()} Ks`}
        icon={
          <DollarSign className="text-sky-300 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
        }
        gradient="from-sky-500 to-transparent"
        iconBg="bg-sky-500/20"
      />

      {/* DELIVERY FEES */}
      <DashboardCard
        title="
Today's Delivery Fees"
        value={`${Number(
          data.today_delivery_fees || 0
        ).toLocaleString()} Ks`}
        icon={
          <Truck className="text-rose-300 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
        }
        gradient="from-rose-500 to-transparent"
        iconBg="bg-rose-500/20"
      />

      {/* PROFITS */}
      <DashboardCard
        title="Today's Profit"
        value={`${Number(data.today_profits || 0).toLocaleString()} Ks`}
        icon={
          <TrendingUp className="text-yellow-300 w-3 h-3 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
        }
        gradient="from-yellow-500 to-transparent"
        iconBg="bg-yellow-500/20"
      />
    </section>
  );
}