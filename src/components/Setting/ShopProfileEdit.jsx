import React, { useEffect, useState } from "react";
import { Camera, Save, Loader2, MapPin } from "lucide-react";
import { useAlert } from "../../AlertProvider";
import { apiFetch } from "../../api";
export default function ShopProfileEdit({ shopId }) {
  const { showAlert, confirm } = useAlert();
  

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [shop, setShop] = useState(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
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

  const [form, setForm] = useState({
    shop_name: "",
    shopkeeper_name: "",
    phone: "",
    address: "",
    location: "",
    photo: "",
    logo: "",
    categories: [],
  });

  // ================= FETCH SHOP =================
  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);

const res = await apiFetch(
  `https://api.pwezayshops.com/shops/${shopId}`
);

if (!res) return;

const data = await res.json();

        const shopData = data?.[0];

        if (!shopData) {
          showAlert("Shop not found", "error");
          setLoading(false);
          return;
        }

        let locationString = "";

        try {
      const locRes = await apiFetch(
  `https://api.pwezayshops.com/get-location-shops/${shopId}`
);

if (!locRes) return;

const locData = await locRes.json();

          locationString =
            typeof locData?.location === "string"
              ? locData.location
              : shopData?.location || "";
        } catch {
          locationString = shopData?.location || "";
        }

        setShop(shopData);

        setForm({
          shop_name: shopData?.shop_name || "",
          shopkeeper_name: shopData?.shopkeeper_name || "",
          phone: shopData?.phone || "",
          address: shopData?.address || "",
          location: locationString,
          photo: shopData?.photo || "",
          logo: shopData.logo || "",
          categories: shopData?.categories || [],
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

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= PHOTO =================
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
  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        logo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ================= LOCATION (GPS) =================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Geolocation is not supported", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((prev) => ({
          ...prev,
          location: `Lag ${position.coords.latitude}, Log ${position.coords.longitude}`, // ✅ string only
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

const res = await apiFetch(
  `https://api.pwezayshops.com/shops/${shopId}`,
  {
    method: "PUT",
    body: JSON.stringify(form),
  }
);

if (!res) return;

      const data = await res.json();
      // ================= UPDATE LOCATION =================
    const locationRes = await apiFetch(
  `https://api.pwezayshops.com/change-location-shops/${shopId}`,
  {
    method:"PATCH",
    body:JSON.stringify({
      location: form.location,
      address: form.address,
    }),
  }
);

if (!locationRes) return;

      // ================= UPDATE SHOP CATEGORIES =================
 const categoryRes = await apiFetch(
  `https://api.pwezayshops.com/shops-categories/${shopId}`,
  {
    method:"PATCH",
    body:JSON.stringify({
      categories: form.categories,
    }),
  }
);

if (!categoryRes) return;

      const categoryData = await categoryRes.json();
      console.log(categoryData);

      if (res.ok && categoryRes.ok) {
        showAlert(
          data?.message || "Shop profile updated successfully",
          "success",
        );
      } else {
        showAlert(
          data?.message || categoryData?.message || "Failed to update profile",
          "error",
        );
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
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 md:p-6">
        {/* ================= SHOP IMAGES ================= */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Shop Images</h2>

          {/* ================= COVER ================= */}
          <div className="relative group">
            {form.photo || shop?.photo ? (
              <img
                src={
                  form.photo?.startsWith("data:")
                    ? form.photo
                    : `https://api.pwezayshops.com/shop-uploads/${shop?.photo}`
                }
                alt="cover"
                className="w-full h-60 object-cover rounded-3xl border border-slate-700"
              />
            ) : (
              <div className="w-full h-60 rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center text-slate-400">
                  <Camera size={40} className="mx-auto mb-2 opacity-60" />
                  <p className="text-sm">No cover image</p>
                  <p className="text-xs opacity-60">Click to upload</p>
                </div>
              </div>
            )}

            <label
              htmlFor="photo"
              className="
        absolute inset-0
        bg-black/40
        opacity-0
        group-hover:opacity-100
        transition
        flex items-center justify-center
        rounded-3xl
        cursor-pointer
      "
            >
              <div className="flex flex-col items-center text-white">
                <Camera size={30} />
                <span className="mt-2 font-medium">
                  {form.photo || shop?.photo ? "Change Cover" : "Upload Cover"}
                </span>
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

          {/* ================= LOGO ================= */}
          <div className="-mt-14 flex flex-col items-center relative z-10">
            <div className="w-32 h-32 rounded-full relative overflow-hidden border-4 border-slate-700 group">
              {/* EMPTY STATE */}
              {!form.logo && !shop?.logo ? (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 flex flex-col items-center justify-center text-slate-400">
                  <Camera size={26} className="mb-1 opacity-70" />

                  {/* CENTER TEXT */}
                  <p className="text-[11px] font-medium text-center leading-tight">
                    Upload Logo
                  </p>

                  <p className="text-[9px] opacity-60 text-center">
                    Click to add
                  </p>
                </div>
              ) : (
                <img
                  src={
                    form.logo?.startsWith("data:")
                      ? form.logo
                      : `https://api.pwezayshops.com/shop-uploads/${shop?.logo || `${shopId}_logo.png`}`
                  }
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              )}

              {/* HOVER OVERLAY */}
              <label
                htmlFor="logo"
                className="
      absolute inset-0 rounded-full
      bg-black/50 opacity-0 group-hover:opacity-100
      transition flex items-center justify-center cursor-pointer
    "
              >
                <Camera className="text-white" size={24} />
              </label>

              <input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleLogo}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* FORM */}
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

          {/* LOCATION */}
          <div>
            <p className="text-sm text-slate-400 mb-3">Current Location</p>

            <div className="flex gap-3">
              <input
                name="location"
                readOnly
                value={form.location}
                className="flex-1 h-12 bg-slate-900/70 border border-slate-700 rounded-xl px-4 text-white"
              />

              <button
                type="button"
                onClick={getCurrentLocation}
                className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center"
              >
                <MapPin size={18} />
              </button>
            </div>
          </div>

          {/* CATEGORIES */}
          <div className="">
            <p className="text-sm text-slate-400 mb-3">Select Categories</p>

            {/* CUSTOM SELECT */}
            <div className="relative">
              {/* SELECT BUTTON */}
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="
        w-full min-h-[56px]
        bg-slate-900/80
        border border-slate-700
        rounded-2xl
        px-5 py-3
        text-left
        text-white
        flex items-center justify-between
        hover:border-indigo-500
        transition-all
      "
              >
                <div className="flex flex-wrap gap-2">
                  {form.categories.length > 0 ? (
                    form.categories.map((catId) => {
                      const cat = categories.find((item) => item.id === catId);

                      if (!cat) return null;

                      return (
                        <div
                          key={catId}
                          className="
        flex items-center gap-2
        bg-indigo-500/10
        border border-indigo-500/20
        px-3 py-1 rounded-xl
      "
                        >
                          <img
                            src={`/categoriesIcon/${cat.icon}.png`}
                            alt={cat.name}
                            className="w-5 h-5"
                          />

                          <span className="text-sm">{cat.name}</span>
                        </div>
                      );
                    })
                  ) : (
                    <span className="text-slate-500">Choose Categories</span>
                  )}
                </div>

                <div className="text-slate-400 text-sm">▼</div>
              </button>

              {/* DROPDOWN */}
              {showCategoryDropdown && (
                <div
                  className="
          absolute top-full left-0 mt-3
          w-full z-50
          bg-[#0f172a]
          border border-slate-700
          rounded-2xl
          p-3
          shadow-2xl
          max-h-[150px]
          overflow-y-auto 
        "
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ">
                    {categories.map((item) => {
                      const active = form.categories.includes(item.id);

                      return (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => {
                            const exists = form.categories.includes(item.id);

                            setForm((prev) => ({
                              ...prev,
                              categories: exists
                                ? prev.categories.filter((id) => id !== item.id)
                                : [...prev.categories, item.id],
                            }));
                          }}
                          className={`
                  relative
                  pb-2 pt-4 rounded-2xl border
                  transition-all
                  ${
                    active
                      ? "border-indigo-500 bg-black"
                      : "border-slate-700 bg-black hover:border-slate-500"
                  }
                `}
                        >
                          {/* CHECK */}
                          {active && (
                            <div
                              className="
                      absolute top-2 right-2
                      w-5 h-5 rounded-full
                      bg-indigo-500
                      text-white text-xs
                      flex items-center justify-center 
                    "
                            >
                              ✓
                            </div>
                          )}

                          <img
                            src={`/categoriesIcon/${item.icon}.png`}
                            alt={item.name}
                            className="size-[80px] mx-auto"
                          />

                          <p className="text-sm mt-1 text-white">{item.name}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* ADDRESS */}
          <div>
            <p className="text-sm text-slate-400 mb-3">Address</p>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2 text-white"
            />
          </div>

          {/* BUTTON */}
          <div className="col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="h-[52px] px-6 rounded-2xl bg-indigo-600 text-white flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
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

function InputCard({ label, name, value, onChange }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-3">{label}</p>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-12 bg-slate-900/70 border border-slate-700 rounded-xl px-4 text-white"
      />
    </div>
  );
}
