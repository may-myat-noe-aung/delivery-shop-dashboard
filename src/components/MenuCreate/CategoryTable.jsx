import React, { useState, useEffect, useMemo } from "react";
import { Edit2, Search, Trash2 } from "lucide-react";
import { useAlert } from "../../AlertProvider";
import EditCategory from "./EditCategory";

export default function CategoryTable({ shopId }) {
  const { showAlert, confirm } = useAlert();

  const [editingCategory, setEditingCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  // const pageSize = 5;
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    const updateSize = () => {
      if (window.innerWidth > 1280) {
        setPageSize(7);
      } else {
        setPageSize(5);
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

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

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://api.pwezayshops.com/categories/${shopId}`,
      );

      const data = await res.json();

      // no categories
      if (res.status === 400) {
        setCategories([]);
        return;
      }

      if (res.ok && Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error(err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };
  // ⏱ Live fetch every 5 seconds
  useEffect(() => {
    if (!shopId) return;

    setLoading(true); // optional: show loading on first fetch
    fetchData(); // initial fetch

    const interval = setInterval(() => {
      fetchData(); // repeated fetch every 5s
    }, 500);

    return () => clearInterval(interval); // cleanup on unmount
  }, [shopId]);

  // 🔍 Search
  const filtered = useMemo(() => {
    return categories.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // 🗑 DELETE
  const handleDelete = async (id) => {
    const ok = await confirm("Are you sure you want to delete this category?");
    if (!ok) return;

    try {
      const res = await fetch(`https://api.pwezayshops.com/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
        showAlert(data?.message || "Deleted successfully", "success");
      } else {
        showAlert(data?.error || "Delete failed", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    }
  };

  return (
    <div className="mb-6">
      {/* 🔥 TITLE */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-indigo-400">
          Category List
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />

            <input
              type="text"
              placeholder="Search Categories..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="pl-10 pr-4 py-2 rounded-2xl text-sm bg-slate-900/60 border border-slate-700 text-white outline-none focus:border-indigo-500 w-full sm:w-[250px]"
            />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-7  gap-4">
          {paginated.map((item) => {
            const iconName = icons[item.icon - 1];

            return (
              <div
                key={item.id}
                className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#111827] shadow-lg hover:scale-[1.03] transition-all duration-300"
              >
                {/* ICON AREA */}
                <div className="relative flex justify-center items-center h-28 bg-white">
                  <img
                    src={`/categoriesIcon/${iconName}.png`}
                    alt={item.name}
                    className="w-16 h-16 object-contain drop-shadow-lg"
                  />

                  {/* TOP RIGHT ICONS (LIKE INGREDIENTS) */}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => setEditingCategory(item)}
                      className="bg-black/60 hover:bg-indigo-600 p-1.5 rounded-full transition"
                    >
                      <Edit2 size={14} className="text-white" />
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
                <div className="p-3 text-center">
                  <h3 className="text-white font-semibold text-sm truncate">
                    {item.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex flex-col md:flex-row justify-between px-4 pt-4 text-sm text-neutral-400 gap-2 md:gap-0">
          <p>
            Page {totalPages === 0 ? 0 : page} of {totalPages}
          </p>

          <div className="flex gap-2 flex-wrap">
            {/* Prev Button */}
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

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
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
            ))}

            {/* Next Button */}
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
      )}

      {/* Edit Modal */}
      {editingCategory && (
        <EditCategory
          id={editingCategory.id}
          currentData={editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdate={fetchData} // refresh table
        />
      )}
    </div>
  );
}
