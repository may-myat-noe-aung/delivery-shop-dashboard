import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";

export default function ShopAccountEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shopkeeper_name: "",
    shop_name: "",
    phone: "",
    address: "",
    photo: null,
  });

  const [preview, setPreview] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`http://38.60.244.137:3000/shops/${id}`);
      const data = await res.json();
      const s = data?.[0];

      setForm({
        shopkeeper_name: s.shopkeeper_name || "",
        shop_name: s.shop_name || "",
        phone: s.phone || "",
        address: s.address || "",
        photo: null,
      });

      setPreview(
        `http://38.60.244.137:3000/shop-uploads/${s.photo}`
      );
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo") {
      const file = files[0];
      setForm({ ...form, photo: file });
      if (file) setPreview(URL.createObjectURL(file));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = {
      shopkeeper_name: form.shopkeeper_name,
      shop_name: form.shop_name,
      phone: form.phone,
      address: form.address,
    };

    if (form.photo) {
      const base64 = await toBase64(form.photo);
      payload.photo = base64;
    }

    await fetch(`http://38.60.244.137:3000/shops/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    navigate(-1);
  };

  return (
    <div className=" flex items-center justify-center bg-[#0f172a] text-white">

      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-8">

        {/* PROFILE IMAGE */}
        <div className="flex justify-center">
          <div className="relative w-28 h-28">

            <img
              src={preview}
              className="w-28 h-28 rounded-full object-cover border-2 border-slate-600"
            />

            <input
              type="file"
              name="photo"
              id="photoUpload"
              onChange={handleChange}
              className="hidden"
            />

            <label
              htmlFor="photoUpload"
              className="absolute bottom-1 right-1 bg-blue-600 p-2 rounded-full cursor-pointer hover:scale-110 transition"
            >
              <Camera size={16} />
            </label>
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-center text-xl font-semibold">
          Edit Profile
        </h2>

        {/* INPUTS */}
        <div className="space-y-6">

          <Input
            label="Owner Name"
            name="shopkeeper_name"
            value={form.shopkeeper_name}
            onChange={handleChange}
          />

          <Input
            label="Shop Name"
            name="shop_name"
            value={form.shop_name}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 py-2 border border-slate-600 rounded-full text-gray-300 hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="flex-1 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition"
          >
            Save
          </button>

        </div>
      </form>
    </div>
  );
}

/* ✨ Clean Input */
function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-b border-slate-600 focus:border-blue-500 outline-none py-2"
      />
    </div>
  );
}

/* base64 */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}