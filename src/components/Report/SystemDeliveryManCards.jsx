import React, { useEffect, useMemo, useState } from "react";

import { useAlert } from "../../AlertProvider";

import { Search } from "lucide-react";
import ShopDeliveryManCardsPopup from "./ShopDeliveryManCardsPopup";
import { apiFetch } from "../../api";

export default function SystemDeliveryManCards({ shopId }) {
  const { showAlert } = useAlert();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);

  const [selectedDriver, setSelectedDriver] = useState(null);

  // const pageSize = 6;
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth > 1280) {
        setPageSize(6);
      } else {
        setPageSize(4);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiFetch(
        `https://api.pwezayshops.com/report-system-deliverymen-by-shops/${shopId}`,
      );
if (!res) return;
      const data = await res.json();

      if (data.success) {
        setDrivers(data.data || []);
      } else {
        showAlert(data.message || "Failed", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const refreshSelectedDriver = async () => {
    try {
      const res = await apiFetch(
        `https://api.pwezayshops.com/report-system-deliverymen-by-shops/${shopId}`,
      );
      if (!res) return;
      const data = await res.json();

      if (data.success) {
        const updatedDrivers = data.data || [];

        setDrivers(updatedDrivers);

        // IMPORTANT
        if (selectedDriver) {
          const updatedDriver = updatedDrivers.find(
            (d) => d.id === selectedDriver.id,
          );

          if (updatedDriver) {
            setSelectedDriver(updatedDriver);
          }
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!shopId) return;

    setLoading(true);

    // first fetch
    fetchData();

    // auto fetch every 5s
    const interval = setInterval(() => {
      fetchData();
    }, 500);

    // cleanup
    return () => clearInterval(interval);
  }, [shopId]);

  const filtered = useMemo(() => {
    return drivers.filter((driver) =>
      (driver.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [drivers, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [totalPages]);

  return (
    <div className="my-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-indigo-400">
          System Delivery Men
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              type="text"
              placeholder="Search System Delivery Men ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-2xl text-sm bg-slate-900/60 border border-slate-700 text-white outline-none focus:border-indigo-500 w-full sm:w-[250px]"
            />
          </div>
        </div>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No System Delivery Men found
        </div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-2  lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-6 gap-5">
            {paginated.map((driver) => (
              <div
                key={driver.id}
                className="
                  bg-gradient-to-b from-[#0f172a] to-[#111827]
                  border border-neutral-800
                  rounded-2xl
                  overflow-hidden
                  shadow-md
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                {/* AVATAR */}
                <div className="relative h-32 bg-[#1f2937] flex items-center justify-center">
                  {driver.photo ? (
                    <img
                      src={`https://api.pwezayshops.com/deliverymen-uploads/${driver.photo}`}
                      alt={driver.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {driver.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}

                  {/* status badge */}
                  <div
                    className={`
                      absolute top-2 right-2 px-2 py-1 text-[10px] rounded-full font-semibold
                      ${
                        driver.status === "active"
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }
                    `}
                  >
                    {driver.status}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-indigo-500 font-semibold text-base truncate">
                    {driver.name}
                  </h3>

                  <p className="text-gray-400 text-sm mt-1 truncate">
                    {driver.email}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">{driver.phone}</p>

                  {/* ACTION */}
                  <button
                    onClick={() => setSelectedDriver(driver)}
                    className="
                      mt-4 w-full
                      bg-indigo-500/90 hover:bg-indigo-500
                      text-white text-xs font-medium
                      py-2 rounded-lg
                      transition-all duration-200
                      shadow-md hover:shadow-indigo-500/20
                    "
                  >
                    See way
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between px-4 pt-4 text-sm text-neutral-400 gap-2 md:gap-0">
              <p>
                Page {totalPages === 0 ? 0 : page} of {totalPages}
              </p>

              <div className="flex gap-2 flex-wrap">
                {/* Prev Button */}
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

                {/* Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
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
                  ),
                )}

                {/* Next Button */}
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
          )}
        </>
      )}

      {/* POPUP */}
      {selectedDriver && (
        <ShopDeliveryManCardsPopup
          shopId={shopId}
          driver={selectedDriver}
          close={() => setSelectedDriver(null)}
          refreshData={refreshSelectedDriver}
        />
      )}
    </div>
  );
}
