
// import React, { useState } from "react";
// import { useAlert } from "../../AlertProvider";

// export default function CategoryCreateModal({ shopId, close, onSuccess }) {
//   const { showAlert } = useAlert();

//   const [name, setName] = useState("");
//   const [icon, setIcon] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       showAlert("Category name is required", "error");
//       return;
//     }

//     if (!shopId) {
//       showAlert("Shop ID missing", "error");
//       return;
//     }

//     if (!icon || icon < 1) {
//       showAlert("Invalid icon ID", "error");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         shop_id: shopId,
//         name: name.trim(),
//         icon,
//       };

//       console.log("🚀 Sending:", payload);

//       const res = await fetch("http://38.60.244.137:3000/categories", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();
//       console.log("✅ Response:", data);

//       const message =
//         data?.message ||
//         data?.error ||
//         "Failed to create category";

//       if (res.ok) {
//         showAlert(message, "success");
//         onSuccess();
//       } else {
//         showAlert(message, "error");
//       }
//     } catch (err) {
//       console.error("❌ Error:", err);
//       showAlert("Server error", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
//       <div className="bg-[#111827] w-[450px] rounded-2xl p-6 border border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
//         <h2 className="text-2xl font-semibold text-white mb-5">
//           Add New Category
//         </h2>

//         <div className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="text-gray-300 font-medium mb-1 block">
//               Category Name
//             </label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="e.g. Juice"
//               className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>

//           {/* Icon */}
//           <div>
//             <label className="text-gray-300 font-medium mb-1 block">
//               Icon ID
//             </label>
//             <input
//               type="number"
//               value={icon}
//               onChange={(e) => setIcon(Number(e.target.value))}
//               min={1}
//               className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500"
//             />
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3 mt-6">
//           <button
//             onClick={close}
//             className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className={`px-4 py-2 rounded-lg text-white font-medium ${
//               loading
//                 ? "bg-indigo-400 cursor-not-allowed"
//                 : "bg-indigo-600 hover:bg-indigo-500"
//             }`}
//           >
//             {loading ? "Creating..." : "Create Category"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import { useAlert } from "../../AlertProvider";

// export default function CategoryCreateModal({ shopId, close, onSuccess }) {
//   const { showAlert } = useAlert();

//   const [name, setName] = useState("");
//   const [icon, setIcon] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const icons = Array.from({ length: 10 }, (_, i) => i + 1);

//   const handleSubmit = async () => {
//     if (!name.trim()) {
//       showAlert("Category name is required", "error");
//       return;
//     }

//     if (!shopId) {
//       showAlert("Shop ID missing", "error");
//       return;
//     }

//     setLoading(true);

//     try {
//       const payload = {
//         shop_id: shopId,
//         name: name.trim(),
//         icon,
//       };

//       const res = await fetch("http://38.60.244.137:3000/categories", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         showAlert(data?.message || "Created successfully", "success");
//         onSuccess();
//       } else {
//         showAlert(data?.error || "Failed to create category", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Server error", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
//       <div className="bg-[#111827] w-[450px] rounded-2xl p-6 border border-gray-700 shadow-xl">
//         <h2 className="text-2xl text-white mb-5">Add New Category</h2>

//         {/* Name */}
//         <div className="mb-4">
//           <label className="text-gray-300 block mb-1">Category Name</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
//           />
//         </div>

//         {/* Icon Picker */}
//         <div className="mb-4">
//           <label className="text-gray-300 block mb-2">Choose Icon</label>

//           <div className="grid grid-cols-5 gap-3">
//             {icons.map((id) => (
//               <div
//                 key={id}
//                 onClick={() => setIcon(id)}
//                 className={`p-2 rounded-lg border cursor-pointer ${
//                   icon === id
//                     ? "border-indigo-500 bg-indigo-500/20"
//                     : "border-gray-700"
//                 }`}
//               >
//                 <img
//                   src={`/categoriesIcon/${id}.png`}
//                   alt={`icon-${id}`}
//                   className="w-10 h-10 mx-auto"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={close}
//             className="px-4 py-2 bg-gray-600 text-white rounded"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             disabled={loading}
//             className="px-4 py-2 bg-indigo-600 text-white rounded"
//           >
//             {loading ? "Creating..." : "Create"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { useAlert } from "../../AlertProvider";

export default function CategoryCreateModal({ shopId, close, onSuccess }) {
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("alcoholic");
  const [loading, setLoading] = useState(false);

  // ✅ match your public folder file names
  const icons = [
    "alcoholic",
    "breakfast",
    "cake",
    "coffee",
    "drink",
    "fastfood",
    "lunch",
    "morning",
    "snack",
    "sweets",
  ];

  // const handleSubmit = async () => {
  //   if (!name.trim()) {
  //     showAlert("Category name is required", "error");
  //     return;
  //   }

  //   if (!shopId) {
  //     showAlert("Shop ID missing", "error");
  //     return;
  //   }

  //   setLoading(true);

  //   try {
  //     const res = await fetch("http://38.60.244.137:3000/categories", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         shop_id: shopId,
  //         name: name.trim(),
  //         icon, // now sending string (e.g. "lunch")
  //       }),
  //     });

  //     let data;
  //     try {
  //       data = await res.json();
  //     } catch {
  //       data = {};
  //     }

  //     if (res.ok) {
  //       showAlert(data?.message || "Created successfully", "success");
  //       onSuccess?.();
  //       close();
  //     } else {
  //       showAlert(data?.error || "Failed to create category", "error");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     showAlert("Server error", "error");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async () => {
  if (!name.trim()) {
    showAlert("Category name is required", "error");
    return;
  }

  if (!shopId) {
    showAlert("Shop ID missing", "error");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("http://38.60.244.137:3000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop_id: shopId,
        name: name.trim(),
        icon: icons.indexOf(icon) + 1, // ✅ FIX HERE
      }),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (res.ok) {
      showAlert(data?.message || "Created successfully", "success");
      onSuccess?.();
      close();
    } else {
      showAlert(data?.error || "Failed to create category", "error");
    }
  } catch (err) {
    console.error(err);
    showAlert("Server error", "error");
  } finally {
    setLoading(false);
  }
};
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={close} // ✅ click outside to close
    >
      <div
        className="bg-[#111827] w-[450px] rounded-2xl p-6 border border-gray-700 shadow-xl"
        onClick={(e) => e.stopPropagation()} // ✅ prevent close when clicking inside
      >
        <h2 className="text-2xl text-white mb-5">Add New Category</h2>
 {/* Icon Picker */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-2">
            Choose Icon
          </label>

          <div className="grid grid-cols-5 gap-3">
            {icons.map((item) => (
              <div
                key={item}
                onClick={() => setIcon(item)}
                className={`p-2 rounded-lg border cursor-pointer bg-slate-400 ${
                  icon === item
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-gray-700"
                }`}
              >
                <img
                  src={`/categoriesIcon/${item}.png`}
                  alt={item}
                  className="w-10 h-10 mx-auto"
                />
              </div>
            ))}
          </div>
        </div>
        {/* Name */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-1">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()} // ✅ enter submit
            className="w-full p-2 rounded bg-gray-900 text-white border border-gray-700"
          />
        </div>

       

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600"
            }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}