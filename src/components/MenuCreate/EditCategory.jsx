// import React, { useState } from "react";
// import { useAlert } from "../../AlertProvider";

// export default function EditCategory({ id, currentData, onClose, onUpdate }) {
//   const { showAlert, confirm } = useAlert();

//   if (!currentData) return null;

//   const icons = [
//     "alcoholic",
//     "breakfast",
//     "cake",
//     "coffee",
//     "drink",    
//     "fastfood",
//     "lunch",
//     "morning",
//     "snack",
//     "sweets",
//   ];

//   const [name, setName] = useState(currentData.name);
//   const [icon, setIcon] = useState(currentData.icon);
//   const [loading, setLoading] = useState(false);

//   const handleSave = async () => {
//     const ok = await confirm("Are you sure you want to update like this?");
//     if (!ok) return;

//     setLoading(true);
//     try {
//       const payload = { name, icon };

//       const res = await fetch(`http://38.60.244.108:3000/categories/${id}`, {
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

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//       <div className="bg-[#1a2030] p-6 rounded-2xl w-96 relative">
//         <h2 className="text-white text-lg font-bold mb-4">Edit Category</h2>

//         {/* ICON PREVIEW */}
//         <div className="mb-4 flex justify-center">
//           {iconName && (
//             <img
//               src={`/categoriesIcon/${iconName}.png`}
//               alt={name}
//               className="w-20 h-20 object-cover rounded-lg"
//             />
//           )}
//         </div>

//         {/* NAME */}
//         <div className="mb-3">
//           <label className="text-white text-sm mb-1 block">Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm"
//           />
//         </div>

//         {/* ICON SELECT */}
//         <div className="mb-3">
//           <label className="text-white text-sm mb-1 block">Icon</label>
//           <select
//             value={icon}
//             onChange={(e) => setIcon(Number(e.target.value))}
//             className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm"
//           >
//             {icons.map((iconName, index) => (
//               <option key={index + 1} value={index + 1}>
//                 {iconName}
//               </option>
//             ))}
//           </select>
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

      const res = await fetch(`http://38.60.244.137:3000/categories/${id}`, {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a2030] p-6 rounded-2xl w-96 relative">
        <h2 className="text-white text-lg font-bold mb-4">Edit Category</h2>

        {/* ICON PREVIEW */}
        {/* <div className="mb-4 flex justify-center">
          {iconName && (
            <img
              src={`/categoriesIcon/${iconName}.png`}
              alt={name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
        </div> */}

        {/* NAME */}
        <div className="mb-3">
          <label className="text-white text-sm mb-1 block">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm"
          />
        </div>

        {/* CUSTOM ICON SELECT */}
        <div className="mb-3 relative" ref={dropdownRef}>
          <label className="text-white text-sm mb-1 block">Icon</label>
          <div
            className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-700 text-neutral-900 text-sm cursor-pointer flex justify-between items-center"
            onClick={() => setOpen(!open)}
          >
            <span className="flex items-center gap-2">
              {iconName && (
                <img
                  src={`/categoriesIcon/${iconName}.png`}
                  alt={iconName}
                  className="w-5 h-5 object-cover rounded"
                />
              )}
              {iconName}
            </span>
            <ChevronDown size={18} className="text-white" />
          </div>

          {open && (
            <div className="absolute z-10 w-full mt-1 bg-neutral-900 border border-neutral-700 rounded-lg max-h-60 overflow-y-auto shadow-lg">
              {icons.map((nameItem, idx) => (
                <div
                  key={idx + 1}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-neutral-800 ${
                    icon === idx + 1 ? "bg-neutral-800" : ""
                  }`}
                  onClick={() => {
                    setIcon(idx + 1);
                    setOpen(false);
                  }}
                >
                  <img
                    src={`/categoriesIcon/${nameItem}.png`}
                    alt={nameItem}
                    className="w-5 h-5 object-cover rounded bg-white"
                  />
                  <span className="text-white text-sm">{nameItem}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}