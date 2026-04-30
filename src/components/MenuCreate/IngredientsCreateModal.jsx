
import React, { useState } from "react";
import { useAlert } from "../../AlertProvider";

export default function IngredientsCreateModal({ shopId, close, onSuccess }) {
  const { showAlert } = useAlert();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null); // ✅ FIX (null instead of "")
  const [loading, setLoading] = useState(false);

  // ✅ UPDATED IMAGE HANDLER
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      console.log("FULL BASE64:", reader.result); // 🔥 DEBUG

      setPhoto(reader.result); // ✅ send FULL base64 (IMPORTANT)
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      showAlert("Ingredient name is required", "error");
      return;
    }

    if (!price || Number(price) <= 0) {
      showAlert("Price must be greater than 0", "error");
      return;
    }

    if (!shopId) {
      showAlert("Shop ID missing", "error");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        prices: Number(price),
        shop_id: shopId,
        photo: photo || null, // ✅ FIX (NO more " ")
      };

      console.log("🚀 Sending payload:", payload); // 🔥 DEBUG

      const res = await fetch("http://38.60.244.137:3000/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("✅ Response:", data); // 🔥 DEBUG

      const apiMessage =
        data?.message ||
        data?.error ||
        data?.msg ||
        data?.errors?.[0]?.message ||
        "Unknown error";

      if (res.ok) {
        showAlert(apiMessage, "success");
        onSuccess();
      } else {
        showAlert(apiMessage, "error");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111827] w-[500px] rounded-2xl p-6 border border-gray-700 shadow-xl max-h-[90vh] overflow-y-auto">
        
        <h2 className="text-2xl font-semibold text-white mb-5">
          Add New Ingredient
        </h2>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-gray-300 font-medium mb-1 block">
              Ingredient Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chicken"
              className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="text-gray-300 font-medium mb-1 block">
              Price
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="5000"
              className="w-full p-2.5 rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Photo */}
        {/* Photo Upload */}
<div>
  <label className="text-gray-300 font-medium mb-1 block">
    Ingredient Photo 
  </label>

  {/* Upload Box */}
  <div
    className="relative w-full h-40 border-2 border-dashed border-gray-600 rounded-xl flex items-center justify-center cursor-pointer bg-gray-900 hover:border-indigo-500 transition-colors"
    onClick={() => document.getElementById("photoInput").click()}
  >
    {!photo ? (
      <div className="text-gray-500 text-center">
        <p className="font-medium">Click or drag image here</p>
        <p className="text-sm">PNG, JPG, GIF up to 5MB</p>
      </div>
    ) : (
      <>
        {/* Preview Image */}
        <img
          src={photo}
          alt="preview"
          className="absolute inset-0 w-full h-full object-cover rounded-xl"
        />
        {/* Remove Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPhoto(null);
          }}
          className="absolute top-2 right-2 bg-gray-800/70 hover:bg-gray-700 text-white p-1 rounded-full"
        >
          ✕
        </button>
      </>
    )}

    <input
      id="photoInput"
      type="file"
      accept="image/*"
      onChange={handleImage}
      className="hidden"
    />
  </div>
</div>
          
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={close}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {loading ? "Creating..." : "Create Ingredient"}
          </button>
        </div>
      </div>
    </div>
  );
}