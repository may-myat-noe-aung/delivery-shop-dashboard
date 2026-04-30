// import React, { useState, useEffect, useMemo } from "react";
// import { Trash2, Pencil } from "lucide-react";
// import { useAlert } from "../../AlertProvider";
// import EditMenu from "./EditMenu";

// export default function MenuTable({ shopId }) {
//   const { showAlert, confirm } = useAlert();

//   const [editItem, setEditItem] = useState(null);
//   const [menuList, setMenuList] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const pageSize = 5;

//   // 🔥 FETCH DATA
//   const fetchData = async () => {
//     try {
//       const res = await fetch(`http://38.60.244.137:3000/menu/${shopId}`);
//       const data = await res.json();

//       if (data && Array.isArray(data.menus)) {
//         const withPhotos = data.menus.map((item) => ({
//           ...item,
//           photoUrl: item.photo
//             ? `http://38.60.244.137:3000/menu-uploads/${item.photo}`
//             : "/placeholder.png",
//           // ensure prices & categories are arrays
//           prices: Array.isArray(item.prices) ? item.prices : [],
//           categories: Array.isArray(item.categories)
//             ? item.categories
//             : Object.values(item.categories || {}),
//         }));
//         setMenuList(withPhotos);
//       } else {
//         showAlert("Failed to fetch menu", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Server error", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ⏱ Fetch every 5 seconds (safe live update)
//   useEffect(() => {
//     if (!shopId) return;
//     setLoading(true);
//     fetchData();
//     const interval = setInterval(fetchData, 5000);
//     return () => clearInterval(interval);
//   }, [shopId]);

//   // 🔍 FILTERED LIST
//   const filtered = useMemo(() => {
//     return menuList.filter((item) =>
//       (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }, [menuList, searchTerm]);

//   const totalPages = Math.ceil(filtered.length / pageSize);
//   const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

//   // 🗑 DELETE
//   const handleDelete = async (id) => {
//     const ok = await confirm("Delete this menu?");
//     if (!ok) return;

//     try {
//       const res = await fetch(`http://38.60.244.137:3000/menu/${id}`, {
//         method: "DELETE",
//       });
//       const data = await res.json();

//       if (res.ok) {
//         setMenuList((prev) => prev.filter((m) => m.id !== id));
//         showAlert(data?.message || "Deleted successfully", "success");
//       } else {
//         showAlert(data?.error || "Delete failed", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Server error", "error");
//     }
//   };

//   return (
//     <div className="mb-6">
//       {/* TITLE & SEARCH */}
//       <div className="flex justify-between items-center mb-5">
//         <h2 className="text-2xl font-bold text-white">Menu List</h2>

//         <input
//           type="text"
//           placeholder="Search menu..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setPage(1);
//           }}
//           className="bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-xl text-sm text-white"
//         />
//       </div>

//       {/* CONTENT */}
//       {loading ? (
//         <div className="text-center text-gray-400 py-10">Loading...</div>
//       ) : paginated.length === 0 ? (
//         <div className="text-center text-gray-400 py-10">No menu found</div>
//       ) : (
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
//           {paginated.map((item) => (
//             <div
//               key={item.id}
//               className="bg-gradient-to-br from-[#1a2030] to-[#111827] border border-slate-700 rounded-2xl p-4 shadow-xl hover:scale-105 hover:border-indigo-500 transition-all duration-300 group"
//             >
//               {/* PHOTO */}
//               <div className="flex justify-center mb-3">
//                 <img
//                   src={item.photoUrl}
//                   alt={item.name}
//                   className="w-20 h-20 object-cover rounded-lg group-hover:scale-110 transition"
//                   onError={(e) => (e.target.src = "/placeholder.png")}
//                 />
//               </div>

//               {/* NAME */}
//               <h3 className="text-center text-white font-semibold text-sm">
//                 {item.name}
//               </h3>

//               {/* CATEGORIES */}
//               <p className="text-center text-xs text-gray-400 mt-1">
//                 {item.categories.length > 0
//                   ? item.categories.join(" | ")
//                   : "No category"}
//               </p>

//               {/* PRICES */}
//               <p className="text-center text-indigo-400 text-xs mt-2 mb-3">
//                 {item.prices.length > 0
//                   ? item.prices.map((p) => `${p.size}:${p.price}`).join(" | ")
//                   : "No price info"}
//               </p>

//               <div className="flex gap-2">
//                 {/* EDIT */}
//                 <button
//                   onClick={() => setEditItem(item)}
//                   className="flex-1 flex items-center justify-center gap-1 bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs py-1.5 rounded-lg"
//                 >
//                   <Pencil size={14} />
//                   Edit
//                 </button>

//                 {/* DELETE */}
//                 <button
//                   onClick={() => handleDelete(item.id)}
//                   className="flex-1 flex items-center justify-center gap-1 bg-red-600/80 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg"
//                 >
//                   <Trash2 size={14} />
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* PAGINATION */}
//       <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
//         <p>
//           Page {totalPages === 0 ? 0 : page} of {totalPages}
//         </p>

//         <div className="flex gap-2">
//           <button
//             disabled={page === 1}
//             onClick={() => setPage(page - 1)}
//             className="px-3 py-1 rounded-lg border border-neutral-700 disabled:opacity-40"
//           >
//             Prev
//           </button>

//           <button
//             disabled={page === totalPages}
//             onClick={() => setPage(page + 1)}
//             className="px-3 py-1 rounded-lg border border-neutral-700 disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//       {editItem && (
//         <EditMenu
//           data={editItem}
//           close={() => setEditItem(null)}
//           onUpdate={fetchData}
//         />
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Pencil } from "lucide-react";
import { useAlert } from "../../AlertProvider";
import EditMenu from "./EditMenu";

export default function MenuTable({ shopId }) {
  const { showAlert, confirm } = useAlert();

  const [editItem, setEditItem] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  // =========================
  // FETCH DATA
  // =========================
  const fetchData = async () => {
    try {
      const res = await fetch(`http://38.60.244.137:3000/menu/${shopId}`);
      const data = await res.json();

      if (data && Array.isArray(data.menus)) {
        const withPhotos = data.menus.map((item) => ({
          ...item,

          photoUrl: item.photo
            ? `http://38.60.244.137:3000/menu-uploads/${item.photo}`
            : "/placeholder.png",

          prices: Array.isArray(item.prices) ? item.prices : [],
          categories: Array.isArray(item.categories)
            ? item.categories
            : Object.values(item.categories || {}),

          // 🔥 FIX (IMPORTANT)
          isOpen: item.open_menu === 1,
        }));

        setMenuList(withPhotos);
      } else {
        showAlert("Failed to fetch menu", "error");
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
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [shopId]);

  // =========================
  // FILTER
  // =========================
  const filtered = useMemo(() => {
    return menuList.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [menuList, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const ok = await confirm("Delete this menu?");
    if (!ok) return;

    try {
      const res = await fetch(`http://38.60.244.137:3000/menu/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setMenuList((prev) => prev.filter((m) => m.id !== id));
        showAlert(data?.message || "Deleted successfully", "success");
      } else {
        showAlert(data?.error || "Delete failed", "error");
      }
    } catch (err) {
      showAlert("Server error", "error");
    }
  };

  // =========================
  // TOGGLE MENU
  // =========================
  const toggleMenuStatus = async (id, currentStatus) => {
    const ok = await confirm(
      currentStatus ? "menu ပိတ်ချင်ပါ သလား?" : "menu ဖွင့်လှစ်ချင်ပါ သလား?",
    );
    if (!ok) return;

    setToggleLoadingId(id);

    try {
      const url = currentStatus
        ? `http://38.60.244.137:3000/off-menu/${id}`
        : `http://38.60.244.137:3000/open-menu/${id}`;

      const res = await fetch(url, { method: "PATCH" });
      const data = await res.json();

      if (res.ok) {
        setMenuList((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  open_menu: currentStatus ? 0 : 1,
                  isOpen: !currentStatus,
                }
              : item,
          ),
        );

        showAlert(data?.message || "Updated", "success");
      } else {
        showAlert(data?.error || "Update failed", "error");
      }
    } catch (err) {
      showAlert("Server error", "error");
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <div className="mb-6">
      {/* TITLE */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-bold text-white">Menu List</h2>

        <input
          type="text"
          placeholder="Search menu..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-xl text-sm text-white"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No menu found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {paginated.map((item) => (
            <div
              key={item.id}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 bg-[#111827] shadow-lg
    ${item.isOpen ? "border-green-500/40" : "border-red-500/40 opacity-60"}
    hover:scale-[1.03]`}
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className={`w-full h-32 object-cover ${
                    !item.isOpen ? "grayscale blur-[1px]" : ""
                  }`}
                />

                {/* TOP RIGHT ICONS */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => setEditItem(item)}
                    className="bg-black/60 hover:bg-indigo-600 p-1.5 rounded-full transition"
                  >
                    <Pencil size={14} className="text-white" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-black/60 hover:bg-red-600 p-1.5 rounded-full transition"
                  >
                    <Trash2 size={14} className="text-white" />
                  </button>
                </div>
              </div>

              {/* BODY */}
              <div className="p-3">
                {/* NAME */}
                <h3 className="text-white font-semibold text-sm truncate">
                  {item.name}
                </h3>

                {/* STATUS + TOGGLE */}
                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`text-xs font-medium ${
                      item.isOpen ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {item.isOpen ? "ဖွင့်ထားသည်" : "ပိတ်ထားသည်"}
                  </span>

                  <button
                    onClick={() => toggleMenuStatus(item.id, item.isOpen)}
                    disabled={toggleLoadingId === item.id}
                    className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                      item.isOpen ? "bg-green-500" : "bg-gray-600"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                        item.isOpen ? "translate-x-6" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* BOTTOM ACTIONS (KEEP) */}
                {/* <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditItem(item)}
                    className="flex-1 flex items-center justify-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white text-xs py-1.5 rounded-lg"
                  >
                    <Pencil size={12} /> Edit
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs py-1.5 rounded-lg"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editItem && (
        <EditMenu
          data={editItem}
          close={() => setEditItem(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
