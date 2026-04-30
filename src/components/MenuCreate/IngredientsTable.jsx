

import React, { useState, useEffect, useMemo } from "react";
import { Trash2, Edit2 } from "lucide-react";
import { useAlert } from "../../AlertProvider";
import EditIngredients from "./EditIngredients";

export default function IngredientsTable({ shopId }) {
  const { showAlert, confirm } = useAlert();

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null); // track which ingredient is editing
  const pageSize = 5;

  // Fetch ingredients
  const fetchData = async () => {
    try {
      const res = await fetch(`http://38.60.244.137:3000/ingredients/${shopId}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        const withPhotos = data.map((item) => ({
          ...item,
          photoUrl: `http://38.60.244.137:3000/ingredients-uploads/${item.photo}`,
        }));
        setIngredients(withPhotos);
      } else {
        showAlert("Failed to fetch ingredients", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
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
  }, 5000); // ⏱ every 5 seconds

  return () => clearInterval(interval);
}, [shopId]);

  const filtered = useMemo(() => {
    return ingredients.filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [ingredients, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Delete ingredient
  const handleDelete = async (id) => {
    const ok = await confirm("Delete this ingredient?");
    if (!ok) return;

    try {
      const res = await fetch(`http://38.60.244.137:3000/ingredients/${id}`, {
        method: "DELETE",
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
        <h2 className="text-2xl font-bold text-white">Ingredients List</h2>

        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-xl text-sm text-white"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : paginated.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No ingredients found</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-6 text-sm text-gray-400">
        <p>
          Page {totalPages === 0 ? 0 : page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 rounded-lg border border-neutral-700 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 rounded-lg border border-neutral-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

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