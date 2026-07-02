import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function TodayOrders({ shopId }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `https://api.pwezayshops.com/today-orders-by-shop/${shopId}`
        );

        const json = await res.json();

        if (json.success) {
          setOrders(json.data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!shopId) return;

    fetchOrders();

    const interval = setInterval(fetchOrders, 3000);

    return () => clearInterval(interval);
  }, [shopId]);

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      const order = item.order;
      const deliveryman = item.deliveryman;

      const q = search.toLowerCase();

      return (
        order.id?.toLowerCase().includes(q) ||
        order.name?.toLowerCase().includes(q) ||
        order.phone?.toLowerCase().includes(q) ||
      String(order.grand_total || 0).includes(q) || 
        order.payment_method?.toLowerCase().includes(q) ||
        deliveryman?.name?.toLowerCase().includes(q)
      );
    });
  }, [orders, search]);

  const totalPages = Math.ceil(filteredOrders.length / limit);

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * limit,
    page * limit
  );

  const totalRevenue = orders.reduce(
    (sum, item) => sum + Number(item.order.grand_total || 0),
    0
  );

  // const handleExport = () => {
  //   if (!filteredOrders.length) return;

  //   const headers = [
  //     "Order ID",
  //     "Customer",
  //     "Phone",
  //     "Menu",
  //     "Amount",
  //     "Delivery Man",
  //     "Payment",
  //     "Date",
  //   ];

  //   const rows = filteredOrders.map((item) => [
  //     item.order.id,
  //     item.order.name,
  //     item.order.phone,
  //     item.order.orders?.[0]?.menu_name || "-",
  //     item.order.grand_total,
  //     item.deliveryman?.name || "-",
  //     item.order.payment_method,
  //     item.order.created_at,
  //   ]);

  //   const csvContent = [
  //     headers.join(","),
  //     ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
  //   ].join("\n");

  //   const blob = new Blob([csvContent], {
  //     type: "text/csv;charset=utf-8;",
  //   });

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = "today-orders.csv";
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };
const handleExport = () => {
  try {
    if (!filteredOrders.length) {
      showAlert("No orders to export", "warning");
      return;
    }

    const exportData = filteredOrders.map((item, index) => ({
      No: index + 1,
      OrderID: item.order.id,
      Customer: item.order.name,
      Phone: item.order.phone,
      Menu: item.order.orders?.[0]?.menu_name || "-",
      Amount: item.order.grand_total,
      DeliveryMan: item.deliveryman?.name || "-",
      Payment: item.order.payment_method,
      Date: new Date(item.order.created_at).toLocaleDateString(),
      Time: new Date(item.order.created_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 8 },  // No
      { wch: 20 }, // OrderID
      { wch: 25 }, // Customer
      { wch: 20 }, // Phone
      { wch: 30 }, // Menu
      { wch: 15 }, // Amount
      { wch: 25 }, // DeliveryMan
      { wch: 15 }, // Payment
      { wch: 15 }, // Date
      { wch: 15 }, // Time
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Today Orders"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "today-orders.xlsx");

    showAlert("Excel exported successfully!", "success");
  } catch (error) {
    console.error("Export error:", error);
    showAlert("Failed to export excel file", "error");
  }
};
  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">

      {/* Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">
                Total Orders
              </p>

              <h3 className="text-3xl font-bold text-white mt-2">
                {orders.length}
              </h3>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <ShoppingBag className="text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700 bg-slate-900/40 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-400 text-sm">
                Revenue Today
              </p>

              <h3 className="text-3xl font-bold text-green-400 mt-2">
                {totalRevenue.toLocaleString()} Ks
              </h3>
            </div>

            <div className="h-14 w-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <DollarSign className="text-green-400" />
            </div>
          </div>
        </div>

      </div> */}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Today Orders       
          </h2>

          <p className="text-sm text-neutral-400 mt-1 flex items-center justify-center gap-2">
            {/* All  */}
               <h3 className="font-bold text-lg text-indigo-400">
                {orders.length}
              </h3>
             orders received today
            
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">

          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-2xl text-sm bg-slate-900/60 border border-slate-700 text-white outline-none focus:border-indigo-500 w-full sm:w-[250px]"
            />
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition flex items-center gap-1"
          >
            <Download size={14} />
            Export
          </button>

        </div>
      </div>

      {/* Table */}
      <div className="">

        <table className="w-full">

          <thead>
            <tr className="border-b border-slate-700 text-neutral-400 text-sm">
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-center">Phone</th>
              <th className="p-4 text-center">Menu</th>
              <th className="p-4 text-center">Amount</th>
              <th className="p-4 text-center">Delivery Man</th>
              {/* <th className="p-4 text-center">Payment</th> */}
              <th className="p-4 text-center">Time</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-16 text-neutral-400"
                >
                  Loading orders...
                </td>
              </tr>
            ) : paginatedOrders.length > 0 ? (
              paginatedOrders.map((item) => {
                const order = item.order;
                const deliveryman = item.deliveryman;

                return (
                  <tr
                    key={order.id}
                    className="border-b border-slate-800 hover:bg-white/[0.03]"
                  >
                    <td className="p-4 text-indigo-400 font-medium">
                      {order.id}
                    </td>

                    <td className="p-4 text-white">
                      {order.name}
                    </td>

                    <td className="p-4 text-center text-neutral-300">
                      {order.phone}
                    </td>

                    <td className="p-4 text-center text-neutral-300">
                      {order.orders?.[0]?.menu_name}
                    </td>

                    <td className="p-4 text-center text-green-400 font-semibold">
                      {Number(order.grand_total).toLocaleString()} Ks
                    </td>

                    <td className="p-4 text-center text-neutral-300">
                      {deliveryman?.name || "-"}
                    </td>

                    {/* <td className="p-4 text-center text-yellow-400">
                      {order.payment_method}
                    </td> */}

                    <td className="p-4 text-center text-neutral-300">
                      {new Date(
                        order.created_at
                      ).toLocaleTimeString()}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-16 text-neutral-500"
                >
                  No orders found.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-between px-4 pt-4 text-sm text-neutral-400 gap-2 md:gap-0">
        <p>
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </p>

        <div className="flex gap-2 flex-wrap">

          <button
            disabled={page === 1}
            onClick={() => setPage(Math.max(1, page - 1))}
            className={`px-3 py-1 rounded-md border border-neutral-700 ${
              page === 1
                ? "text-neutral-500 cursor-not-allowed"
                : "text-indigo-400 hover:bg-neutral-900"
            }`}
          >
            Prev
          </button>

          {Array.from(
            { length: totalPages },
            (_, i) => i + 1
          ).map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`px-3 py-1 rounded-md border border-neutral-700 ${
                page === n
                  ? "bg-indigo-300 text-black font-semibold"
                  : "text-indigo-300 hover:bg-neutral-900"
              }`}
            >
              {n}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage(Math.min(totalPages, page + 1))
            }
            className={`px-3 py-1 rounded-md border border-neutral-700 ${
              page === totalPages
                ? "text-neutral-500 cursor-not-allowed"
                : "text-indigo-500 hover:bg-neutral-900"
            }`}
          >
            Next
          </button>

        </div>
      </div>

    </div>
  );
}
