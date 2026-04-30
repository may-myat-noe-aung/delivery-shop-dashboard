// import React, { useEffect, useState, useMemo } from "react";
// import { Eye, Download, Search } from "lucide-react";
// import OrderPopup from "./OrderPopup";

// export default function OrdersTable({ shopId }) {
//   const [orders, setOrders] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [orderTab, setOrderTab] = useState("normal");

//   // Pagination & Search
//   const [page, setPage] = useState(1);
//   const [pageSize] = useState(5);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [csvMessage, setCsvMessage] = useState("");

//   const typeColors = {
//     Fast: "text-red-400",
//     Normal: "text-green-400",
//     Timer: "text-yellow-400",
//     Special: "text-purple-400",
//   };

//   // Debounced fetch with 500ms
//   useEffect(() => {
//     if (!shopId) return;

//     const fetchAndUpdate = async () => {
//       try {
//         const res = await fetch(
//           `http://38.60.244.137:3000/orders-by-shop/${shopId}`,
//         );
//         const data = await res.json();
//         if (data.success) setOrders(data.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAndUpdate(); // Initial fetch

//     const interval = setInterval(() => {
//       fetchAndUpdate();
//     }, 500); // Poll every 500ms

//     return () => clearInterval(interval);
//   }, [shopId]);

//   const fetchOrders = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(
//         `http://38.60.244.137:3000/orders-by-shop/${shopId}`,
//       );
//       const data = await res.json();

//       if (data.success) {
//         setOrders(data.data);
//       } else {
//         setError("Failed to fetch orders.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong while fetching orders.");
//     } finally {
//       setLoading(false);
//       setPage(1); // Reset page after new fetch
//     }
//   };

//   // --- Helpers ---
//   const getOrderTotal = (order) =>
//     order.orders.reduce((sum, item) => sum + item.total, 0);

//   const getOrderStatus = (order) => {
//     const statuses = order.orders.map((item) => item.status);
//     if (statuses.includes(0))
//       return { label: "Pending", color: "text-yellow-400" };
//     if (statuses.includes(2))
//       return { label: "Rejected", color: "text-red-400" };
//     if (statuses.every((s) => s === 1))
//       return { label: "Approved", color: "text-green-400" };
//     return { label: "Unknown", color: "text-slate-400" };
//   };

//   // Filtered orders by search & date
//   // const filteredOrders = useMemo(() => {
//   //   return orders.filter((order) => {
//   //     const matchesSearch =
//   //       order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   //       order.id.toLowerCase().includes(searchTerm.toLowerCase());
//   //     const orderDate = order.date ? new Date(order.date) : new Date();
//   //     const matchesFrom = fromDate ? orderDate >= new Date(fromDate) : true;
//   //     const matchesTo = toDate ? orderDate <= new Date(toDate) : true;
//   //     return matchesSearch && matchesFrom && matchesTo;
//   //   });
//   // }, [orders, searchTerm, fromDate, toDate]);
//   // --- Filtered orders by search & date ---
// // --- Filtered orders by search & date ---
// const filteredOrders = useMemo(() => {
//   return orders.filter((order) => {
//     const matchesSearch =
//       order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       order.id.toLowerCase().includes(searchTerm.toLowerCase());

//     const orderDate = order.created_at
//       ? new Date(order.created_at.split(" ")[0])
//       : new Date();

//     const matchesFrom = fromDate ? orderDate >= new Date(fromDate) : true;
//     const matchesTo = toDate ? orderDate <= new Date(toDate) : true;

//     return matchesSearch && matchesFrom && matchesTo;
//   });
// }, [orders, searchTerm, fromDate, toDate]);

// // --- Filtered by orderTab before pagination ---
// const tabFilteredOrders = useMemo(() => {
//   return filteredOrders.filter((order) =>
//     orderTab === "normal" ? !order.timer : order.timer
//   );
// }, [filteredOrders, orderTab]);

// // --- Pagination ---
// const totalPages = Math.ceil(tabFilteredOrders.length / pageSize);
// const paginatedOrders = tabFilteredOrders.slice(
//   (page - 1) * pageSize,
//   page * pageSize
// );

// // --- Displayed orders (just alias for clarity) ---
// const displayOrders = paginatedOrders;

// // // Filter by tab (Normal / Timer)
// // const displayOrders = paginatedOrders.filter((order) =>
// //   orderTab === "normal" ? !order.timer : order.timer
// // );
//   // CSV Export
//   const handleExport = () => {
//     const csvContent = [
//       ["Order ID", "User ID", "Customer", "Type", "Items", "Total", "Status"],
//       ...filteredOrders.map((order) => [
//         order.id,
//         order.userId,
//         order.name,
//         order.type,
//         order.orders.length,
//         getOrderTotal(order),
//         getOrderStatus(order).label,
//       ]),
//     ]
//       .map((row) => row.join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `orders_shop_${shopId}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     setCsvMessage("CSV exported successfully!");
//     setTimeout(() => setCsvMessage(""), 2000);
//   };

//   return (
//     <div className="min-h-screen  text-white ">
//       {/* CSV Toast */}
//       {csvMessage && (
//         <div className="mb-2 text-center py-2 px-3 bg-green-600 text-white rounded-md animate-pulse">
//           {csvMessage}
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <h2 className="text-2xl font-semibold text-indigo-400">
//           Customer Orders ({shopId || "Unknown"})
//         </h2>
//         <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
//           <div className="flex gap-3">
//             <div className="relative">
//               <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
//               <input
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search orders..."
//                 className="w-full md:w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               />
//             </div>
//             <button
//               onClick={handleExport}
//               className="flex items-center gap-1 px-3 py-1 rounded-2xl border border-neutral-700 text-xs text-neutral-300 hover:text-white"
//             >
//               <Download size={14} /> Export
//             </button>
//           </div>
//           <div className="flex gap-3 justify-end">
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="rounded-2xl bg-indigo-400 text-neutral-900 pl-3 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 hover:bg-indigo-300 focus:ring-indigo-300"
//             />
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="rounded-2xl bg-indigo-400 text-neutral-900 pl-3 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 hover:bg-indigo-300 focus:ring-indigo-300"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="flex gap-3 mb-4">
//   <button
//     onClick={() => setOrderTab("normal")}
//     className={`px-4 py-2 rounded-full text-sm ${
//       orderTab === "normal"
//         ? "bg-indigo-500 text-white"
//         : "bg-neutral-800 text-neutral-400"
//     }`}
//   >
//     Normal Orders
//   </button>

//   <button
//     onClick={() => setOrderTab("timer")}
//     className={`px-4 py-2 rounded-full text-sm ${
//       orderTab === "timer"
//         ? "bg-yellow-500 text-black"
//         : "bg-neutral-800 text-neutral-400"
//     }`}
//   >
//     Timer Orders
//   </button>
// </div>
//       <div className="bg-[#1a2030]/80 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-6">
//         {loading ? (
//           <div className="text-center text-slate-400 py-10">
//             Loading orders...
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-500 py-10">{error}</div>
//         ) : paginatedOrders.length === 0 ? (
//           <div className="text-center text-slate-400 py-10">
//             No orders found.
//           </div>
//         ) : (
//           <div className="overflow-x-auto">

// <table className="w-full text-sm">
//   <thead className="text-slate-400 border-b border-slate-700">
//     <tr>
//       <th className="py-4 text-left">Orders Done</th>
//       <th className="py-4 text-left">Order ID</th>
//       <th className="py-4 text-left">User ID</th>
//       <th className="py-4 text-left">Customer</th>
//       <th className="py-4 text-left">Phone Number</th>
//       <th className="py-4 text-left">Type</th>
//       <th className="py-4 text-left">Items</th>
//       <th className="py-4 text-left">Total</th>
//       <th className="py-4 text-left">Status</th>

//       {/* Timer Column Header */}
//       {orderTab === "timer" && <th className="py-4 text-left">Timer</th>}

//       <th className="py-4 text-left">Action</th>
//     </tr>
//   </thead>

//   <tbody>
//     {displayOrders.map((order) => {
//       const status = getOrderStatus(order);
//       return (
//         <tr
//           key={order.id}
//           className="border-b border-slate-800 hover:bg-slate-800/40 transition duration-200"
//         >
//           <td className="py-4">
//             <label className="relative inline-flex items-center cursor-pointer">
//               <input
//                 type="checkbox"
//                 checked={order.orders_done === 1}
//                 readOnly
//                 className="sr-only"
//               />
//               <div
//                 className={`w-6 h-6 rounded-md border-2 border-neutral-600 flex items-center justify-center transition ${
//                   order.orders_done === 1
//                     ? "bg-green-500 border-green-500"
//                     : "bg-transparent"
//                 }`}
//               >
//                 {order.orders_done === 1 && (
//                   <svg
//                     className="w-4 h-4 text-white"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="3"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 )}
//               </div>
//             </label>
//           </td>

//           <td className="py-4 font-semibold text-cyan-400">{order.id}</td>
//           <td className="py-4 font-semibold text-green-400">{order.userId}</td>
//           <td className="py-4 font-semibold">{order.name}</td>
//           <td className="py-4 font-semibold">{order.phone}</td>
//           <td
//             className={`py-4 font-semibold ${
//               typeColors[order.type] || "text-white"
//             }`}
//           >
//             {order.type}
//           </td>
//           <td className="py-4">{order.orders.length} items</td>
//           <td className="py-4 font-semibold text-indigo-400">
//             {getOrderTotal(order).toLocaleString()} Ks
//           </td>
//           <td className={`py-4 font-semibold ${status.color}`}>{status.label}</td>

//           {/* Timer Column Cell */}
//           {orderTab === "timer" && (
//             <td className="py-4 font-semibold text-yellow-400">
//               {order.timer ? new Date(order.timer).toLocaleString() : "-"}
//             </td>
//           )}

//           <td className="py-4">
//             <button
//               onClick={() => setSelected(order)}
//               className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm transition"
//             >
//               <Eye size={16} />
//               View
//             </button>
//           </td>
//         </tr>
//       );
//     })}
//   </tbody>
// </table>

//             {/* Pagination */}
//             <div className="flex flex-col md:flex-row justify-between px-4 pt-4 text-sm text-neutral-400 gap-2 md:gap-0">
//               <p>
//                 Page {totalPages === 0 ? 0 : page} of {totalPages}
//               </p>
//               <div className="flex gap-2 flex-wrap">
//                 <button
//                   disabled={page === 1}
//                   onClick={() => setPage(Math.max(1, page - 1))}
//                   className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                     page === 1
//                       ? "text-neutral-500 cursor-not-allowed"
//                       : "text-indigo-400 hover:bg-neutral-900"
//                   }`}
//                 >
//                   Prev
//                 </button>

//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                   (n) => (
//                     <button
//                       key={n}
//                       onClick={() => setPage(n)}
//                       className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                         page === n
//                           ? "bg-indigo-300 text-black font-semibold"
//                           : "text-indigo-300 hover:bg-neutral-900"
//                       }`}
//                     >
//                       {n}
//                     </button>
//                   ),
//                 )}

//                 <button
//                   disabled={page === totalPages}
//                   onClick={() => setPage(Math.min(totalPages, page + 1))}
//                   className={`px-3 py-1 rounded-md border border-neutral-700 ${
//                     page === totalPages
//                       ? "text-neutral-500 cursor-not-allowed"
//                       : "text-indigo-500 hover:bg-neutral-900"
//                   }`}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Order Popup */}
//       {/* {selected && (
//         <OrderPopup order={selected} close={() => setSelected(null)} />
//       )} */}
//       {selected && (
//   <OrderPopup
//     order={selected}
//     close={() => setSelected(null)}
//     shopId={shopId} // ✅ pass shopId here
//   />
// )}
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { Eye, Download, Search } from "lucide-react";
import OrderPopup from "./OrderPopup";
import { useAlert } from "../../AlertProvider";

export default function OrdersTable({ shopId }) {
  const { showAlert, confirm } = useAlert();
  const [pickedOrders, setPickedOrders] = useState({});
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderTab, setOrderTab] = useState("normal");

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
          `http://38.60.244.137:3000/orders-by-shop/${shopId}`,
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
        `http://38.60.244.137:3000/orders-by-shop/${shopId}`,
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

  const handlePickup = async (orderId) => {
    // 🟡 Step 1: Show confirm popup
    const isConfirmed = await confirm("Are you sure to pickup this order?");

    if (!isConfirmed) return; // ❌ user clicked NO

    try {
      const res = await fetch(
        `http://38.60.244.137:3000/pickup-order/${orderId}`,
        { method: "PATCH" },
      );

      const data = await res.json();

      if (data.success) {
        // ✅ mark checkbox checked
        setPickedOrders((prev) => ({
          ...prev,
          [orderId]: true,
        }));

        // ✅ show API message
        showAlert(data.message, "success");
      } else {
        showAlert("Pickup failed", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "error");
    }
  };

  // --- Helpers ---
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

  // Filtered orders by search & date
  // const filteredOrders = useMemo(() => {
  //   return orders.filter((order) => {
  //     const matchesSearch =
  //       order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       order.id.toLowerCase().includes(searchTerm.toLowerCase());
  //     const orderDate = order.date ? new Date(order.date) : new Date();
  //     const matchesFrom = fromDate ? orderDate >= new Date(fromDate) : true;
  //     const matchesTo = toDate ? orderDate <= new Date(toDate) : true;
  //     return matchesSearch && matchesFrom && matchesTo;
  //   });
  // }, [orders, searchTerm, fromDate, toDate]);
  // --- Filtered orders by search & date ---
  // --- Filtered orders by search & date ---
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());

      const orderDate = order.created_at
        ? new Date(order.created_at.split(" ")[0])
        : new Date();

      const matchesFrom = fromDate ? orderDate >= new Date(fromDate) : true;
      const matchesTo = toDate ? orderDate <= new Date(toDate) : true;

      return matchesSearch && matchesFrom && matchesTo;
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

  // // Filter by tab (Normal / Timer)
  // const displayOrders = paginatedOrders.filter((order) =>
  //   orderTab === "normal" ? !order.timer : order.timer
  // );
  // CSV Export
  const handleExport = () => {
    const csvContent = [
      ["Order ID", "User ID", "Customer", "Type", "Items", "Total", "Status"],
      ...filteredOrders.map((order) => [
        order.id,
        order.userId,
        order.name,
        order.type,
        order.orders.length,
        getOrderTotal(order),
        getOrderStatus(order).label,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_shop_${shopId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCsvMessage("CSV exported successfully!");
    setTimeout(() => setCsvMessage(""), 2000);
  };

  return (
    <div className="min-h-screen  text-white ">
      {/* CSV Toast */}
      {csvMessage && (
        <div className="mb-2 text-center py-2 px-3 bg-green-600 text-white rounded-md animate-pulse">
          {csvMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-semibold text-indigo-400">
          Customer Orders ({shopId || "Unknown"})
        </h2>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders..."
                className="w-full md:w-64 rounded-2xl bg-neutral-900 border border-neutral-700 pl-8 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1 px-3 py-1 rounded-2xl border border-neutral-700 text-xs text-neutral-300 hover:text-white"
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
          <div className="text-center text-slate-400 py-10">
            Loading orders...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : paginatedOrders.length === 0 ? (
          <div className="text-center text-slate-400 py-10">
            No orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-4 text-left">Pickup</th>
                  <th className="py-4 text-left">Order ID</th>
                  <th className="py-4 text-left">User ID</th>
                  <th className="py-4 text-left">Customer</th>
                  <th className="py-4 text-left">Phone Number</th>
                  <th className="py-4 text-left">Type</th>
                  <th className="py-4 text-left">Items</th>
                  <th className="py-4 text-left">Total</th>
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
                        <div
                          onClick={() => {
                            if (!pickedOrders[order.id]) {
                              handlePickup(order.id);
                            }
                          }}
                          //                       className={`w-5 h-5 flex items-center justify-center rounded border cursor-pointer transition
                          //   ${
                          //     pickedOrders[order.id]
                          //       ? "bg-indigo-500 border-indigo-500"
                          //       : "border-slate-500 hover:border-indigo-400"
                          //   }
                          // `}
                          className={`w-5 h-5 flex items-center justify-center rounded border transition
  ${
    pickedOrders[order.id]
      ? "bg-indigo-500 border-indigo-500 cursor-not-allowed opacity-70"
      : "border-slate-500 hover:border-indigo-400 cursor-pointer"
  }
`}
                        >
                          {pickedOrders[order.id] && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              viewBox="0 0 24 24"
                            >
                              <path d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="py-4 font-semibold text-cyan-400">
                        {order.id}
                      </td>
                      <td className="py-4 font-semibold text-green-400">
                        {order.userId}
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
                      <td className="py-4 font-semibold text-indigo-400">
                        {getOrderTotal(order).toLocaleString()} Ks
                      </td>
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
    </div>
  );
}
