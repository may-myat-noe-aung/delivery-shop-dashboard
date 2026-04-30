import React, { useEffect, useState, useMemo } from "react";
import { Download, Search } from "lucide-react";
import ReportPopup from "./ReportPopup";

export default function ReportTable({ shopId }) {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===== New states for filtering, pagination, export =====
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [csvMessage, setCsvMessage] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://38.60.244.137:3000/report-shops/${shopId}`,
        );
        const data = await res.json();

        if (data.success) {
          // 🔥 keep only this shop's items
          const filteredOrders = data.data.map((item) => {
            const order = item.order;

            const shopOrders = order.orders.filter((o) => o.shop_id === shopId);

            return {
              ...order,
              orders: shopOrders,
              deliveryman: item.deliveryman,
            };
          });

          setOrders(filteredOrders);
          setError("");
        } else {
          setError("Failed to fetch orders.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [shopId]);

  // ===== Filtering =====
  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const orderDate = new Date(order.created_at);
      const fromMatch = fromDate ? orderDate >= new Date(fromDate) : true;
      const toMatch = toDate ? orderDate <= new Date(toDate) : true;

      return matchesSearch && fromMatch && toMatch;
    });
  }, [orders, searchTerm, fromDate, toDate]);

  // ===== Pagination =====
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [filtered]);

  // ===== CSV Export =====
  const handleExport = () => {
    const rows = filtered.map((order) => [
      order.id,
      order.name,
      order.phone,
      order.address,
      order.type,
      order.grand_total,
      order.payment_method,
      order.created_at,
    ]);

    const csvContent = [
      [
        "Order ID",
        "Customer",
        "Phone",
        "Address",
        "Type",
        "Total",
        "Payment Method",
        "Date",
      ],
      ...rows,
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report-orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvMessage("CSV exported successfully!");
    setTimeout(() => setCsvMessage(""), 2000);
  };

  return (
    <div className="">
      {csvMessage && (
        <div className="mb-2 text-center  px-3 bg-green-600 text-white rounded-md animate-pulse">
          {csvMessage}
        </div>
      )}

      {/* ===== Header: search, date filter, export ===== */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl text-indigo-500 font-semibold mb-6">
          Report Orders
        </h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search orders..."
              className="rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-2 rounded-2xl border border-neutral-700 text-sm text-neutral-300 hover:text-white"
          >
            <Download size={14} /> Export
          </button>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="rounded-2xl bg-indigo-500 focus:ring-indigo-400 text-white px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="rounded-2xl bg-indigo-500 focus:ring-indigo-400 text-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : paginated.length === 0 ? (
        <div className="text-center text-slate-400 py-10">No orders found.</div>
      ) : (
        <div className="overflow-x-auto bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
          <table className="w-full text-sm">
            <thead className="text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-4 text-left">Order ID</th>
                <th className="py-4 text-left">Customer</th>
                <th className="py-4 text-left">Phone</th>
                <th className="py-4 text-left">Address</th>
                <th className="py-4 text-left">Type</th>
                <th className="py-4 text-left">Total</th>
                <th className="py-4 text-left">Payment Method</th>
                <th className="py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                >
                  <td className="py-4 font-semibold text-cyan-400">
                    {order.id}
                  </td>
                  <td className="py-4 text-slate-300">{order.name}</td>
                  <td className="py-4 text-slate-300">{order.phone}</td>
                  <td className="py-4 text-slate-300">{order.address}</td>
                  <td className="py-4 text-indigo-400">{order.type}</td>
                  <td className="py-4 text-yellow-400">
                    {order.grand_total?.toLocaleString()} Ks
                  </td>
                  <td className="py-4 text-indigo-400">
                    {order.payment_method}
                  </td>
                  <td className="py-4 flex gap-2 items-center">
                    <button
                      onClick={() => setSelected(order)}
                      className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-sm"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ===== Pagination ===== */}
          <div className="flex justify-between px-4 pt-4 text-sm text-neutral-400">
            <p>
              Page {totalPages === 0 ? 0 : page} of {totalPages}
            </p>

            {/* ===== Pagination ===== */}
            <div className="flex justify-center items-center gap-2 pt-4 text-sm text-neutral-400">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 rounded-md border border-neutral-700"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-md border border-neutral-700 ${
                    page === p
                      ? "bg-indigo-500 text-white border-indigo-600"
                      : ""
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 rounded-md border border-neutral-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= POPUP ================= */}
      {selected && (
        <ReportPopup order={selected} close={() => setSelected(null)} />
      )}
    </div>
  );
}
