
import React, { useState, useEffect } from "react";
import { Download, Edit, Search, Star } from "lucide-react";

import EditDeliveryMan from "./components/EditDeliveryMan";
import DeleteDeliveryMan from "./components/DeleteDeliveryMan";
import StatusDeliveryMan from "./components/StatusDeliveryMan";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function DeliveryTable({ shopId, setShowForm }) {
  const [deliverymen, setDeliverymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [shopName, setShopName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!shopId) return;

const fetchDeliverymen = async (showLoader = false) => {
  try {
    if (showLoader) setLoading(true);

    const res = await axios.get(
      `https://api.pwezayshops.com/deliverymen-shop/${shopId}`
    );

    setDeliverymen(res.data?.data || res.data || []);
  } catch (err) {
    console.error("API Error:", err);
  } finally {
    if (showLoader) setLoading(false);
  }
};

fetchDeliverymen(true); // first load

const interval = setInterval(() => {
  fetchDeliverymen(false); // background refresh
}, 3000);

return () => clearInterval(interval);
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;

    fetch(`https://api.pwezayshops.com/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.length > 0) {
          setShopName(data[0].shop_name);
        }
      })
      .catch((err) => console.error("Shop Error:", err));
  }, [shopId]);

  const splitDateTime = (datetime) => {
    if (!datetime) return ["-", "-"];

    const parts = datetime.split(" ");
    const date = parts[0] || "-";
    const time = parts[1] ? parts[1].slice(0, 8) : "-";

    return [date, time];
  };

  const filteredUsers = deliverymen.filter((delivery) => {
    const term = searchTerm.toLowerCase();

    return (
      delivery.name?.toLowerCase().includes(term) ||
      delivery.id?.toLowerCase().includes(term) ||
      delivery.email?.toLowerCase().includes(term) ||
      delivery.phone?.toLowerCase().includes(term) ||
      delivery.status?.toLowerCase().includes(term) ||
      delivery.rating?.toString().toLowerCase().includes(term) ||
      delivery.finished_order_count?.toString().toLowerCase().includes(term) ||
      delivery.assign_order?.toString().toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => setCurrentPage(1), [searchTerm]);

  const openEdit = (delivery) => {
    setActiveUser(delivery);
    setEditModal(true);
  };


const handleExport = () => {
  try {
    const exportData = [
      {
        ID: "ID",
        Name: "Name",
        Email: "Email",
        Phone: "Phone",
        Finished: "Finished",
        Assigned: "Assigned",
        Status: "Status",
        Rating: "Rating",
        Date: "Date",
        Time: "Time",
      },
      ...filteredUsers.map((delivery) => {
        const [date, time] = splitDateTime(delivery.created_at);

        return {
          ID: delivery.id,
          Name: delivery.name,
          Email: delivery.email,
          Phone: delivery.phone,
          Finished: delivery.finished_order_count,
          Assigned: delivery.assign_order,
          Status: delivery.status,
          Rating: delivery.rating,
          Date: date,
          Time: time,
        };
      }),
    ];

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // optional column width
    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 20 },
      { wch: 25 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 10 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Delivery Men");

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
    link.download = `deliverymen_shop_${shopId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Export error:", error);
  }
};

  return (
    <div className="bg-[#0f172a] text-gray-100 min-h-full pt-6">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className=" bg-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md hover:opacity-90 transition"
        >
          + Add New Delivery Man
        </button>

        <div className="flex items-center gap-3">
          {/* <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />

            <input
              type="text"
              placeholder="Search deliverymen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 bg-[#1e293b] border-slate-700 text-gray-200"
            />
          </div> */}

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />

              <input
                type="text"
                placeholder="Search Deliverymen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-2xl text-sm bg-slate-900/60 border border-slate-700 text-white outline-none focus:border-indigo-500 w-full sm:w-[250px]"
              />
            </div>
          </div>

          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-500/20 transition flex items-center gap-1"
          >
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700">
            <tr>
              {[
                // "ID",
                "Deliveryman",
                "Email",
                "Phone",
                // "Work Type",
                "Orders",
                "Status",
                "Rating",
                "Date ",
                "Action",
              ].map((col) => (
                <th key={col} className="p-4 text-center font-medium ">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

      <tbody>
  {loading ? (
    <tr>
      <td
        colSpan={8}
        className="text-center p-10 text-slate-400"
      >
        Loading deliverymen...
      </td>
    </tr>
  ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center p-8 text-gray-400">
                  No results found.
                </td>
              </tr>
            ) : (
              paginatedUsers.map((delivery) => (
                <tr
                  key={delivery.id}
                  className={`border-t transition-all duration-300 ${
                    delivery.status === "active"
                      ? "bg-green-900/30 hover:bg-green-900/40 border-green-700"
                      : delivery.status === "warning"
                        ? "bg-red-900/30 hover:bg-red-900/40 border-red-700"
                        : "hover:bg-slate-800 border-slate-700"
                  }`}
                >
                  {/* Profile */}
                  <td className="p-4">
                    <div className="flex items-center gap-2 2xl:gap-3">
                      {delivery.photo ? (
                        <img
                          src={`https://api.pwezayshops.com/deliverymen-uploads/${delivery.photo}`}
                          alt={delivery.name}
                          className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold">
                          {delivery.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium text-white">
                          {delivery.name}
                        </h4>

                        <p className="text-xs text-neutral-500 mt-1">
                          ID: {delivery.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* <td className="p-4 text-center">{delivery.email}</td> */}
                  <td className="p-4 text-center break-words whitespace-normal max-w-[150px]">
                    {delivery.email}
                  </td>

                  <td className="p-4 text-center">{delivery.phone}</td>

                  {/* <td className="p-4 text-center">{shopName || "-"}</td> */}

                  <td className="p-4 text-center">
                    <div className="flex flex-col text-sm">
                      <span>Finished: {delivery.finished_order_count}</span>
                      <span>Assigned: {delivery.assign_order}</span>
                    </div>
                  </td>

                  {/* STATUS BADGE */}
                  <td className="p-4 text-center">
                    <StatusDeliveryMan
                      delivery={delivery}
                      loading={actionLoading}
                      setLoading={setActionLoading}
                      onSuccess={(id, status) =>
                        setDeliverymen((prev) =>
                          prev.map((u) => (u.id === id ? { ...u, status } : u)),
                        )
                      }
                    />
                  </td>
                  {/* <td className="p-4 text-center">{delivery.rating || "-"}</td> */}
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      {delivery.rating}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {splitDateTime(delivery.created_at)[0]} <br />
                    {/* {splitDateTime(delivery.created_at)[1]} */}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center  items-center gap-1 2xl:gap-2 flex-wrap">
                      <button
                        onClick={() => openEdit(delivery)}
                        className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center hover:bg-amber-400/70 hover:text-white transition-all duration-200 shadow-sm"
                      >
                        <Edit size={16} />
                      </button>

                      <DeleteDeliveryMan
                        delivery={delivery}
                        loading={actionLoading}
                        setLoading={setActionLoading}
                        onSuccess={(id) =>
                          setDeliverymen((prev) =>
                            prev.filter((u) => u.id !== id),
                          )
                        }
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-between px-4 pt-4 text-sm text-neutral-400">
          <p>
            Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
          </p>

          <div className="flex justify-center items-center gap-2 pt-4 text-sm text-neutral-400">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 rounded-md border border-neutral-700"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-md border border-neutral-700 ${
                  currentPage === p
                    ? "bg-indigo-500 text-white border-indigo-600"
                    : ""
                }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 rounded-md border border-neutral-700"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <EditDeliveryMan
        open={editModal}
        activeUser={activeUser}
        setEditModal={setEditModal}
        setDeliverymen={setDeliverymen}
      />
    </div>
  );
}
