import React, { useEffect, useState } from "react";
import { Camera, Save, Loader2, MapPin } from "lucide-react";

import { useAlert } from "../../AlertProvider";

export default function ShopProfileEdit({ shopId }) {
  const { showAlert, confirm } = useAlert();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [shop, setShop] = useState(null);

  const [form, setForm] = useState({
    shop_name: "",
    shopkeeper_name: "",
    phone: "",
    email: "",
    address: "",
    location: {
      latitude: "",
      longitude: "",
    },
    photo: "",
  });

  // ================= FETCH SHOP =================
  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);

        const res = await fetch(`https://api.pwezayshops.com/shops/${shopId}`);
        const data = await res.json();

        const shopData = data?.[0];

        let latitude = "";
        let longitude = "";

        const locationString = shopData?.location || "";

        const latMatch = locationString.match(/Lat\s*([-\d.]+)/i);
        const lngMatch = locationString.match(/Log\s*([-\d.]+)/i);

        latitude = latMatch ? latMatch[1] : "";
        longitude = lngMatch ? lngMatch[1] : "";

        setShop(shopData);

        setForm({
          shop_name: shopData?.shop_name || "",
          shopkeeper_name: shopData?.shopkeeper_name || "",
          phone: shopData?.phone || "",
          email: shopData?.email || "",
          address: shopData?.address || "",
          location: {
            latitude,
            longitude,
          },
          photo: shopData?.photo || "",
        });
      } catch (err) {
        console.error(err);
        showAlert("Failed to load shop profile", "error");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchShop();
  }, [shopId]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "latitude" || name === "longitude") {
      setForm((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= HANDLE PHOTO =================
  const handlePhoto = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Geolocation is not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        }));

        showAlert("Location captured successfully", "success");
      },
      () => {
        showAlert("Unable to get current location", "error");
      },
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = await confirm(
      "Are you sure you want to update shop profile?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const res = await fetch(`https://api.pwezayshops.com/shops/${shopId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert(
          data?.message || "Shop profile updated successfully",
          "success",
        );
      } else {
        showAlert(data?.message || "Failed to update profile", "error");
      }
    } catch (err) {
      console.error(err);

      showAlert("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 animate-pulse">
        <div className="h-8 w-48 bg-slate-800 rounded mb-6"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5"
            >
              <div className="h-5 w-32 bg-slate-800 rounded mb-4"></div>

              <div className="h-12 bg-slate-800 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= MAIN CARD ================= */}
      <div className="relative overflow-hidden bg-[#111827] border border-slate-800 rounded-3xl p-4 md:p-6">
        {/* GLOW */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="relative flex items-center justify-between mb-1">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Shop Profile</h2>
          </div>
        </div>

        {/* ================= PHOTO ================= */}
        <div className="relative flex flex-col items-center mb-4">
          <div className="relative group">
            <img
              src={
                form.photo?.startsWith("data:")
                  ? form.photo
                  : `https://api.pwezayshops.com/shop-uploads/${shop?.photo}`
              }
              alt="shop"
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white/10 shadow-2xl"
            />

            <label
              htmlFor="photo"
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition rounded-3xl flex items-center justify-center cursor-pointer"
            >
              <div className="flex flex-col items-center text-white">
                <Camera size={24} />

                <span className="text-sm mt-1">Change</span>
              </div>
            </label>

            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handlePhoto}
              className="hidden"
            />
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputCard
            label="Shop Name"
            name="shop_name"
            value={form.shop_name}
            onChange={handleChange}
          />

          <InputCard
            label="Owner Name"
            name="shopkeeper_name"
            value={form.shopkeeper_name}
            onChange={handleChange}
          />

          <InputCard
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <InputCard
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <div className="col-span-1">
            <p className="text-sm text-slate-400 mb-3">Current Location</p>

            <div className="flex gap-3">
              <input
                type="text"
                readOnly
                value={
                  form.location?.latitude
                    ? `Lat ${form.location.latitude}, Log ${form.location.longitude}`
                    : ""
                }
                placeholder="Current Location"
                className="
        flex-1 h-12
        bg-slate-900/70
        border border-slate-700
        rounded-xl
        px-4
        text-white
      "
              />

              <button
                type="button"
                onClick={getCurrentLocation}
                className="
        w-12 h-12
        rounded-xl
        bg-indigo-600
        hover:bg-indigo-500
        flex items-center justify-center
      "
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>

          {/* ================= ADDRESS + BUTTON ================= */}
          <div className="col-span-1 ">
            {/* ADDRESS */}
            <div className="w-full">
              <p className="text-sm text-slate-400 mb-3">Address</p>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={1}
                className="
                      w-full bg-slate-900/70 border border-slate-700
                      rounded-xl px-4 py-2
                      text-white placeholder:text-slate-500
                      outline-none
                      focus:border-indigo-500
                      transition-all
                      resize-none
                    "
              />
            </div>
          </div>
            {/* BUTTON */}
            <div className="w-full md:w-auto flex justify-end col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="
                      h-[52px] mb-2  px-6 rounded-2xl
                      bg-indigo-600 hover:bg-indigo-500
                      text-white font-semibold
                      transition-all duration-200
                      flex items-center justify-center gap-2
                      disabled:opacity-50
                      disabled:cursor-not-allowed
                      shadow-lg shadow-indigo-500/20
                      min-w-[200px]
                    "
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Update Profile
                  </>
                )}
              </button>
            </div>
        </div>
      </div>
    </form>
  );
}

/* ================= INPUT CARD ================= */
function InputCard({ label, name, value, onChange }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <p className="text-sm text-slate-400">{label}</p>
      </div>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full h-12 bg-slate-900/70 border border-slate-700
          rounded-xl px-4
          text-white placeholder:text-slate-500
          outline-none
          focus:border-indigo-500
          transition-all
        "
      />
    </div>
  );
}
