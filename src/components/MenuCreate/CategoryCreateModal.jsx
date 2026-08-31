import React, { useState } from "react";
import { useAlert } from "../../AlertProvider";
import { apiFetch } from "../../api";

export default function CategoryCreateModal({ shopId, close, onSuccess }) {
  const { showAlert } = useAlert();

  // ================= CATEGORY =================
  const categories = [
    {
      id: 1,
      name: "Fashion",
      icon: "fashion",
    },
    {
      id: 2,
      name: "Food & Restaurant",
      icon: "foodrestaurant",
    },
    {
      id: 3,
      name: "Electronic",
      icon: "electronic",
    },
    {
      id: 4,
      name: "Convenience Shop",
      icon: "convenience",
    },
    {
      id: 5,
      name: "Material",
      icon: "material",
    },
    {
      id: 6,
      name: "Fast Food",
      icon: "fastfood",
    },
    {
      id: 7,
      name: "Snack",
      icon: "snack",
    },
    {
      id: 8,
      name: "Breakfast",
      icon: "breakfast",
    },
    {
      id: 9,
      name: "Cake",
      icon: "cake",
    },
    {
      id: 10,
      name: "Coffee",
      icon: "coffee",
    },
    {
      id: 11,
      name: "Drink",
      icon: "drink",
    },
    {
      id: 12,
      name: "Lunch",
      icon: "lunch",
    },
    {
      id: 13,
      name: "Morning",
      icon: "morning",
    },
    {
      id: 14,
      name: "Sweets",
      icon: "sweets",
    },
    {
      id: 15,
      name: "Other",
      icon: "other",
    },
  ];

  const [name, setName] = useState("");
  const [icon, setIcon] = useState(categories[0].icon);
  const [loading, setLoading] = useState(false);

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
    const res = await apiFetch("https://api.pwezayshops.com/categories", {
  method: "POST",
  body: JSON.stringify({
    shop_id: shopId,
    name: name.trim(),
    icon: categories.find((c) => c.icon === icon)?.id,
  }),
});

if (!res) return;

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
        className="bg-[#111827] w-[810px] rounded-2xl p-6 border border-gray-700 shadow-xl"
        onClick={(e) => e.stopPropagation()} // ✅ prevent close when clicking inside
      >
        <h2 className="text-2xl text-indigo-500 mb-5">Add New Category</h2>
        {/* Icon Picker */}
        <div className="mb-4">
          <label className="text-gray-300  mb-2 block">
            Choose Icon
          </label>

          <div className="grid grid-cols-5 gap-3 2xl:max-h-[280px] max-h-[250px] overflow-y-auto">
            {categories.map((item) => (
              <div
                key={item.id}
                onClick={() => setIcon(item.icon)}
                className={`p-2 rounded-xl border  cursor-pointer flex flex-col items-center transition  ${icon === item.icon
                    ? "border-indigo-500 border-2 bg-black"
                    : "border-gray-700 bg-black hover:border-gray-500"
                  }`}
              >
                <img
                  src={`/categoriesIcon/${item.icon}.png`}

                  alt={item.name}
                  className="size-[90px] "
                />

                <p className="text-sm text-gray-300 mt-1">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Name */}
        <div className="mb-4">
          <label className="text-gray-300 block mb-1">Category Name</label>
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
            className={`px-4 py-2 text-white rounded ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600"
              }`}
          >
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
