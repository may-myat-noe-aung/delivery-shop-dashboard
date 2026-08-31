import React, { useState, useRef } from "react";
import { FiCamera } from "react-icons/fi"; // camera icon
import { useAlert } from "../../AlertProvider";
import { apiFetch } from "../../api";

export default function EditIngredients({
  id,
  currentData,
  onClose,
  onUpdate,
}) {
  const { showAlert, confirm } = useAlert(); // use confirm for confirmation
  const fileInputRef = useRef(null);

  if (!currentData) return null;

  const [name, setName] = useState(currentData.name);
  const [prices, setPrices] = useState(currentData.prices);
  const [photo, setPhoto] = useState(""); // base64 only if user uploads
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    // reader.onloadend = () => {
    //   setPhoto(reader.result.split(",")[1]); // store only base64
    // };
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    // confirmation before saving
    const confirmed = await confirm(
      "Are you sure you want to update this Ingredient?",
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const payload = { name, prices };
      if (photo) payload.photo = photo;

      const res = await apiFetch(`https://api.pwezayshops.com/ingredients/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
if (!res) return;
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

  return (
    <div className="fixed -inset-10 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1a2030] p-6 rounded-2xl w-[500px] relative">
        <h2 className="text-2xl text-indigo-500 mb-5 ">Edit Ingredient</h2>

        {/* PHOTO */}
        <div className="mb-3 relative ">
          <div className="flex justify-center mb-3">
            <img
              src={photo || currentData.photoUrl}
              alt={name}
              className="size-48 object-cover rounded-lg"
            />
            {/* Camera icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-2 right-[115px] bg-indigo-600 p-2 rounded-full hover:bg-indigo-700 text-white"
            >
              <FiCamera size={20} />
            </button>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>

        {/* NAME */}
        <div className="mb-3">
          <label className="text-white mb-1 block">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white "
          />
        </div>

        {/* PRICE */}
        <div className="mb-3">
          <label className="text-white mb-1 block">Price</label>
          <input
            type="number"
            value={prices}
            onChange={(e) => setPrices(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-white "
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white "
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white "
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
