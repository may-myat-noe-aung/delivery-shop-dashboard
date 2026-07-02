

// import React, { useEffect, useState } from "react";
// import { Camera, Save, Loader2, MapPin } from "lucide-react";
// import { useAlert } from "../../AlertProvider";

// export default function ShopProfileEdit({ shopId }) {
//   const { showAlert, confirm } = useAlert();

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [shop, setShop] = useState(null);

//   const [form, setForm] = useState({
//     shop_name: "",
//     shopkeeper_name: "",
//     phone: "",
//     address: "",
//     location: {
//       latitude: "",
//       longitude: "",
//     },
//     photo: "",
//   });

//   // ================= FETCH SHOP =================
//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(
//           `https://api.pwezayshops.com/shops/${shopId}`
//         );
//         const data = await res.json();

//         const shopData = data?.[0];

//         // ❗ SAFETY CHECK (IMPORTANT FIX)
//         if (!shopData) {
//           showAlert("Shop not found", "error");
//           setLoading(false);
//           return;
//         }

//         let locationString = "";

//         try {
//           const locRes = await fetch(
//             `https://api.pwezayshops.com/get-location-shops/${shopId}`
//           );
//           const locData = await locRes.json();

//           locationString =
//             typeof locData?.location === "string"
//               ? locData.location
//               : shopData?.location || "";
//         } catch {
//           locationString = shopData?.location || "";
//         }

//         let latitude = "";
//         let longitude = "";

//         const latMatch = locationString.match(/Lat\s*([-\d.]+)/i);
//         const lngMatch = locationString.match(/Log\s*([-\d.]+)/i);

//         latitude = latMatch ? latMatch[1] : "";
//         longitude = lngMatch ? lngMatch[1] : "";

//         setShop(shopData);

//         setForm({
//           shop_name: shopData?.shop_name || "",
//           shopkeeper_name: shopData?.shopkeeper_name || "",
//           phone: shopData?.phone || "",
//           address: shopData?.address || "",
//           location: {
//             latitude,
//             longitude,
//           },
//           photo: shopData?.photo || "",
//         });
//       } catch (err) {
//         console.error(err);
//         showAlert("Failed to load shop profile", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (shopId) fetchShop();
//   }, [shopId]);

//   // ================= HANDLE CHANGE =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ================= PHOTO =================
//   const handlePhoto = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onloadend = () => {
//       setForm((prev) => ({
//         ...prev,
//         photo: reader.result,
//       }));
//     };

//     reader.readAsDataURL(file);
//   };

//   // ================= LOCATION =================
//   const getCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       showAlert("Geolocation is not supported", "error");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         setForm((prev) => ({
//           ...prev,
//           location: {
//             latitude: String(position.coords.latitude),
//             longitude: String(position.coords.longitude),
//           },
//         }));

//         showAlert("Location captured successfully", "success");
//       },
//       () => {
//         showAlert("Unable to get current location", "error");
//       }
//     );
//   };

//   // ================= SUBMIT =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const confirmed = await confirm(
//       "Are you sure you want to update shop profile?"
//     );

//     if (!confirmed) return;

//     try {
//       setSaving(true);

//       // 1️⃣ UPDATE SHOP INFO
//       const res = await fetch(
//         `https://api.pwezayshops.com/shops/${shopId}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       const data = await res.json();

//       // 2️⃣ UPDATE LOCATION (KEEP YOUR FORMAT)
//       await fetch(
//         `https://api.pwezayshops.com/change-location-shops/${shopId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             location: `Lag ${form.location.latitude}, Log ${form.location.longitude}`,
//             address: form.address,
//           }),
//         }
//       );

//       if (res.ok) {
//         showAlert(
//           data?.message || "Shop profile updated successfully",
//           "success"
//         );
//       } else {
//         showAlert(data?.message || "Failed to update profile", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Something went wrong", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 animate-pulse">
//         <div className="h-8 w-48 bg-slate-800 rounded mb-6"></div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {[...Array(6)].map((_, index) => (
//             <div
//               key={index}
//               className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5"
//             >
//               <div className="h-5 w-32 bg-slate-800 rounded mb-4"></div>
//               <div className="h-12 bg-slate-800 rounded-xl"></div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 md:p-6">

//         {/* PHOTO */}
//         <div className="flex flex-col items-center mb-4">
//           <div className="relative group">
//             <img
//               src={
//                 form.photo?.startsWith("data:")
//                   ? form.photo
//                   : `https://api.pwezayshops.com/shop-uploads/${shop?.photo}`
//               }
//               alt="shop"
//               className="w-32 h-32 rounded-3xl object-cover border-4 border-white/10"
//             />

//             <label
//               htmlFor="photo"
//               className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer rounded-3xl"
//             >
//               <Camera size={24} />
//             </label>

//             <input
//               id="photo"
//               type="file"
//               accept="image/*"
//               onChange={handlePhoto}
//               className="hidden"
//             />
//           </div>
//         </div>

//         {/* FORM */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

//           <InputCard
//             label="Shop Name"
//             name="shop_name"
//             value={form.shop_name}
//             onChange={handleChange}
//           />

//           <InputCard
//             label="Owner Name"
//             name="shopkeeper_name"
//             value={form.shopkeeper_name}
//             onChange={handleChange}
//           />

//           <InputCard
//             label="Phone Number"
//             name="phone"
//             value={form.phone}
//             onChange={handleChange}
//           />

//           {/* LOCATION */}
//           <div>
//             <p className="text-sm text-slate-400 mb-3">Current Location</p>

//             <div className="flex gap-3">
//               <input
//                 readOnly
//                 value={
//                   form.location.latitude && form.location.longitude
//                     ? `Lag ${form.location.latitude}, Log ${form.location.longitude}`
//                     : ""
//                 }
//                 className="flex-1 h-12 bg-slate-900/70 border border-slate-700 rounded-xl px-4 text-white"
//               />

//               <button
//                 type="button"
//                 onClick={getCurrentLocation}
//                 className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center"
//               >
//                 <MapPin size={18} />
//               </button>
//             </div>
//           </div>

//           {/* ADDRESS */}
//           <div>
//             <p className="text-sm text-slate-400 mb-3">Address</p>
//             <textarea
//               name="address"
//               value={form.address}
//               onChange={handleChange}
//               className="w-full bg-slate-900/70 border border-slate-700 rounded-xl px-4 py-2 text-white"
//             />
//           </div>

//           {/* BUTTON */}
//           <div className="col-span-2 flex justify-end">
//             <button
//               type="submit"
//               disabled={saving}
//               className="h-[52px] px-6 rounded-2xl bg-indigo-600 text-white flex items-center gap-2"
//             >
//               {saving ? (
//                 <>
//                   <Loader2 className="animate-spin" size={18} />
//                   Saving...
//                 </>
//               ) : (
//                 <>
//                   <Save size={18} />
//                   Update Profile
//                 </>
//               )}
//             </button>
//           </div>

//         </div>
//       </div>
//     </form>
//   );
// }

// function InputCard({ label, name, value, onChange }) {
//   return (
//     <div>
//       <p className="text-sm text-slate-400 mb-3">{label}</p>
//       <input
//         name={name}
//         value={value}
//         onChange={onChange}
//         className="w-full h-12 bg-slate-900/70 border border-slate-700 rounded-xl px-4 text-white"
//       />
//     </div>
//   );
// }

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
    address: "",
    location: "", // ✅ CHANGED (string only like name/photo)
    photo: "",
  });

  // ================= FETCH SHOP =================
  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.pwezayshops.com/shops/${shopId}`
        );
        const data = await res.json();

        const shopData = data?.[0];

        if (!shopData) {
          showAlert("Shop not found", "error");
          setLoading(false);
          return;
        }

        let locationString = "";

        try {
          const locRes = await fetch(
            `https://api.pwezayshops.com/get-location-shops/${shopId}`
          );
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
          location: locationString, // ✅ preload like name/photo
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
      }
    );
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const confirmed = await confirm(
      "Are you sure you want to update shop profile?"
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      const res = await fetch(
        `https://api.pwezayshops.com/shops/${shopId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      // ✅ location also same string
      await fetch(
        `https://api.pwezayshops.com/change-location-shops/${shopId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            location: form.location,
            address: form.address,
          }),
        }
      );

      if (res.ok) {
        showAlert(
          data?.message || "Shop profile updated successfully",
          "success"
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
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 md:p-6">

        {/* PHOTO */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative group">
            <img
              src={
                form.photo?.startsWith("data:")
                  ? form.photo
                  : `https://api.pwezayshops.com/shop-uploads/${shop?.photo}`
              }
              alt="shop"
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white/10"
            />

            <label
              htmlFor="photo"
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer rounded-3xl"
            >
              <Camera size={24} />
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