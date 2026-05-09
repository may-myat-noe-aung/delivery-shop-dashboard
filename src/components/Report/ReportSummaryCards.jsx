import React, { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingBag, DollarSign, Truck, Bike } from "lucide-react";

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-600 p-4 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />

      <div className="relative ">
        <div>
          <p className="flex items-center justify-between text-lg text-neutral-100 mb-2">
            <span>{title}</span>
            {icon}
          </p>

          <h2 className="text-xl font-semibold text-white">{value}</h2>
        </div>
      </div>
    </div>
  );
}

export default function ReportSummaryCards({ shopId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get(
          `http://38.60.244.137:3000/report-shops-summaries/${shopId}`,
          //   {
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //     },
          //   }
        );

        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [shopId]);

  if (loading) {
    return (
      <div className="text-center text-neutral-400 py-10">
        Loading summary...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load summary.
      </div>
    );
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        title="Total Orders"
        value={data.total_orders}
        icon={<ShoppingBag className="w-5 h-5" />}
        color="from-indigo-400/50 to-transparent"
      />

      <SummaryCard
        title="Total Amount"
        value={`${Number(data.total_amount).toLocaleString()} Ks`}
        icon={<DollarSign className="w-5 h-5" />}
        color="from-emerald-400/50 to-transparent"
      />

      <SummaryCard
        title="Total Shop Delivery"
        value={data.total_way_shopDeliverymen}
        icon={<Bike className="w-5 h-5" />}
        color="from-sky-400/50 to-transparent"
      />

      <SummaryCard
        title="Total System Delivery"
        value={data.total_way_systemDeliverymen}
        icon={<Truck className="w-5 h-5" />}
        color="from-yellow-400/50 to-transparent"
      />
    </section>
  );
}
