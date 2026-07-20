import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Edit2, Search } from "lucide-react";
import { useAlert } from "../../AlertProvider";
import EditIngredients from "./EditIngredients";

export default function IngredientsTable({ shopId }) {
  const { showAlert, confirm } = useAlert();
const token = localStorage.getItem("shopToken");
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null); // track which ingredient is editing
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

const fetchData = async () => {
  try {
    const res = await fetch(
      `https://api.pwezayshops.com/ingredients/${shopId}`,
      {
        headers: {
        Authorization: `MSHteam ${token}`,
        },
      }
    );

    if (!res.ok) {
      setIngredients([]);
      return;
    }

    const data = await res.json();

    const withPhotos = (Array.isArray(data) ? data : []).map((item) => ({
      ...item,
      photoUrl: `https://api.pwezayshops.com/ingredients-uploads/${item.photo}`,
    }));

    setIngredients(withPhotos);
  } catch (err) {
    console.error(err);
    setIngredients([]);
  } finally {
    setLoading(false);
  }
};
  // useEffect(() => {
  //   if (!shopId) return;
  //   fetchData();
  // }, [shopId]);

  // Search filter

  useEffect(() => {
    if (!shopId) return;

    setLoading(true);

    fetchData(); // initial fetch

    const interval = setInterval(() => {
      fetchData();
    }, 1000); // ⏱ every 5 seconds

    return () => clearInterval(interval);
  }, [shopId]);



  const filtered = useMemo(() => {
    return ingredients.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [ingredients, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
// ===== Pagination Buttons =====
const maxButtons = 10;

const startPage =
  Math.floor((page - 1) / maxButtons) * maxButtons + 1;

const endPage = Math.min(
  startPage + maxButtons - 1,
  totalPages
);

const visiblePages = Array.from(
  { length: endPage - startPage + 1 },
  (_, i) => startPage + i
);
  // Delete ingredient
  const handleDelete = async (id) => {
    const ok = await confirm("Delete this ingredient?");
    if (!ok) return;

    try {
      const res = await fetch(`https://api.pwezayshops.com/ingredients/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `MSHteam ${token}`,
        }
      });
      const data = await res.json();

      if (res.ok) {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
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
      {/* TITLE */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-2xl font-semibold text-indigo-400">Ingredients List</h2>
            <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    />
        
                    <input
                      type="text"
                      placeholder="Search Ingredients..."
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
          No ingredients found
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-7 gap-4">
          {paginated.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden border border-slate-700 bg-[#111827] shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover"
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />

                {/* TOP RIGHT ICONS */}
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => setEditingId(item.id)}
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
              <div className="p-3 text-center flex items-center justify-between">
                {/* NAME */}
                <h3 className="text-white font-semibold text-sm truncate">
                  {item.name}
                </h3>

                {/* PRICE */}
                <p className="text-indigo-400 text-sm mt-1">
                  {item.prices} MMK
                </p>
              </div>
            </div>
          ))}
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
       {visiblePages.map((n) => (
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

      {/* EDIT MODAL */}
      {editingId && ingredients.find((i) => i.id === editingId) && (
        <EditIngredients
          id={editingId}
          currentData={ingredients.find((i) => i.id === editingId)}
          onClose={() => setEditingId(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
