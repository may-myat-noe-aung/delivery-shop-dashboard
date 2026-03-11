// import React, { useState } from "react";
// import { useAlert } from "../AlertProvider";

// export default function OrderPopup({ order, close }) {
//   const { showAlert, confirm } = useAlert();
//   const [loading, setLoading] = useState(false);
//   const [localOrder, setLocalOrder] = useState(order);

//   // const shopId = localOrder.shopId;

//   const total =
//     localOrder?.orders?.reduce((sum, item) => sum + item.total, 0) || 0;

//   // =========================
//   // Single Approve / Reject
//   // =========================
//   const handleStatusChange = async (menu_id, action) => {
//     const actionName = action === "approve" ? "approve" : "reject";

//     const confirmed = await confirm(
//       `Are you sure you want to ${actionName} this order item?`,
//     );
//     if (!confirmed) return;

//     setLoading(true);

//     try {
//       const endpoint =
//         action === "approve"
//           ? "http://38.60.244.137:3000/orders-approved"
//           : "http://38.60.244.137:3000/orders-rejected";

//       const res = await fetch(endpoint, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           //  orderId: localOrder.id,
//           shopId: "S001",
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         showAlert(data.message, "success");

//         setLocalOrder((prev) => ({
//           ...prev,
//           orders: prev.orders.map((item) =>
//             item.menu_id === menu_id
//               ? { ...item, status: action === "approve" ? 1 : 2 }
//               : item,
//           ),
//           status: action === "approve" ? 1 : 2, // update order status
//         }));
//       } else {
//         showAlert(data.message || "Something went wrong!", "error");
//       }
//     } catch (err) {
//       showAlert("Network error. Try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Bulk Approve / Reject
//   // =========================
//   const handleAllStatusChange = async (action) => {
//     const actionName = action === "approve" ? "approve all" : "reject all";

//     const confirmed = await confirm(
//       `Are you sure you want to ${actionName} items in this order?`,
//     );
//     if (!confirmed) return;

//     setLoading(true);

//     try {
//       const endpoint =
//         action === "approve"
//           ? `http://38.60.244.137:3000/all-approved-orders/${localOrder.id}`
//           : `http://38.60.244.137:3000/all-rejected-orders/${localOrder.id}`;

//       // const res = await fetch(endpoint, {
//       //   method: "PATCH",
//       // });
//       const res = await fetch(endpoint, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           // orderId: localOrder.id,
//           // shopId: shopId,
//           // shopId: "S003",
//           body: JSON.stringify({ shopId }),
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         showAlert(data.message, "success");

//         setLocalOrder((prev) => ({
//           ...prev,
//           status: action === "approve" ? 1 : 2,
//           orders: prev.orders.map((item) => ({
//             ...item,
//             status: action === "approve" ? 1 : 2,
//           })),
//         }));
//       } else {
//         showAlert(data.message || "Something went wrong!", "error");
//       }
//     } catch (err) {
//       showAlert("Network error. Try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // Status Badge UI
//   // =========================
//   // const renderStatusBadge = () => {
//   //   if (localOrder.status === 1)
//   //     return (
//   //       <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
//   //         Approved
//   //       </span>
//   //     );

//   //   if (localOrder.status === 2)
//   //     return (
//   //       <span className="px-3 py-1 text-xs rounded-full bg-rose-500/20 text-rose-400">
//   //         Rejected
//   //       </span>
//   //     );

//   //   return (
//   //     <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
//   //       Pending
//   //     </span>
//   //   );
//   // };

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 w-full max-w-2xl text-white shadow-2xl relative max-h-[85vh] overflow-y-auto">
//         {/* Close */}
//         <button
//           onClick={close}
//           className="absolute top-4 right-5 text-slate-400 hover:text-white text-lg"
//         >
//           ✕
//         </button>

//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold text-indigo-400">
//             Order #{localOrder.id}
//           </h3>
//           {/* {renderStatusBadge()} */}
//         </div>

//         {/* Customer Info */}
//         <div className="mb-6 text-md space-y-2">
//           <p>
//             <span className="text-slate-400">Customer:</span> {localOrder.name}
//           </p>
//           <p>
//             <span className="text-slate-400">Phone:</span> {localOrder.phone}
//           </p>
//           <p>
//             <span className="text-slate-400">Remark:</span> {localOrder.remark}
//           </p>
//         </div>

//         {/* Items */}
//         <div className="bg-slate-800 rounded-2xl p-4 mb-6 space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
//           {localOrder.orders.map((item, i) => (
//             <div
//               key={i}
//               className="flex justify-between border-b border-slate-700 pb-3"
//             >
//               <div>
//                 <p className="font-medium">{item.menu_name}</p>

//                 <p className="text-sm text-slate-400 pt-2">
//                   Size: {item.size} × {item.quantity}
//                 </p>

//                 {/* Ingredients */}
//                 <p className="text-sm text-slate-400 pt-2">
//                   Ingredients:{" "}
//                   {item.ingredients.length > 0
//                     ? item.ingredients.map((ing) => (
//                         <span
//                           key={ing.ingredients_id}
//                           className="inline-block bg-slate-700 px-2 py-0.5 rounded-lg mr-1 mt-1"
//                         >
//                           {ing.ingredients_name}
//                         </span>
//                       ))
//                     : "None"}
//                 </p>
//               </div>

//               <div className="flex flex-col items-end gap-2">
//                 <p className="text-indigo-400 font-medium">
//                   {item.total.toLocaleString()} Ks
//                 </p>

//                 {/* Product Description */}
//                 {item.product_description && (
//                   <p className="text-xs text-slate-400 mt-1">
//                     {item.product_description}
//                   </p>
//                 )}

//                 {/* STATUS + BUTTON SECTION */}
//                 {/* {item.status === 0 && (
//                   <>
//                     <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400">
//                       Pending
//                     </span>

//                     <div className="flex gap-2 mt-1">
//                       <button
//                         disabled={loading}
//                         onClick={() =>
//                           handleStatusChange(item.menu_id, "reject")
//                         }
//                         className="px-3 py-1 rounded-xl text-white text-xs bg-rose-600 hover:bg-rose-500 transition"
//                       >
//                         Reject
//                       </button>

//                       <button
//                         disabled={loading}
//                         onClick={() =>
//                           handleStatusChange(item.menu_id, "approve")
//                         }
//                         className="px-3 py-1 rounded-xl text-white text-xs bg-emerald-600 hover:bg-emerald-500 transition"
//                       >
//                         Approve
//                       </button>
//                     </div>
//                   </>
//                 )} */}

//                 {/* {item.status === 1 && (
//                   <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
//                   Confirm
//                   </span>
//                 )} */}

//                 {/* {item.status === 2 && (
//                   <span className="px-3 py-1 text-xs rounded-full bg-rose-500/20 text-rose-400">
//                     Rejected
//                   </span>
//                 )} */}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Total */}
//         <div className="flex justify-between items-center mb-6">
//           <span className="font-medium">Total</span>
//           <span className="text-2xl font-bold text-cyan-400">
//             {total.toLocaleString()} Ks
//           </span>
//         </div>

//         {/* Bulk Buttons - Show only if at least one item is pending */}
//         {localOrder.orders.some((item) => item.status === 0) && (
//           <div className="flex justify-end gap-4 mb-4">
//             {/* <button
//       disabled={loading}
//       onClick={() => handleAllStatusChange("reject")}
//       className="px-5 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl transition"
//     >
//       Reject All
//     </button> */}

//             <button
//               disabled={loading}
//               onClick={() => handleAllStatusChange("approve")}
//               className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition"
//             >
//               Confirm
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useAlert } from "../AlertProvider";

export default function OrderPopup({ order, close, shopId }) {
  const { showAlert, confirm } = useAlert();
  const [loading, setLoading] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);

  const total =
    localOrder?.orders?.reduce((sum, item) => sum + item.total, 0) || 0;

  // =========================
  // Single Approve / Reject
  // =========================
  const handleStatusChange = async (menu_id, action) => {
    const actionName = action === "approve" ? "approve" : "reject";

    const confirmed = await confirm(
      `Are you sure you want to ${actionName} this order item?`
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      const endpoint =
        action === "approve"
          ? "http://38.60.244.137:3000/orders-approved"
          : "http://38.60.244.137:3000/orders-rejected";

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }), // ✅ dynamic shopId
      });

      const data = await res.json();

      if (res.ok) {
        showAlert(data.message, "success");

        setLocalOrder((prev) => ({
          ...prev,
          orders: prev.orders.map((item) =>
            item.menu_id === menu_id
              ? { ...item, status: action === "approve" ? 1 : 2 }
              : item
          ),
          status: action === "approve" ? 1 : 2,
        }));
      } else {
        showAlert(data.message || "Something went wrong!", "error");
      }
    } catch (err) {
      showAlert("Network error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Bulk Approve / Reject
  // =========================
  const handleAllStatusChange = async (action) => {
    const actionName = action === "approve" ? "approve all" : "reject all";

    const confirmed = await confirm(
      `Are you sure you want to ${actionName} items in this order?`
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      const endpoint =
        action === "approve"
          ? `http://38.60.244.137:3000/all-approved-orders/${localOrder.id}`
          : `http://38.60.244.137:3000/all-rejected-orders/${localOrder.id}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }), // ✅ dynamic shopId
      });

      const data = await res.json();

      if (res.ok) {
        showAlert(data.message, "success");

        setLocalOrder((prev) => ({
          ...prev,
          status: action === "approve" ? 1 : 2,
          orders: prev.orders.map((item) => ({
            ...item,
            status: action === "approve" ? 1 : 2,
          })),
        }));
      } else {
        showAlert(data.message || "Something went wrong!", "error");
      }
    } catch (err) {
      showAlert("Network error. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-8 w-full max-w-2xl text-white shadow-2xl relative max-h-[85vh] overflow-y-auto">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-5 text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-indigo-400">
            Order #{localOrder.id}
          </h3>
        </div>

        {/* Customer Info */}
        <div className="mb-6 text-md space-y-2">
          <p>
            <span className="text-slate-400">Customer:</span> {localOrder.name}
          </p>
          <p>
            <span className="text-slate-400">Phone:</span> {localOrder.phone}
          </p>
          <p>
            <span className="text-slate-400">Remark:</span> {localOrder.remark}
          </p>
        </div>

        {/* Items */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6 space-y-4 max-h-[300px] overflow-y-auto scrollbar-hide">
          {localOrder.orders.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-slate-700 pb-3"
            >
              <div>
                <p className="font-medium">{item.menu_name}</p>
                <p className="text-sm text-slate-400 pt-2">
                  Size: {item.size} × {item.quantity}
                </p>
                <p className="text-sm text-slate-400 pt-2">
                  Ingredients:{" "}
                  {item.ingredients.length > 0
                    ? item.ingredients.map((ing) => (
                        <span
                          key={ing.ingredients_id}
                          className="inline-block bg-slate-700 px-2 py-0.5 rounded-lg mr-1 mt-1"
                        >
                          {ing.ingredients_name}
                        </span>
                      ))
                    : "None"}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <p className="text-indigo-400 font-medium">
                  {item.total.toLocaleString()} Ks
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <span className="font-medium">Total</span>
          <span className="text-2xl font-bold text-cyan-400">
            {total.toLocaleString()} Ks
          </span>
        </div>

        {/* Bulk Buttons */}
        {localOrder.orders.some((item) => item.status === 0) && (
          <div className="flex justify-end gap-4 mb-4">
            <button
              disabled={loading}
              onClick={() => handleAllStatusChange("approve")}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl transition"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}