// import React, { useState, useEffect, useRef } from "react";
// import { Camera, Download, Search, Trash2 } from "lucide-react";
// import axios from "axios";
// import { useAlert } from "../../AlertProvider";
// import EditDeliveryForm from "./EditDeliveryForm";

// export default function DeliveryTable({
//   deliveryMen,
//   setShowForm,
//   onOpenChat,
// }) {
//   const [deliverymen, setDeliverymen] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeUser, setActiveUser] = useState(null);
//   const [actionLoading, setActionLoading] = useState({});
//   const { showAlert, confirm } = useAlert();
//   const [shops, setShops] = useState([]);

//   const [passcodeModal, setPasscodeModal] = useState(false);
//   const [passcode, setPasscode] = useState("");
//   const passcodeInputRef = useRef(null);

//   const [editModal, setEditModal] = useState(false);
//   const [editFormData, setEditFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     work_type: "Full time",
//     password: "",
//     photo: null,
//   });
//   const [editPasscodeModal, setEditPasscodeModal] = useState(false);
//   const [editPasscode, setEditPasscode] = useState("");
//   const editPasscodeInputRef = useRef(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const interval = setInterval(() => {
//       axios
//         .get("http://38.60.244.137:3000/deliverymen")
//         .then((res) => setDeliverymen(res.data))
//         .catch((err) => console.error("API Error:", err));
//     }, 500);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//   axios
//     .get("http://38.60.244.137:3000/shops")
//     .then((res) => setShops(res.data))
//     .catch((err) => console.log(err));
// }, []);

// const getShopName = (work_type) => {
//   if (!work_type) return "-";
//   const shop = shops.find((s) => s.id === work_type);
//   return shop ? shop.shop_name : "-";
// };

//   const splitDateTime = (datetime) => {
//     if (!datetime) return ["-", "-"];
//     const [date, time] = datetime.split(" ");
//     return [date, time.slice(0, 8)];
//   };

//   const filteredUsers = deliverymen.filter((delivery) => {
//     const term = searchTerm.toLowerCase();
//     return (
//       delivery.name?.toLowerCase().includes(term) ||
//       delivery.id?.toLowerCase().includes(term) ||
//       delivery.email?.toLowerCase().includes(term) ||
//       delivery.phone?.toLowerCase().includes(term) ||
//       delivery.status?.toLowerCase().includes(term)
//     );
//   });

//   const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const paginatedUsers = filteredUsers.slice(
//     startIndex,
//     startIndex + itemsPerPage,
//   );

//   useEffect(() => setCurrentPage(1), [searchTerm]);

//   const openDeletePasscode = (delivery) => {
//     setActiveUser(delivery);
//     setPasscode("");
//     setPasscodeModal(true);
//     setTimeout(() => passcodeInputRef.current?.focus(), 500);
//   };

//   const doDelete = () => {
//     if (passcode === "234567") {
//       setActionLoading((prev) => ({ ...prev, [activeUser.id]: true }));

//       axios
//         .delete(`http://38.60.244.137:3000/deliverymen/${activeUser.id}`)
//         .then((res) => {
//           setDeliverymen((prev) => prev.filter((u) => u.id !== activeUser.id));

//           showAlert(res.data.message || "Deleted successfully", "success");
//         })
//         .catch((err) => {
//           showAlert(err.response?.data?.message || "Delete failed", "error");
//         })
//         .finally(() => {
//           setActionLoading((prev) => ({
//             ...prev,
//             [activeUser.id]: false,
//           }));
//           setPasscodeModal(false);
//         });
//     } else {
//       showAlert("Incorrect passcode", "warning");
//     }
//   };

//   const toggleStatus = (delivery, newStatus) => {
//     setActionLoading((prev) => ({ ...prev, [delivery.id]: true }));

//     axios
//       .patch(`http://38.60.244.137:3000/deliverymen/status/${delivery.id}`, {
//         status: newStatus,
//       })
//       .then((res) => {
//         setDeliverymen((prev) =>
//           prev.map((u) =>
//             u.id === delivery.id ? { ...u, status: newStatus } : u,
//           ),
//         );

//         showAlert(res.data.message || "Status updated", "success");
//       })
//       .catch((err) => {
//         showAlert(
//           err.response?.data?.message || "Failed to update status",
//           "error",
//         );
//       })
//       .finally(() =>
//         setActionLoading((prev) => ({ ...prev, [delivery.id]: false })),
//       );
//   };

//   const openEdit = (delivery) => {
//     setActiveUser(delivery);
//     setEditFormData({
//       name: delivery.name || "",
//       email: delivery.email || "",
//       phone: delivery.phone || "",
//       work_type: delivery.work_type || "Full time",
//       password: "",
//       photo: null,
//     });
//     setEditModal(true);
//   };

//   const doEdit = () => {
//     if (editPasscode === "234567") {
//       const formData = new FormData();

//       Object.entries(editFormData).forEach(
//         ([key, value]) => value !== null && formData.append(key, value),
//       );

//       setActionLoading((prev) => ({ ...prev, [activeUser.id]: true }));

//       axios
//         .put(`http://38.60.244.137:3000/deliverymen/${activeUser.id}`, formData)
//         .then((res) => {
//           setDeliverymen((prev) =>
//             prev.map((u) =>
//               u.id === activeUser.id ? { ...u, ...editFormData } : u,
//             ),
//           );

//           showAlert(res.data.message || "Updated successfully", "success");

//           setEditPasscodeModal(false);
//           setEditModal(false);
//         })
//         .catch((err) => {
//           showAlert(err.response?.data?.message || "Update failed", "error");
//         })
//         .finally(() =>
//           setActionLoading((prev) => ({ ...prev, [activeUser.id]: false })),
//         );
//     } else {
//       showAlert("Incorrect passcode", "warning");
//     }
//   };

//   return (
//     <div className="bg-[#0f172a] text-gray-100 min-h-full pt-6">
//       {/* Top Bar */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
//         <button
//           onClick={() => setShowForm(true)}
//           className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md hover:opacity-90 transition"
//         >
//           + Add New Delivery Man
//         </button>

//         <div className="flex items-center gap-3">
//           <div className="relative w-[280px]">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
//             <input
//               type="text"
//               placeholder="Search deliverymen..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 bg-[#1e293b] border-slate-700 text-gray-200"
//             />
//           </div>

//           <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border shadow-sm transition hover:shadow-md bg-[#1e293b] border-slate-700 text-gray-200">
//             <Download className="h-4 w-4" />
//             Export
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="rounded-2xl overflow-hidden shadow-xl backdrop-blur-xl border bg-[#1e293b]/80 border-slate-700">
//         <table className="min-w-full text-sm">
//           <thead className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
//             <tr>
//               {[
//                 "ID",
//                 "Deliveryman",
//                 "Email",
//                 "Phone",
//                 "Work Type",
//                 "Orders",
//                 "Status",
//                 "Date & Time",
//                 "Action",
//               ].map((col) => (
//                 <th
//                   key={col}
//                   className="p-4 text-center font-medium tracking-wide"
//                 >
//                   {col}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {paginatedUsers.length === 0 ? (
//               <tr>
//                 <td colSpan={9} className="text-center p-8 text-gray-400">
//                   No results found.
//                 </td>
//               </tr>
//             ) : (
//               paginatedUsers.map((delivery) => (
//                 <tr
//                   key={delivery.id}
//                   className={`border-t transition-all duration-300 ${
//                     delivery.status === "active"
//                       ? "bg-green-900/30 hover:bg-green-900/40 border-green-700"
//                       : delivery.status === "warning"
//                         ? "bg-red-900/30 hover:bg-red-900/40 border-red-700"
//                         : "hover:bg-slate-800 border-slate-700"
//                   }`}
//                 >
//                   <td className="p-4 text-center">{delivery.id}</td>

//                   <td className="p-4 flex items-center gap-3 justify-center">
//                     {delivery.photo ? (
//                       <img
//                         src={`http://38.60.244.137:3000/deliverymen-uploads/${delivery.photo}`}
//                         alt={delivery.name}
//                         className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
//                         {delivery.name?.charAt(0).toUpperCase() || "?"}
//                       </div>
//                     )}
//                     <span>{delivery.name}</span>
//                   </td>

//                   <td className="p-4 text-center">{delivery.email}</td>
//                   <td className="p-4 text-center">{delivery.phone}</td>
//                   {/* <td className="p-4 text-center">{delivery.work_type}</td> */}
//                   <td className="p-4 text-center">
//                     {delivery.work_type ?? "-"}
//                   </td>

//                   <td className="p-4 text-center">
//                     <div className="flex flex-col text-xs">
//                       <span>Total: {delivery.total_order}</span>
//                       <span>Assigned: {delivery.assign_order}</span>
//                     </div>
//                   </td>

//                   {/* STATUS BADGE */}
//                   <td className="p-4 text-center">
//                     <div className="flex justify-center gap-2">
//                       <button
//                         onClick={() => toggleStatus(delivery, "active")}
//                         disabled={!!actionLoading[delivery.id]}
//                         className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
//                           delivery.status === "active"
//                             ? "bg-green-500 text-white shadow-md"
//                             : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
//                         } ${actionLoading[delivery.id] ? "opacity-50 cursor-not-allowed" : ""}`}
//                       >
//                         Active
//                       </button>

//                       <button
//                         onClick={() => toggleStatus(delivery, "warning")}
//                         disabled={!!actionLoading[delivery.id]}
//                         className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
//                           delivery.status === "warning"
//                             ? "bg-red-500 text-white shadow-md"
//                             : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
//                         } ${actionLoading[delivery.id] ? "opacity-50 cursor-not-allowed" : ""}`}
//                       >
//                         Warning
//                       </button>
//                     </div>
//                   </td>

//                   <td className="p-4 text-center">
//                     {splitDateTime(delivery.created_at)[0]} <br />
//                     {splitDateTime(delivery.created_at)[1]}
//                   </td>

//                   <td className="p-4 flex gap-2 justify-center">
//                     <button
//                       onClick={() => openEdit(delivery)}
//                       className="px-3 py-1.5 rounded-full bg-yellow-500/90 text-white text-xs hover:opacity-90 transition"
//                     >
//                       Edit
//                     </button>

//                     <button
//                       onClick={() => openDeletePasscode(delivery)}
//                       className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs flex items-center gap-1 hover:bg-red-600 transition shadow-sm"
//                     >
//                       <Trash2 className="h-3.5 w-3.5" />
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="flex justify-end items-center gap-2 mt-6">
//         <button
//           disabled={currentPage === 1}
//           onClick={() => setCurrentPage((p) => p - 1)}
//           className="px-4 py-1.5 rounded-full border text-sm hover:bg-indigo-500/10 disabled:opacity-40 transition"
//         >
//           Prev
//         </button>

//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//           <button
//             key={page}
//             onClick={() => setCurrentPage(page)}
//             className={`px-4 py-1.5 rounded-full text-sm border transition ${
//               currentPage === page
//                 ? "bg-indigo-500 text-white border-indigo-500"
//                 : "hover:bg-indigo-500/10"
//             }`}
//           >
//             {page}
//           </button>
//         ))}

//         <button
//           disabled={currentPage === totalPages || totalPages === 0}
//           onClick={() => setCurrentPage((p) => p + 1)}
//           className="px-4 py-1.5 rounded-full border text-sm hover:bg-indigo-500/10 disabled:opacity-40 transition"
//         >
//           Next
//         </button>
//       </div>

//       {/* DELETE PASSCODE MODAL */}
//       {passcodeModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setPasscodeModal(false)}
//           />
//           <div className="relative w-[360px] rounded-2xl p-6 shadow-2xl border bg-[#1e293b] border-slate-700 text-gray-200">
//             <h3 className="text-lg font-semibold text-center mb-2">
//               Confirm Delete
//             </h3>
//             <input
//               ref={passcodeInputRef}
//               type="password"
//               placeholder="Enter passcode"
//               value={passcode}
//               onChange={(e) => setPasscode(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && doDelete()}
//               className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 mb-4 text-sm bg-[#0f172a] border-slate-600 text-gray-200"
//             />
//             <div className="flex justify-between items-center">
//               <button
//                 onClick={() => setPasscodeModal(false)}
//                 className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-700 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={doDelete}
//                 className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition shadow"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT PASSCODE MODAL */}
//       {editPasscodeModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
//           <div
//             className="absolute inset-0 bg-black/50"
//             onClick={() => setEditPasscodeModal(false)}
//           />
//           <div className="relative w-[360px] rounded-2xl p-6 shadow-2xl border bg-[#1e293b] border-slate-700 text-gray-200">
//             <h3 className="text-lg font-semibold text-center mb-4">
//               Enter Passcode
//             </h3>
//             <input
//               ref={editPasscodeInputRef}
//               type="password"
//               placeholder="Enter passcode"
//               value={editPasscode}
//               onChange={(e) => setEditPasscode(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && doEdit()}
//               className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 mb-4 text-sm bg-[#0f172a] border-slate-600 text-gray-200"
//             />
//             <div className="flex justify-between">
//               <button
//                 onClick={() => setEditPasscodeModal(false)}
//                 className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-700 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={doEdit}
//                 className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm hover:opacity-90 transition shadow"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT FORM MODAL */}
//     {editModal && activeUser && (
//         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
//           <div className="rounded-3xl w-[480px] p-8 relative border shadow-[0_25px_80px_rgba(0,0,0,0.25)] bg-gray-900 border-gray-700 text-gray-100">
//             <h2 className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
//               Edit Delivery Man
//             </h2>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 setEditModal(false);
//                 setEditPasscodeModal(true);
//               }}
//               className="space-y-4"
//             >
//               {/* ---------- PHOTO UI ---------- */}
//               <div className="flex flex-col items-center mb-6">
//                 <div className="relative w-32 h-32 group">
//                   {editFormData.photo ? (
//                     <img
//                       src={URL.createObjectURL(editFormData.photo)}
//                       alt="Profile Preview"
//                       className="w-full h-full rounded-full object-cover border-4 shadow-xl ring-2 border-gray-800 ring-gray-600/40"
//                     />
//                   ) : activeUser.photo ? (
//                     <img
//                       src={`http://38.60.244.137:3000/deliverymen-uploads/${activeUser.photo}`}
//                       alt={activeUser.name}
//                       className="w-full h-full rounded-full object-cover border-4 shadow-xl ring-2 border-gray-800 ring-gray-600/40"
//                     />
//                   ) : (
//                     <div className="w-full h-full rounded-full flex items-center justify-center shadow-inner ring-2 bg-gray-800 ring-gray-600/30">
//                       <span className="font-semibold text-sm text-gray-200">
//                         Avatar
//                       </span>
//                     </div>
//                   )}

//                   <label className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full shadow-lg absolute bottom-1 right-1 bg-gray-800 text-gray-100 hover:bg-gray-700 transition-all duration-200">
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={(e) =>
//                         setEditFormData((prev) => ({
//                           ...prev,
//                           photo: e.target.files[0],
//                         }))
//                       }
//                       className="hidden"
//                     />
//                     <Camera className="w-4 h-4" />
//                   </label>
//                 </div>
//               </div>

//               {/* Inputs */}
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Name"
//                 value={editFormData.name}
//                 onChange={(e) =>
//                   setEditFormData((prev) => ({ ...prev, name: e.target.value }))
//                 }
//                 className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
//                 required
//               />
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 value={editFormData.email}
//                 onChange={(e) =>
//                   setEditFormData((prev) => ({
//                     ...prev,
//                     email: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 placeholder="Phone"
//                 value={editFormData.phone}
//                 onChange={(e) =>
//                   setEditFormData((prev) => ({
//                     ...prev,
//                     phone: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
//                 required
//               />
//               <select
//                 name="work_type"
//                 value={editFormData.work_type}
//                 onChange={(e) =>
//                   setEditFormData((prev) => ({
//                     ...prev,
//                     work_type: e.target.value,
//                   }))
//                 }
//                 className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
//               >
//                 <option>Full time</option>
//                 <option>Part time</option>
//               </select>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => setEditModal(false)}
//                   className="px-5 py-2 rounded-xl text-sm border border-gray-700 text-gray-100 hover:bg-gray-700 transition-all duration-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 rounded-xl text-sm font-medium shadow-lg bg-indigo-500 hover:bg-indigo-600 text-gray-100 transition-all duration-200"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>

//             <button
//               onClick={() => setEditModal(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
//             >
//               ✕
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { Camera, Download, Search, Trash2 } from "lucide-react";
import axios from "axios";
import { useAlert } from "../../AlertProvider";

export default function DeliveryTable({
  shopId,
  deliveryMen,
  setShowForm,
  onOpenChat,
}) {
  const [deliverymen, setDeliverymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const { showAlert, confirm } = useAlert();
  const [shops, setShops] = useState([]);
  const [editOpen, setEditOpen] = useState(false);

  const [passcodeModal, setPasscodeModal] = useState(false);
  const [passcode, setPasscode] = useState("");
  const passcodeInputRef = useRef(null);

  const [editModal, setEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    work_type: null,
    location: "",
    password: "",
    photo: null,
  });
  const [editPasscodeModal, setEditPasscodeModal] = useState(false);
  const [editPasscode, setEditPasscode] = useState("");
  const editPasscodeInputRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  // const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (!shopId) return; // safety

    const interval = setInterval(() => {
      axios
        .get(`http://38.60.244.137:3000/deliverymen-shop/${shopId}`)
        .then((res) => setDeliverymen(res.data))
        .catch((err) => console.error("API Error:", err));
    }, 500);

    return () => clearInterval(interval);
  }, [shopId]); // ✅ important dependency

  // useEffect(() => {
  //   axios
  //     .get("http://38.60.244.137:3000/shops")
  //     .then((res) => setShops(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  // const getShopName = (work_type) => {
  //   if (!work_type) return "-";
  //   const shop = shops.find((s) => s.id === work_type);
  //   return shop ? shop.shop_name : "-";
  // };
  const getShopName = (work_type) => {
    if (!work_type) return "-";
    return work_type;
  };

  const splitDateTime = (datetime) => {
    if (!datetime) return ["-", "-"];
    const [date, time] = datetime.split(" ");
    return [date, time.slice(0, 8)];
  };

  const filteredUsers = deliverymen.filter((delivery) => {
    const term = searchTerm.toLowerCase();
    return (
      delivery.name?.toLowerCase().includes(term) ||
      delivery.id?.toLowerCase().includes(term) ||
      delivery.email?.toLowerCase().includes(term) ||
      delivery.phone?.toLowerCase().includes(term) ||
      delivery.status?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  useEffect(() => setCurrentPage(1), [searchTerm]);

  const openDeletePasscode = (delivery) => {
    setActiveUser(delivery);
    setPasscode("");
    setPasscodeModal(true);
    setTimeout(() => passcodeInputRef.current?.focus(), 500);
  };

  const doDelete = () => {
    if (passcode === "234567") {
      setActionLoading((prev) => ({ ...prev, [activeUser.id]: true }));

      axios;
      axios
        .delete(
          `http://38.60.244.137:3000/deliverymen-shop/${shopId}/${activeUser.id}`,
        )
        .then((res) => {
          setDeliverymen((prev) => prev.filter((u) => u.id !== activeUser.id));

          showAlert(res.data.message || "Deleted successfully", "success");
        })
        .catch((err) => {
          showAlert(err.response?.data?.message || "Delete failed", "error");
        })
        .finally(() => {
          setActionLoading((prev) => ({
            ...prev,
            [activeUser.id]: false,
          }));
          setPasscodeModal(false);
        });
    } else {
      showAlert("Incorrect passcode", "warning");
    }
  };

  const toggleStatus = (delivery, newStatus) => {
    setActionLoading((prev) => ({ ...prev, [delivery.id]: true }));

    axios
      .patch(`http://38.60.244.137:3000/deliverymen/status/${delivery.id}`, {
        status: newStatus,
      })
      .then((res) => {
        setDeliverymen((prev) =>
          prev.map((u) =>
            u.id === delivery.id ? { ...u, status: newStatus } : u,
          ),
        );

        showAlert(res.data.message || "Status updated", "success");
      })
      .catch((err) => {
        showAlert(
          err.response?.data?.message || "Failed to update status",
          "error",
        );
      })
      .finally(() =>
        setActionLoading((prev) => ({ ...prev, [delivery.id]: false })),
      );
  };

  const openEdit = (delivery) => {
    setActiveUser(delivery);

    setEditFormData({
      name: delivery.name || "",
      email: delivery.email || "",
      phone: delivery.phone || "",
      location: delivery.location || "",
      work_type: delivery.work_type || null, // 👈 KEEP ID ONLY
      password: "",
      photo: null,
    });

    setEditModal(true);
  };
  const doEdit = () => {
    if (editPasscode === "234567") {
      const formData = new FormData();

      Object.entries(editFormData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          formData.append(key, value);
        }
      });

      // 🔥 FORCE ensure shop id always sent
      formData.set("work_type", editFormData.work_type || "");

      setActionLoading((prev) => ({ ...prev, [activeUser.id]: true }));

      axios
        .put(
          `http://38.60.244.137:3000/deliverymen-shop/${shopId}/${activeUser.id}`,
          formData,
        )
        .then((res) => {
          setDeliverymen((prev) =>
            prev.map((u) =>
              u.id === activeUser.id ? { ...u, ...editFormData } : u,
            ),
          );

          showAlert(res.data.message || "Updated successfully", "success");

          setEditPasscodeModal(false);
          setEditModal(false);
        })
        .catch((err) => {
          showAlert(err.response?.data?.message || "Update failed", "error");
        })
        .finally(() =>
          setActionLoading((prev) => ({ ...prev, [activeUser.id]: false })),
        );
    } else {
      showAlert("Incorrect passcode", "warning");
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
          <div className="relative w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
            <input
              type="text"
              placeholder="Search deliverymen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border text-sm shadow-sm focus:ring-2 focus:ring-indigo-500 bg-[#1e293b] border-slate-700 text-gray-200"
            />
          </div>

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border shadow-sm transition hover:shadow-md bg-[#1e293b] border-slate-700 text-gray-200">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
        <table className="w-full text-sm">
          <thead className="text-slate-400 border-b border-slate-700">
            <tr>
              {[
                "ID",
                "Deliveryman",
                "Email",
                "Phone",
                "Work Type",
                "Orders",
                "Status",
                "Date & Time",
                "Action",
              ].map((col) => (
                <th key={col} className="p-4 text-center font-medium ">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length === 0 ? (
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
                  <td className="p-4 text-center">{delivery.id}</td>

                  <td className="p-4 flex items-center gap-3 justify-center">
                    {delivery.photo ? (
                      <img
                        src={`http://38.60.244.137:3000/deliverymen-uploads/${delivery.photo}`}
                        alt={delivery.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                        {delivery.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <span>{delivery.name}</span>
                  </td>

                  <td className="p-4 text-center">{delivery.email}</td>
                  <td className="p-4 text-center">{delivery.phone}</td>
                  {/* <td className="p-4 text-center">{delivery.work_type}</td> */}
                  <td className="p-4 text-center">
                    {/* {delivery.work_type ?? "-"} */}
                    {getShopName(delivery.work_type)}
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex flex-col text-xs">
                      <span>Total: {delivery.total_order}</span>
                      <span>Assigned: {delivery.assign_order}</span>
                    </div>
                  </td>

                  {/* STATUS BADGE */}
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => toggleStatus(delivery, "active")}
                        disabled={!!actionLoading[delivery.id]}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          delivery.status === "active"
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                        } ${actionLoading[delivery.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Active
                      </button>

                      <button
                        onClick={() => toggleStatus(delivery, "warning")}
                        disabled={!!actionLoading[delivery.id]}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                          delivery.status === "warning"
                            ? "bg-red-500 text-white shadow-md"
                            : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                        } ${actionLoading[delivery.id] ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        Warning
                      </button>
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    {splitDateTime(delivery.created_at)[0]} <br />
                    {splitDateTime(delivery.created_at)[1]}
                  </td>

                  <td className="p-4 flex gap-2 justify-center">
                    <button
                      onClick={() => openEdit(delivery)}
                      className="px-3 py-1.5 rounded-full bg-yellow-500/90 text-white text-xs hover:opacity-90 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => openDeletePasscode(delivery)}
                      className="px-3 py-1.5 rounded-full bg-red-500/90 text-white text-xs flex items-center gap-1 hover:bg-red-600 transition shadow-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        {/* <div className="flex justify-between px-4 pt-4 text-sm text-neutral-400">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-1.5 rounded-full border text-sm hover:bg-indigo-500/10 disabled:opacity-40 transition"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-1.5 rounded-full text-sm border transition ${
                currentPage === page
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "hover:bg-indigo-500/10"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-1.5 rounded-full border text-sm hover:bg-indigo-500/10 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div> */}
        {/* ===== Pagination (NEW UI) ===== */}
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

      {/* DELETE PASSCODE MODAL */}
      {passcodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setPasscodeModal(false)}
          />
          <div className="relative w-[360px] rounded-2xl p-6 shadow-2xl border bg-[#1e293b] border-slate-700 text-gray-200">
            <h3 className="text-lg font-semibold text-center mb-2">
              Confirm Delete
            </h3>
            <input
              ref={passcodeInputRef}
              type="password"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doDelete()}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 mb-4 text-sm bg-[#0f172a] border-slate-600 text-gray-200"
            />
            <div className="flex justify-between items-center">
              <button
                onClick={() => setPasscodeModal(false)}
                className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={doDelete}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm hover:bg-red-600 transition shadow"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PASSCODE MODAL */}
      {editPasscodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setEditPasscodeModal(false)}
          />
          <div className="relative w-[360px] rounded-2xl p-6 shadow-2xl border bg-[#1e293b] border-slate-700 text-gray-200">
            <h3 className="text-lg font-semibold text-center mb-4">
              Enter Passcode
            </h3>
            <input
              ref={editPasscodeInputRef}
              type="password"
              placeholder="Enter passcode"
              value={editPasscode}
              onChange={(e) => setEditPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doEdit()}
              className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 mb-4 text-sm bg-[#0f172a] border-slate-600 text-gray-200"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setEditPasscodeModal(false)}
                className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={doEdit}
                className="px-4 py-2 rounded-xl bg-indigo-500 text-white text-sm hover:opacity-90 transition shadow"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT FORM MODAL */}
      {editModal && activeUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300">
          <div className="rounded-3xl w-[480px] p-8 relative border shadow-[0_25px_80px_rgba(0,0,0,0.25)] bg-gray-900 border-gray-700 text-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-center bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
              Edit Delivery Man
            </h2>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setEditModal(false);
                setEditPasscodeModal(true);
              }}
              className="space-y-4"
            >
              {/* ---------- PHOTO UI ---------- */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32 group">
                  {editFormData.photo ? (
                    <img
                      src={URL.createObjectURL(editFormData.photo)}
                      alt="Profile Preview"
                      className="w-full h-full rounded-full object-cover border-4 shadow-xl ring-2 border-gray-800 ring-gray-600/40"
                    />
                  ) : activeUser.photo ? (
                    <img
                      src={`http://38.60.244.137:3000/deliverymen-uploads/${activeUser.photo}`}
                      alt={activeUser.name}
                      className="w-full h-full rounded-full object-cover border-4 shadow-xl ring-2 border-gray-800 ring-gray-600/40"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full flex items-center justify-center shadow-inner ring-2 bg-gray-800 ring-gray-600/30">
                      <span className="font-semibold text-sm text-gray-200">
                        Avatar
                      </span>
                    </div>
                  )}

                  <label className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full shadow-lg absolute bottom-1 right-1 bg-gray-800 text-gray-100 hover:bg-gray-700 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          photo: e.target.files[0],
                        }))
                      }
                      className="hidden"
                    />
                    <Camera className="w-4 h-4" />
                  </label>
                </div>
              </div>

              {/* Inputs */}
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={editFormData.name}
                onChange={(e) =>
                  setEditFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={editFormData.location}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={editFormData.email}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={editFormData.phone}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
                required
              />
              {/* <select
                name="work_type"
                value={editFormData.work_type}
                onChange={(e) =>
                  setEditFormData((prev) => ({
                    ...prev,
                    work_type: e.target.value,
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl text-sm border focus:ring-2 focus:border-gray-500 bg-gray-800 border-gray-700 text-gray-100"
              >
                <option>Full time</option>
                <option>Part time</option>
              </select> */}

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditModal(false)}
                  className="px-5 py-2 rounded-xl text-sm border border-gray-700 text-gray-100 hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-medium shadow-lg bg-indigo-500 hover:bg-indigo-600 text-gray-100 transition-all duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>

            <button
              onClick={() => setEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
