import React, { useEffect, useState, useMemo } from "react";
import { Eye, Download, Search, CheckCircle2 } from "lucide-react";
import OrderPopup from "./OrderPopup";
import { useAlert } from "../../AlertProvider";
import PrintInvoice from "../Print/PrintInvoice";
import PrintReceipt from "../Print/PrintReceipt";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function OrdersTable({ shopId }) {
  const { showAlert, confirm } = useAlert();
  const token = localStorage.getItem("shopToken");
  const [pickedOrders, setPickedOrders] = useState({});
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderTab, setOrderTab] = useState("normal");

  // Print
  const [printOrder, setPrintOrder] = useState(null);
  const [printType, setPrintType] = useState("a4"); // a4 | thermal

  // Pagination & Search
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [csvMessage, setCsvMessage] = useState("");

  const typeColors = {
    Fast: "text-red-400",
    Normal: "text-green-400",
    Timer: "text-yellow-400",
    Special: "text-purple-400",
  };

  // Debounced fetch with 500ms
  useEffect(() => {
    if (!shopId) return;

    const fetchAndUpdate = async () => {
      try {
        const res = await fetch(
          `https://api.pwezayshops.com/orders-by-shop/${shopId}`,{
            headers: {
              Authorization: `MSHteam ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);

          // ✅ sync pickup state from API
          const pickedMap = {};
          data.data.forEach((order) => {
            if (order.orders_pickup === 1) {
              pickedMap[order.id] = true;
            }
          });

          setPickedOrders(pickedMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdate(); // Initial fetch

    const interval = setInterval(() => {
      fetchAndUpdate();
    }, 500); // Poll every 500ms

    return () => clearInterval(interval);
  }, [shopId]);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://api.pwezayshops.com/orders-by-shop/${shopId}`,{
          headers: {
            Authorization: `MSHteam ${token}`,
          },
        }
      );
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
      } else {
        setError("Failed to fetch orders.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
      setPage(1); // Reset page after new fetch
    }
  };
  const handlePrint = (order, type = "a4") => {
    setPrintOrder(order);
    setPrintType(type);

    setTimeout(() => {
      window.print();
    }, 300);

    setTimeout(() => {
      setPrintOrder(null);
    }, 1200);
  };

  const handlePickup = async (orderId, order) => {
    const status = getOrderStatus(order);

    if (status.label === "Pending") {
      showAlert("ကျေးဇူးပြု၍ အရင်ဆုံး order ကို လက်ခံပေးပါ", "warning");
      return;
    }

    const isConfirmed = await confirm("Are you sure to pickup this order?");
    if (!isConfirmed) return;

    try {
      const res = await fetch(
        `https://api.pwezayshops.com/pickup-order/${orderId}`,
        {
          method: "PATCH",
            headers: {
      "Content-Type": "application/json",
      Authorization: `MSHteam ${token}`,
    },
          
        },
      );

      const data = await res.json();

      console.log("pickup response:", data);

      if (data.success) {
        setPickedOrders((prev) => ({
          ...prev,
          [orderId]: true,
        }));

        showAlert(data.message, "success");
      } else {
        showAlert(data.message || "Pickup failed", "error");
      }
    } catch (err) {
      console.error("pickup error:", err);
      showAlert("Something went wrong", "error");
    }
  };
  const getOrderTotal = (order) =>
    order.orders.reduce((sum, item) => sum + item.total, 0);

  const getOrderStatus = (order) => {
    const statuses = order.orders.map((item) => item.status);
    if (statuses.includes(0))
      return { label: "Pending", color: "text-yellow-400" };
    if (statuses.includes(2))
      return { label: "Rejected", color: "text-red-400" };
    if (statuses.every((s) => s === 1))
      return { label: "Approved", color: "text-green-400" };
    return { label: "Unknown", color: "text-slate-400" };
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const formattedDate = new Date(order.created_at).toLocaleDateString(
        "en-GB",
      );

      const statusLabel = getOrderStatus(order).label;

      const matchesSearch =
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formattedDate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(order.orders.length).includes(searchTerm) ||
        String(getOrderTotal(order)).includes(searchTerm) ||
        statusLabel.toLowerCase().includes(searchTerm.toLowerCase());

      const orderDate = new Date(order.created_at);
      orderDate.setHours(0, 0, 0, 0);

      let matchesDate = true;

      if (fromDate && toDate) {
        const from = new Date(fromDate);
        const to = new Date(toDate);

        matchesDate =
          orderDate.getTime() >= from.getTime() &&
          orderDate.getTime() <= to.getTime();
      } else if (fromDate || toDate) {
        const selected = new Date(fromDate || toDate);
        selected.setHours(0, 0, 0, 0);

        matchesDate = orderDate.getTime() === selected.getTime();
      }

      return matchesSearch && matchesDate;
    });
  }, [orders, searchTerm, fromDate, toDate]);

  // --- Filtered by orderTab before pagination ---
  const tabFilteredOrders = useMemo(() => {
    return filteredOrders.filter((order) =>
      orderTab === "normal" ? !order.timer : order.timer,
    );
  }, [filteredOrders, orderTab]);

  // --- Pagination ---
  const totalPages = Math.ceil(tabFilteredOrders.length / pageSize);
  const paginatedOrders = tabFilteredOrders.slice(
    (page - 1) * pageSize,
    page * pageSize,
  );

  // --- Displayed orders (just alias for clarity) ---
  const displayOrders = paginatedOrders;
  const handleExport = () => {
    try {
      const exportData = filteredOrders.map((order, index) => ({
        No: index + 1,
        OrderID: order.id,
        Customer: order.name,
        Phone: order.phone,
        Type: order.type,
        Items: order.orders.length,
        Total: getOrderTotal(order),
        Status: getOrderStatus(order).label,
        Date: new Date(order.created_at).toLocaleDateString(),
        Time: new Date(order.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Optional column widths
      worksheet["!cols"] = [
        { wch: 8 }, // No
        { wch: 20 }, // OrderID
        { wch: 25 }, // Customer
        { wch: 20 }, // Phone
        { wch: 15 }, // Type
        { wch: 10 }, // Items
        { wch: 15 }, // Total
        { wch: 15 }, // Status
        { wch: 15 }, // Date
        { wch: 15 }, // Time
      ];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, `orders_shop_${shopId}.xlsx`);

      showAlert("Excel exported successfully!", "success");
    } catch (error) {
      console.error("Export error:", error);
      showAlert("Failed to export orders", "error");
    }
  };

  const pageWindow = 10;

  const startPage = Math.floor((page - 1) / pageWindow) * pageWindow + 1;

  const endPage = Math.min(startPage + pageWindow - 1, totalPages);
  return (
    <div className=" text-white ">
      {/* CSV Toast */}
      {csvMessage && (
        <div className="mb-2 text-center py-2 px-3 bg-green-600 text-white rounded-md animate-pulse">
          {csvMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-indigo-400">
          Customer Orders
        </h2>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-2xl text-sm bg-slate-900/60 border border-slate-700 text-white outline-none focus:border-indigo-500 w-full sm:w-[250px]"
              />
            </div>

            <button
              onClick={handleExport}
              className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition flex items-center gap-1"
            >
              <Download size={14} /> Export
            </button>
          </div>
          <div className="flex gap-3 justify-end">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="rounded-2xl bg-indigo-400 text-neutral-900 pl-3 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 hover:bg-indigo-300 focus:ring-indigo-300"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="rounded-2xl bg-indigo-400 text-neutral-900 pl-3 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 hover:bg-indigo-300 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setOrderTab("normal")}
          className={`px-4 py-2 rounded-full text-sm ${
            orderTab === "normal"
              ? "bg-indigo-500 text-white"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Normal Orders
        </button>

        <button
          onClick={() => setOrderTab("timer")}
          className={`px-4 py-2 rounded-full text-sm ${
            orderTab === "timer"
              ? "bg-yellow-500 text-black"
              : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Timer Orders
        </button>
      </div>
      <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
        {loading ? (
          <div className="text-center text-slate-400 py-20">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-20">{error}</div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center text-slate-400 py-20">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-4 text-left">Pickup</th>
                  <th className="py-4 text-left">Order ID</th>
                  <th className="py-4 text-left">Customer</th>
                  <th className="py-4 text-left">Phone Number</th>
                  <th className="py-4 text-left">Type</th>
                  <th className="py-4 text-left">Items</th>
                  <th className="py-4 text-left">Total</th>
                  <th className="py-4 text-left">Date</th>
                  <th className="py-4 text-left">Status</th>

                  {/* Timer Column Header */}
                  {orderTab === "timer" && (
                    <th className="py-4 text-left">Timer</th>
                  )}

                  <th className="py-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {displayOrders.map((order) => {
                  const status = getOrderStatus(order);
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-slate-800 hover:bg-slate-800/40 transition duration-200"
                    >
                      <td className="py-4">
                        <button
                          onClick={() => {
                            // if (pickedOrders[order.id]) return;

                            const status = getOrderStatus(order);

                            if (status.label === "Pending") {
                              showAlert(
                                "ကျေးဇူးပြု၍ အရင်ဆုံး order ကို လက်ခံပေးပါ",
                                "warning",
                              );
                              return;
                            }

                            handlePrint(order, "a4");

                            setTimeout(() => {
                              handlePickup(order.id, order);
                            }, 1500);
                          }}
                        
                          className={`
    flex items-center gap-2
    px-3 py-2
    rounded-xl
    text-xs font-semibold
    transition-all duration-200
    shadow-md

    ${
      pickedOrders[order.id]
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 "
        : "bg-slate-800 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-white"
    }
  `}
                        >
                          <CheckCircle2 size={16} />

                          {pickedOrders[order.id] ? "Picked" : "Pickup"}
                        </button>
                      </td>
                      <td className="py-4 font-semibold text-cyan-400">
                        {order.id}
                      </td>
                      <td className="py-4 font-semibold">{order.name}</td>
                      <td className="py-4 font-semibold">{order.phone}</td>
                      <td
                        className={`py-4 font-semibold ${
                          typeColors[order.type] || "text-white"
                        }`}
                      >
                        {order.type}
                      </td>
                      <td className="py-4">{order.orders.length} items</td>
                      {/* <td className="py-4">
  {order.orders.reduce((sum, item) => sum + item.quantity, 0)} items
</td> */}
                      <td className="py-4 font-semibold text-indigo-400">
                        {getOrderTotal(order).toLocaleString()} Ks
                      </td>
                      <td className="py-4 font-semibold text-green-400">
                        {new Date(order.created_at).toLocaleDateString("en-GB")}
                      </td>{" "}
                      <td className={`py-4 font-semibold ${status.color}`}>
                        {status.label}
                      </td>
                      {/* Timer Column Cell */}
                      {orderTab === "timer" && (
                        <td className="py-4 font-semibold text-yellow-400">
                          {order.timer
                            ? new Date(order.timer).toLocaleString()
                            : "-"}
                        </td>
                      )}
                      <td className="py-4">
                        <button
                          onClick={() => setSelected(order)}
                          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm transition"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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
                  { length: endPage - startPage + 1 },
                  (_, i) => startPage + i,
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
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
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
        )}
      </div>

      {selected && (
        <OrderPopup
          order={selected}
          close={() => setSelected(null)}
          shopId={shopId} // ✅ pass shopId here
        />
      )}

      <div className="print-area">
        {/* <PrintReceipt order={printOrder} /> */}
      </div>
      <div className="print-area">
        <PrintReceipt order={printOrder} shopId={shopId} />
      </div>
    </div>
  );
}
