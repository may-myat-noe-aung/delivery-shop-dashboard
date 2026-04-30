import React from "react";
import { BarChart3, Users, Wallet, PieChart as PieChartIcon } from "lucide-react";

const SummaryCard = ({ title, value, sub, icon, accent }) => (
  <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
    {/* Gradient Background */}
    <div className={"pointer-events-none absolute inset-0 bg-gradient-to-br " + accent} />
    <div className="flex items-center justify-between relative z-0">
      <div>
        <p className="text-sm text-neutral-400 mb-2">{title}</p>
        <p className="text-lg font-semibold mb-1">{value}</p>
        <p className="text-xs text-neutral-500">{sub}</p>
      </div>
      <div className="p-2 rounded-lg bg-neutral-800 text-yellow-500">{icon}</div>
    </div>
  </div>
);

export default function SummaryCards({ orders }) {
  // Calculate summary stats
  const totalOrders = orders.length;
  const totalItems = orders.reduce((sum, o) => sum + o.orders.length, 0);
  const totalAmount = orders.reduce((sum, o) => sum + o.orders.reduce((s, i) => s + i.total, 0), 0);
  const totalApproved = orders.filter((o) =>
    o.orders.every((i) => i.status === 1)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <SummaryCard
        title="Total Orders"
        value={totalOrders}
        sub="All orders"
        icon={<BarChart3 size={20} />}
        accent="from-indigo-600/20 to-indigo-400/10"
      />
      <SummaryCard
        title="Total Items"
        value={totalItems}
        sub="All items sold"
        icon={<Users size={20} />}
        accent="from-green-600/20 to-green-400/10"
      />
      <SummaryCard
        title="Total Amount"
        value={`${totalAmount.toLocaleString()} Ks`}
        sub="Gross sales"
        icon={<Wallet size={20} />}
        accent="from-yellow-600/20 to-yellow-400/10"
      />
      <SummaryCard
        title="Total Approved"
        value={totalApproved}
        sub="Approved orders"
        icon={<PieChartIcon size={20} />}
        accent="from-purple-600/20 to-purple-400/10"
      />
    </div>
  );
}