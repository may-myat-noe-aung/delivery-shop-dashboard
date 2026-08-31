
import React, { useEffect, useMemo, useState } from "react";
import { Search, Download, Eye } from "lucide-react";
import ReportPopup from "./ReportPopup";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { apiFetch } from "../../api";

export default function ReportTable({ shopId }) {
  const token = localStorage.getItem("shopToken");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

    const [selected, setSelected] = useState(null);
  

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalAmount: 0,
    totalDeliveryFees: 0,
  });

  useEffect(() => {
    if (!shopId) return;

    const fetchReport = async () => {
      try {
        setLoading(true);

        const res = await apiFetch(
          `https://api.pwezayshops.com/report-shops/${shopId}`, 
        );
  if (!res) return;
        const data = await res.json();

        if (data.success) {
          setReports(data.data);

          setStats({
            totalOrders: data.total,
            totalAmount: data.total_amount,
            totalDeliveryFees: data.total_delivery_fees,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [shopId]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, fromDate, toDate]);

const filteredReports = useMemo(() => {
  return reports.filter((row) => {
    const order = row.order;

    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.type || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(order.total_order).includes(searchTerm) ||
      String(order.grand_total).includes(searchTerm) ||
      (order.payment_method || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (row.deliveryman?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

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
}, [reports, searchTerm, fromDate, toDate]);

  const totalPages = Math.ceil(filteredReports.length / pageSize);

  const paginatedReports = filteredReports.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const maxButtons = 10;

const startPage =
  Math.floor((page - 1) / maxButtons) * maxButtons + 1;

const endPage = Math.min(
  startPage + maxButtons - 1,
  totalPages
);

const visiblePages = Array.from(
  { length: endPage - startPage + 1 },
  (_, i) => startPage + i
);

  // const handleExport = () => {
  //   const csvContent = [
  //     [
  //       "Order ID",
  //       "Customer",
  //       "Phone",
  //       "Type",
  //       "Items",
  //       "Grand Total",
  //       "Delivery Fee",
  //       "Payment",
  //       "Delivery Man",
  //       "Date",
  //     ],

  //     ...filteredReports.map((row) => [
  //       row.order.id,
  //       row.order.name,
  //       row.order.phone,
  //       row.order.type,
  //       row.order.total_order,
  //       row.order.grand_total,
  //       row.order.delivery_fees,
  //       row.order.payment_method,
  //       row.deliveryman?.name || "-",
  //       row.order.created_at,
  //     ]),
  //   ]
  //     .map((row) => row.join(","))
  //     .join("\n");

  //   const blob = new Blob([csvContent], {
  //     type: "text/csv;charset=utf-8;",
  //   });

  //   const url = URL.createObjectURL(blob);

  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `report_${shopId}.csv`;

  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const handleExport = () => {
  try {
    const exportData = [
      {
        "Order ID": "Order ID",
        Customer: "Customer",
        Phone: "Phone",
        Type: "Type",
        Items: "Items",
        "Grand Total": "Grand Total",
        "Delivery Fee": "Delivery Fee",
        Payment: "Payment",
        "Delivery Man": "Delivery Man",
        Date: "Date",
      },

      ...filteredReports.map((row) => ({
        "Order ID": row.order.id,
        Customer: row.order.name,
        Phone: row.order.phone,
        Type: row.order.type,
        Items: row.order.total_order,
        "Grand Total": row.order.grand_total,
        "Delivery Fee": row.order.delivery_fees,
        Payment: row.order.payment_method,
        "Delivery Man": row.deliveryman?.name || "-",
        Date: new Date(row.order.created_at).toLocaleString(),
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 15 }, // Order ID
      { wch: 20 }, // Customer
      { wch: 15 }, // Phone
      { wch: 10 }, // Type
      { wch: 10 }, // Items
      { wch: 15 }, // Grand Total
      { wch: 15 }, // Delivery Fee
      { wch: 15 }, // Payment
      { wch: 20 }, // Delivery Man
      { wch: 25 }, // Date
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report_${shopId}.xlsx`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export error:", error);
  }
};
  return (
    <div className="text-white">

   

       {/* Header */}
            <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-semibold text-indigo-400">
                Report Table
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
      <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">

        {loading ? (
          <div className="text-center py-10">
            Loading...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="border-b border-slate-700 text-slate-400">
                  <tr>
                    <th className="py-4 text-left">Order ID</th>
                    <th className="py-4 text-left">Customer</th>
                    <th className="py-4 text-left">Phone</th>
                    <th className="py-4 text-left">Type</th>
                    <th className="py-4 text-left">Items</th>
                    <th className="py-4 text-left">Grand Total</th>
                    {/* <th className="py-4 text-left">Delivery Fee</th> */}
                    <th className="py-4 text-left">Payment</th>
                    <th className="py-4 text-left">Delivery Man</th>
                    <th className="py-4 text-left">Date</th>
                    <th className="py-4 text-left"> 	Action</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedReports.map((row) => (
                    <tr
                      key={row.order.id}
                      className="border-b border-slate-800 hover:bg-slate-800/40"
                    >
                      <td className="py-4 text-cyan-400 font-semibold">
                        {row.order.id}
                      </td>

                      <td className="py-4">{row.order.name}</td>

                      <td className="py-4">{row.order.phone}</td>

                      <td className="py-4">{row.order.type}</td>

                      <td className="py-4">
                        {row.order.total_order}
                      </td>

                      <td className="py-4 text-green-400 font-semibold">
                        {row.order.grand_total.toLocaleString()} Ks
                      </td>

                      {/* <td className="py-4 text-yellow-400">
                        {row.order.delivery_fees.toLocaleString()} Ks
                      </td> */}

                      <td className="py-4">
                        {row.order.payment_method}
                      </td>

                      <td className="py-4">
                        {row.deliveryman?.name || "-"}
                      </td>

                      <td className="py-4 text-slate-300">
                        {new Date(
                          row.order.created_at
                        ).toLocaleDateString("en-GB")}
                      </td>
                         <td className="py-4">
                        <button
                       onClick={() => setSelected(row)}
                          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm transition"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>

                    
                  ))}
                </tbody>

              </table>
            </div>

            {/* Pagination */}
          
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

               {visiblePages.map((n) => (
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

          </>
        )}
      </div>
                  {/* Open Modal */}
                {selected && (
      <ReportPopup
        data={selected}
        close={() => setSelected(null)}
      />
    )}
    </div>
    
  );
}