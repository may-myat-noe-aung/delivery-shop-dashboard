import React, { useState, useRef, useEffect } from "react";
import { useAlert } from "../../AlertProvider";
import { ChevronDown } from "lucide-react";

export default function EditCategory({ id, currentData, onClose, onUpdate }) {
  const token = localStorage.getItem("shopToken");
  const { showAlert, confirm } = useAlert();

  if (!currentData) return null;

const icons = [
  "fashion",
  "foodrestaurant",
  "electronic",
  "convenience",
  "material",
  "fastfood",
  "snack",
  "breakfast",
  "cake",
  "coffee",
  "drink",
  "lunch",
  "morning",
  "sweets",
  "other",
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
        headers: { "Content-Type": "application/json",
          Authorization: `MSHteam ${token}`,
         },
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
      <div className="bg-[#111827] p-6 rounded-2xl w-[800px] border border-gray-700 shadow-2xl">
        <h2 className="text-indigo-500 text-2xl font-bold mb-4">Edit Category</h2>

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
          <label className="text-gray-300  mb-2 block">
            Choose Icon
          </label>

          <div className="grid grid-cols-5 gap-3 max-h-[280px] overflow-y-auto bg-black">
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
                  className="size-[100px] bg-white rounded"
                  alt={nameItem}
                />

                <p className="text-md text-gray-300 mt-1">{nameItem}</p>
              </div>
            ))}
          </div>
        </div>
        {/* NAME */}
        <div className="mb-4">
          <label className="text-gray-300  mb-1 block">
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
