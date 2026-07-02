// import React, { useState, useRef, useEffect } from "react";
// import { useAlert } from "../../AlertProvider";
// import { ChevronDown } from "lucide-react";

// export default function EditCategory({ id, currentData, onClose, onUpdate }) {
//   const { showAlert, confirm } = useAlert();

//   if (!currentData) return null;

//   const icons = [
//     "snack",
//     "alcoholic",
//     "breakfast",
//     "cake",
//     "coffee",
//     "drink",
//     "fastfood",
//     "lunch",
//     "morning",
//     "sweets",
//   ];

//   const [name, setName] = useState(currentData.name);
//   const [icon, setIcon] = useState(currentData.icon);
//   const [loading, setLoading] = useState(false);

//   // Custom dropdown state
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleSave = async () => {
//     const ok = await confirm("Are you sure you want to update like this?");
//     if (!ok) return;

//     setLoading(true);
//     try {
//       const payload = { name, icon };

//       const res = await fetch(`https://api.pwezayshops.com/categories/${id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         showAlert(data?.message || "Updated successfully", "success");
//         onUpdate();
//         onClose();
//       } else {
//         showAlert(data?.error || "Update failed", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Server error", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const iconName = icons[icon - 1]; // for preview

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-[#1a2030] p-6 rounded-2xl w-96 relative">
//         <h2 className="text-white text-lg font-bold mb-4">Edit Category</h2>

//         {/* ICON PREVIEW */}
//         {/* <div className="mb-4 flex justify-center">
//           {iconName && (
//             <img
//               src={`/categoriesIcon/${iconName}.png`}
//               alt={name}
//               className="w-20 h-20 object-cover rounded-lg"
//             />
//           )}
//         </div> */}

//         {/* NAME */}
//         <div className="mb-3">
//           <label className="text-white text-sm mb-1 block">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm"
//           />
//         </div>

//         {/* CUSTOM ICON SELECT */}
//         <div className="mb-3 relative" ref={dropdownRef}>
//           <label className="text-white text-sm mb-1 block">Icon</label>
//           <div
//             className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-700 text-neutral-900 text-sm cursor-pointer flex justify-between items-center"
//             onClick={() => setOpen(!open)}
//           >
//             <span className="flex items-center gap-2">
//               {iconName && (
//                 <img
//                   src={`/categoriesIcon/${iconName}.png`}
//                   alt={iconName}
//                   className="w-5 h-5 object-cover rounded"
//                 />
//               )}
//               {iconName}
//             </span>
//             <ChevronDown size={18} className="text-white" />
//           </div>

//           {open && (
//             <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
//               {icons.map((nameItem, idx) => (
//                 <div
//                   key={idx + 1}
//                   className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-800 ${
//                     icon === idx + 1 ? "bg-neutral-800" : ""
//                   }`}
//                   onClick={() => {
//                     setIcon(idx + 1);
//                     setOpen(false);
//                   }}
//                 >
//                   <img
//                     src={`/categoriesIcon/${nameItem}.png`}
//                     alt={nameItem}
//                     className="w-5 h-5 object-cover rounded bg-white"
//                   />
//                   <span className="text-white text-sm">{nameItem}</span>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* ACTIONS */}
//         <div className="flex justify-end gap-2 mt-4">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={handleSave}
//             disabled={loading}
//             className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import { useAlert } from "../../AlertProvider";
import { ChevronDown } from "lucide-react";

export default function EditCategory({ id, currentData, onClose, onUpdate }) {
  const { showAlert, confirm } = useAlert();

  if (!currentData) return null;

  const icons = [
    "snack",
    "alcoholic",
    "breakfast",
    "cake",
    "coffee",
    "drink",
    "fastfood",
    "lunch",
    "morning",
    "sweets",
  ];

  const [name, setName] = useState(currentData.name);
  const [icon, setIcon] = useState(currentData.icon);
  const [loading, setLoading] = useState(false);

  // Custom dropdown state
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSave = async () => {
    const ok = await confirm("Are you sure you want to update like this?");
    if (!ok) return;

    setLoading(true);
    try {
      const payload = { name, icon };

      const res = await fetch(`https://api.pwezayshops.com/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert(data?.message || "Updated successfully", "success");
        onUpdate();
        onClose();
      } else {
        showAlert(data?.error || "Update failed", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  const iconName = icons[icon - 1]; // for preview

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed -inset-10 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#111827] p-6 rounded-2xl w-[500px] border border-gray-700 shadow-2xl">
        <h2 className="text-white text-lg font-bold mb-4">Edit Category</h2>

        {/* CATEGORY PREVIEW CARD */}
        {/* <div className="mb-4">
        <p className="text-gray-400 text-sm mb-2">Preview</p>

        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500 flex items-center gap-3">
          <img
            src={`/categoriesIcon/${iconName}.png`}
            className="w-10 h-10 bg-white rounded-lg p-1"
            alt="preview"
          />

          <div>
            <p className="text-white font-semibold">{name || "Category Name"}</p>
            <p className="text-gray-400 text-xs">{iconName}</p>
          </div>
        </div>
      </div> */}

        {/* ICON CARDS */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-2 block">
            Choose Icon
          </label>

          <div className="grid grid-cols-5 gap-3 max-h-48 overflow-y-auto">
            {icons.map((nameItem, idx) => (
              <div
                key={idx}
                onClick={() => setIcon(idx + 1)}
                className={`p-2 rounded-xl border cursor-pointer flex flex-col items-center transition ${
                  icon === idx + 1
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-700 hover:border-gray-500"
                }`}
              >
                <img
                  src={`/categoriesIcon/${nameItem}.png`}
                  className="w-8 h-8 bg-white rounded"
                  alt={nameItem}
                />

                <p className="text-[10px] text-gray-300 mt-1">{nameItem}</p>
              </div>
            ))}
          </div>
        </div>
        {/* NAME */}
        <div className="mb-4">
          <label className="text-gray-300 text-sm mb-1 block">
            Category Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-gray-700 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
