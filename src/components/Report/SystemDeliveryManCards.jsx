// import React, { useEffect, useMemo, useState } from "react";

// import { Trash2, ChevronRight } from "lucide-react";

// import { useAlert } from "../../AlertProvider";
// import SystemDeliveryManCardsPopup from "./ShopDeliveryManCardsPopup";


// export default function SystemDeliveryManCards({ shopId }) {
//     const { showAlert, confirm } = useAlert();

//     const [drivers, setDrivers] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [searchTerm, setSearchTerm] = useState("");

//     const [page, setPage] = useState(1);

//     const [selectedDriver, setSelectedDriver] = useState(null);

//     const pageSize = 6;

//     // =========================
//     // FETCH
//     // =========================
//     const fetchData = async () => {
//         try {
//             const res = await fetch(
//                 `http://38.60.244.137:3000/report-system-deliverymen-by-shops/${shopId}`,
//             );

//             const data = await res.json();

//             if (data.success) {
//                 setDrivers(data.data || []);
//             } else {
//                 showAlert(data.message || "Failed", "error");
//             }
//         } catch (err) {
//             console.error(err);
//             showAlert("Server error", "error");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         if (!shopId) return;

//         setLoading(true);
//         fetchData();
//     }, [shopId]);

//     // =========================
//     // FILTER
//     // =========================
//     const filtered = useMemo(() => {
//         return drivers.filter((driver) =>
//             (driver.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
//         );
//     }, [drivers, searchTerm]);

//     // =========================
//     // PAGINATION
//     // =========================
//     const totalPages = Math.ceil(filtered.length / pageSize);

//     const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//     // 🔥 SAFE RESET PAGE (added only fix)
//     useEffect(() => {
//         if (page > totalPages) {
//             setPage(1);
//         }
//     }, [totalPages]);

//     // =========================
//     // DELETE
//     // =========================
//     const handleDelete = async (driverId) => {
//         const ok = await confirm("Clear finished orders?");
//         if (!ok) return;

//         try {
//             const res = await fetch(
//                 `http://38.60.244.137:3000/clearedOrders-by-shops/${driverId}`,
//                 {
//                     method: "DELETE",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({
//                         shop_id: shopId,
//                     }),
//                 },
//             );

//             const data = await res.json();

//             if (data.success) {
//                 showAlert(data.message || "Cleared successfully", "success");
//                 fetchData();
//             } else {
//                 showAlert(data.message || "Failed", "error");
//             }
//         } catch (err) {
//             console.error(err);
//             showAlert("Server error", "error");
//         }
//     };

//     return (
//         <div className="my-6">
//             {/* TITLE */}
//             <div className="flex justify-between items-center mb-5">
//                 <h2 className="text-2xl font-bold text-indigo-500">
//                     System Delivery Men Orders</h2>

//                 <input
//                     type="text"
//                     placeholder="Search driver..."
//                     value={searchTerm}
//                     onChange={(e) => {
//                         setSearchTerm(e.target.value);
//                         setPage(1);
//                     }}
//                     className="
//             bg-neutral-900
//             border border-neutral-700
//             px-3 py-2 rounded-xl
//             text-sm text-white
//             outline-none
//           "
//                 />
//             </div>

//             {/* LOADING */}
//             {loading ? (
//                 <div className="text-center py-10 text-gray-400">Loading...</div>
//             ) : paginated.length === 0 ? (
//                 <div className="text-center py-10 text-gray-400">No driver found</div>
//             ) : (
//                 <>
//                     {/* GRID */}
//                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//                         {paginated.map((driver) => (
//                             <div
//                                 key={driver.id}
//                                 className="
//                   bg-[#111827]
//                   border border-neutral-800
//                   rounded-2xl
//                   overflow-hidden
//                   shadow-lg
//                   hover:scale-[1.03]
//                   transition-all duration-300
//                 "
//                             >
//                                 {/* <img
//                   src={
//                     driver.photo
//                       ? `http://38.60.244.137:3000/deliverymen-uploads/${driver.photo}`
//                       : "/default-avatar.png"
//                   }
//                   alt={driver.name}
//                   className="w-full h-32 object-cover"
//                 /> */}

//                                 <div className="w-full h-32 bg-[#1f2937] flex items-center justify-center overflow-hidden">
//                                     {driver.photo ? (
//                                         <img
//                                             src={`http://38.60.244.137:3000/deliverymen-uploads/${driver.photo}`}
//                                             alt={driver.name}
//                                             className="w-full h-full object-cover"
//                                             onError={(e) => {
//                                                 e.target.style.display = "none";
//                                             }}
//                                         />
//                                     ) : (
//                                         <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
//                                             {driver.name?.charAt(0).toUpperCase() || "?"}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="p-3">
//                                     <h3 className="text-indigo-500 font-semibold text-lg truncate">
//                                         {driver.name}
//                                     </h3>

//                                     <p className="text-gray-400 text-md truncate mt-1">
//                                         {driver.email}
//                                     </p>

//                                     <p className="text-gray-400 text-md mt-1">{driver.phone}</p>

//                                     <div className="mt-2">
//                                         <span
//                                             className={
//                                                 driver.status === "active"
//                                                     ? "text-green-400 text-xs"
//                                                     : "text-red-400 text-xs"
//                                             }
//                                         >
//                                             {driver.status}
//                                         </span>
//                                     </div>

//                                     <div className="flex gap-2 mt-4">
//                                         <button
//                                             onClick={() => handleDelete(driver.id)}
//                                             className="
//                         flex-1 flex items-center justify-center gap-1
//                         bg-red-500 hover:bg-red-600
//                         text-white text-xs py-2 rounded-lg
//                       "
//                                         >
//                                             <Trash2 size={12} />
//                                             Delete
//                                         </button>

//                                         <button
//                                             onClick={() => setSelectedDriver(driver)}
//                                             className="
//                         flex items-center justify-center
//                         bg-indigo-500 hover:bg-indigo-600
//                         text-white px-3 rounded-lg
//                       "
//                                         >
//                                             <ChevronRight size={16} />
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* ================= PAGINATION (YOUR STYLE) ================= */}
//                     <div className="flex justify-between items-center gap-2 mt-6 text-sm text-neutral-400">
//                         {/* PAGE INFO */}
//                         <p>
//                             Page {page} of {totalPages === 0 ? 1 : totalPages}
//                         </p>

//                         <div className="flex justify-center items-center gap-2">
//                             {/* PREV */}
//                             <button
//                                 disabled={page === 1}
//                                 onClick={() => setPage((p) => Math.max(p - 1, 1))}
//                                 className="px-3 py-1 rounded-md border border-neutral-700 disabled:opacity-40"
//                             >
//                                 Prev
//                             </button>

//                             {/* PAGE 1 */}
//                             <button
//                                 onClick={() => setPage(1)}
//                                 className={`
//                   px-3 py-1 rounded-md border border-neutral-700
//                   ${page === 1 ? "bg-indigo-500 text-white" : ""}
//                 `}
//                             >
//                                 1
//                             </button>

//                             {/* NEXT */}
//                             <button
//                                 disabled={page === totalPages || totalPages === 0}
//                                 onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
//                                 className="px-3 py-1 rounded-md border border-neutral-700 disabled:opacity-40"
//                             >
//                                 Next
//                             </button>
//                         </div>
//                     </div>
//                 </>
//             )}

//             {/* POPUP */}
//             {selectedDriver && (
//                 <SystemDeliveryManCardsPopup
//                     driver={selectedDriver}
//                     close={() => setSelectedDriver(null)}
//                 />
//             )}
//         </div>
//     );
// }

import React, { useEffect, useMemo, useState } from "react";

import { useAlert } from "../../AlertProvider";

import ShopDeliveryManCardsPopup from "./ShopDeliveryManCardsPopup";

export default function SystemDeliveryManCards({ shopId }) {
  const { showAlert } = useAlert();

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(1);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const pageSize = 6;

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://38.60.244.137:3000/report-system-deliverymen-by-shops/${shopId}`,
      );

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

  useEffect(() => {
    if (!shopId) return;

    setLoading(true);
    fetchData();
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
        <h2 className="text-2xl font-bold text-indigo-400">
          Shop Delivery Men
        </h2>

        <input
          type="text"
          placeholder="Search driver..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="
            bg-neutral-900
            border border-neutral-700
            px-3 py-2 rounded-xl
            text-sm text-white
            outline-none
            focus:border-indigo-500
          "
        />
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-10 text-gray-400">No driver found</div>
      ) : (
        <>
          {/* GRID */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
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
                      src={`http://38.60.244.137:3000/deliverymen-uploads/${driver.photo}`}
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

                  <p className="text-gray-400 text-sm mt-1">
                    {driver.phone}
                  </p>

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

          {/* PAGINATION */}
          <div className="flex justify-between items-center mt-6 text-sm text-neutral-400">
            <p>
              Page {page} of {totalPages === 0 ? 1 : totalPages}
            </p>

            <div className="flex gap-2 items-center">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="px-3 py-1 rounded-md border border-neutral-700 disabled:opacity-40"
              >
                Prev
              </button>

              <button className="px-3 py-1 rounded-md bg-indigo-500 text-white">
                {page}
              </button>

              <button
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="px-3 py-1 rounded-md border border-neutral-700 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* POPUP */}
      {selectedDriver && (
        <ShopDeliveryManCardsPopup
          driver={selectedDriver}
          close={() => setSelectedDriver(null)}
        />
      )}
    </div>
  );
}