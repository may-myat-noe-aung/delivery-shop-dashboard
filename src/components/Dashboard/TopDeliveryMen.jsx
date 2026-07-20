import React, { useEffect, useState } from "react";
import {
  Bike,
  Star,
  Phone,
  MapPin,
  Download,
} from "lucide-react";
import { BiEnvelope } from "react-icons/bi";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getAuthHeaders } from "../../auth";

export default function TopDeliveryMen({ shopId }) {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await fetch(
          `https://api.pwezayshops.com/top5deliverymen-by-shops/${shopId}`,
          {
            method: "GET",
            headers: getAuthHeaders(),
          }
        );

        const json = await res.json();

        if (json.success) {
          setDrivers(json.data || []);
        } else {
          setError("Failed to load delivery men");
        }
      } catch (err) {
        setError("Failed to load delivery men");
      } finally {
        setLoading(false);
      }
    };

    if (!shopId) return;

    // 🔥 initial fetch
    fetchDrivers();

    // 🔥 live fetch every 3000ms (3 sec)
    const interval = setInterval(() => {
      fetchDrivers();
    }, 3000);

    // cleanup
    return () => clearInterval(interval);
  }, [shopId]);

//   const handleExport = () => {
//   if (!drivers.length) return;

//   const headers = [
//     "Rank",
//     "Name",
//     "Phone",
//     "Email",
//     "Total Orders",
//     "Rating",
//     "Status",
//   ];

//   const rows = drivers.map((d, index) => [
//     index + 1,
//     d.name,
//     d.phone || "-",
//     d.email || "-",
//     d.total_order,
//     d.rating,
//     d.status,
//   ]);

//   const csvContent = [
//     headers.join(","),
//     ...rows.map((r) => r.map((v) => `"${v}"`).join(",")),
//   ].join("\n");

//   const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.setAttribute("download", "top-delivery-men.csv");
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };
const handleExport = () => {
  try {
    if (!drivers.length) {
      showAlert("No data to export", "warning");
      return;
    }

    const exportData = drivers.map((d, index) => ({
      Rank: index + 1,
      Name: d.name,
      Phone: d.phone || "-",
      Email: d.email || "-",
      TotalOrders: d.total_order,
      Rating: d.rating,
      Status: d.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    worksheet["!cols"] = [
      { wch: 10 }, // Rank
      { wch: 25 }, // Name
      { wch: 20 }, // Phone
      { wch: 30 }, // Email
      { wch: 15 }, // Total Orders
      { wch: 10 }, // Rating
      { wch: 15 }, // Status
    ];

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Top Delivery Men"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "top-delivery-men.xlsx");

    showAlert("Excel exported successfully!", "success");
  } catch (error) {
    console.error("Export error:", error);
    showAlert("Failed to export excel file", "error");
  }
};
  return (
    <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        
        <div>
          <h2 className="text-xl font-semibold text-white">
            Top 5 Delivery Men
          </h2>

          <p className="text-sm text-neutral-400 mt-1">
            Best delivery performance this month
          </p>
        </div>
<button
  onClick={handleExport}
  className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition flex items-center gap-1"
>
 <Download size={14} />  Export
</button>
      </div>

      {/* Table */}
      <div className="">
        
        <table className="w-full ">
          
          {/* Head */}
          <thead>
            <tr className="border-b border-slate-700 text-neutral-400 text-sm">
              
              <th className="p-4 text-left font-medium">Rank</th>
              <th className="p-4 text-left font-medium">Delivery Man</th>
              <th className="p-4 text-center font-medium">Phone</th>
              <th className="p-4 text-center font-medium">Email</th>
              <th className="p-4 text-center font-medium">Total Orders</th>
              <th className="p-4 text-center font-medium">Rating</th>
              <th className="p-4 text-center font-medium">Status</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-neutral-400">
                  Loading delivery men...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-red-400">
                  {error}
                </td>
              </tr>
            ) : drivers.length > 0 ? (
              drivers.map((driver, index) => (
                <tr
                  key={driver.id}
                  className="border-b border-slate-800 hover:bg-white/[0.03] transition-all duration-200"
                >
                  
                  {/* Rank (UNCHANGED UI) */}
                  <td className="p-4">
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

                  {/* Profile */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      {driver.photo ? (
                        <img
                               src={`https://api.pwezayshops.com/deliverymen-uploads/${driver.photo}`}
                          alt={driver.name}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">
                          {driver.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-white">
                          {driver.name}
                        </h4>

                        <p className="text-xs text-neutral-500 mt-1">
                          ID: {driver.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="p-4 text-center">
                      {/* <Phone className="h-4 w-4 text-neutral-500" /> */}
                      {driver.phone || "-"}
                  </td>

                  {/* Email */}
                  <td className="p-4 text-center break-words whitespace-normal max-w-[150px]">
                      {/* <BiEnvelope className="h-4 w-4 text-neutral-500" /> */}
                      {driver.email || "No email"}
                  </td>

                  {/* Orders */}
                  <td className="p-4 text-center text-indigo-400 font-semibold">
                    {driver.total_order}
                  </td>

                  {/* Rating */}
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      {driver.rating}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4 text-center">
                    <div
                      className={`px-3 py-1 rounded-full text-xs border inline-flex items-center gap-2 ${
                        driver.status === "active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          driver.status === "active"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      />

                      {driver.status === "active" ? "Active" : "Inactive"}
                    </div>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-16 text-neutral-500">
                  No delivery men found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}