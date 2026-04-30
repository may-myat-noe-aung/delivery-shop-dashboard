// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAlert } from "../AlertProvider";

// export default function SignupPage() {
//   const navigate = useNavigate();
//   const { showAlert } = useAlert();

//   const [form, setForm] = useState({
//     shopkeeper_name: "",
//     shop_name: "",
//     email: "",
//     phone: "",
//     password: "",
//     location: "",
//     address: "",
//     payment_name: "",
//     payment_phone: "",
//     payment_method: "",
//     have_deliverymen: 1, // ✅ number
//     deli_fees_method: "km",
//     photo: "", // ✅ base64 only (no prefix)
//   });

//   const [loading, setLoading] = useState(false);

//   // input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // convert number field
//     if (name === "have_deliverymen") {
//       setForm({ ...form, [name]: Number(value) });
//     } else {
//       setForm({ ...form, [name]: value });
//     }
//   };

//   // file → base64
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();

//     reader.onloadend = () => {
//       const base64 = reader.result.split(",")[1]; // ✅ remove data:image/...
//       setForm((prev) => ({
//         ...prev,
//         photo: base64,
//       }));
//     };

//     reader.readAsDataURL(file);
//   };

//   // submit
//   // const handleSignup = async (e) => {
//   //   e.preventDefault();
//   //   setLoading(true);

//   //   try {
//   //     const payload = {
//   //       ...form,
//   //       items: "0", // ✅ required field
//   //     };

//   //     console.log("Sending:", payload); // 🔥 debug

//   //     const res = await fetch("http://38.60.244.137:3000/shops", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     const data = await res.json();
//   //     console.log("Response:", data); // 🔥 debug

//   //     if (res.ok) {
//   //       showAlert(data.message || "Signup successful!", "success");
//   //       setTimeout(() => navigate("/login"), 800);
//   //     } else {
//   //       showAlert(data.message || "Signup failed.", "error");
//   //     }
//   //   } catch (err) {
//   //     console.error(err);
//   //     showAlert("Something went wrong.", "error");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleSignup = async (e) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const payload = {
//       ...form,
//       items: "0",
//     };

//     console.log("Sending:", payload);

//     const res = await fetch("http://38.60.244.137:3000/shops", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     const data = await res.json();
//     console.log("Response:", data);

//     // ✅ use ONLY API response message
//     const apiMessage =
//       data?.message ||
//       data?.error ||
//       data?.msg ||
//       data?.errors?.[0]?.message ||
//       "Unknown error";

//     if (res.ok) {
//       showAlert(apiMessage, "success");
//       setTimeout(() => navigate("/login"), 800);
//     } else {
//       showAlert(apiMessage, "error");
//     }
//   } catch (err) {
//     console.error(err);

   
//     showAlert("Server error", "error");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4">
//       <div className="bg-[#1a2030]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-lg">
//         <h2 className="text-2xl font-semibold mb-6 text-indigo-400 text-center">
//           Create Shop Account
//         </h2>

//         <form onSubmit={handleSignup} className="flex flex-col gap-4">
//           {/* Shop Info */}
//           <div className="flex gap-4">
//             <input type="text" name="shopkeeper_name" placeholder="Shopkeeper Name" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//             <input type="text" name="shop_name" placeholder="Shop Name" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//           </div>

//           {/* Contact */}
//           <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//           <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//           <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

//           {/* Location */}
//           <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//           <input type="text" name="address" placeholder="Address" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

//           {/* Payment */}
//           <div className="flex gap-4">
//             <input type="text" name="payment_name" placeholder="Payment Name" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//             <input type="text" name="payment_phone" placeholder="Payment Phone" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
//           </div>

//           <input type="text" name="payment_method" placeholder="Payment Method" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

//           {/* Delivery */}
//           <div className="flex gap-4">
//             <select name="have_deliverymen" onChange={handleChange} className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2">
//               <option value={1}>Have Delivery Men</option>
//               <option value={0}>No Delivery</option>
//             </select>

//             <select name="deli_fees_method" onChange={handleChange} className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2">
//               <option value="km">KM</option>
//               <option value="distance">Distance</option>
//             </select>
//           </div>
          

//           {/* Photo */}
//           <input type="file" onChange={handleFileChange} className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

//           {/* Submit */}
//           <button type="submit" disabled={loading} className="mt-3 px-4 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400">
//             {loading ? "Creating..." : "Sign Up"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../AlertProvider";
import { Camera } from "lucide-react";

export default function SignupPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [form, setForm] = useState({
    shopkeeper_name: "",
    shop_name: "",
    email: "",
    phone: "",
    password: "",
    location: "",
    address: "",
    payment_name: "",
    payment_phone: "",
    payment_method: "",
    have_deliverymen: 1,
    deli_fees_method: "km",
    photo: "",
  });

  const [loading, setLoading] = useState(false);

  // input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "have_deliverymen") {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // ✅ UPDATED IMAGE HANDLER (FULL BASE64 LIKE IngredientsCreateModal)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      // 🔥 IMPORTANT: FULL base64 (NO split)
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        items: "0",
      };

      console.log("Sending:", payload);

      const res = await fetch("http://38.60.244.137:3000/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const apiMessage =
        data?.message ||
        data?.error ||
        data?.msg ||
        data?.errors?.[0]?.message ||
        "Unknown error";

      if (res.ok) {
        showAlert(apiMessage, "success");
        setTimeout(() => navigate("/login"), 800);
      } else {
        showAlert(apiMessage, "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white p-4">
      <div className="bg-[#1a2030]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-400 text-center">
          Create Shop Account
        </h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          {/* PHOTO (unchanged UI) */}
          <div className="flex justify-center">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="w-24 h-24 rounded-full border-2 border-indigo-500 bg-neutral-900 overflow-hidden flex items-center justify-center">
                {form.photo ? (
                  <img
                    src={form.photo}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No Image</span>
                )}
              </div>

              <div className="absolute bottom-0 right-0 bg-indigo-500 p-2 rounded-full shadow-lg">
                <Camera size={16} />
              </div>
            </label>
          </div>

          {/* Shop Info */}
          <div className="flex gap-4">
            <input type="text" name="shopkeeper_name" placeholder="Shopkeeper Name" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
            <input type="text" name="shop_name" placeholder="Shop Name" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
          </div>

          {/* Contact */}
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
          <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

          {/* Location */}
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

          {/* Payment */}
          <div className="flex gap-4">
            <input type="text" name="payment_name" placeholder="Payment Name" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
            <input type="text" name="payment_phone" placeholder="Payment Phone" onChange={handleChange} required className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />
          </div>

          <input type="text" name="payment_method" placeholder="Payment Method" onChange={handleChange} required className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2" />

          {/* Delivery */}
          <div className="flex gap-4">
            <select name="have_deliverymen" onChange={handleChange} className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2">
              <option value={1}>Have Delivery Men</option>
              <option value={0}>No Delivery</option>
            </select>

            <select name="deli_fees_method" onChange={handleChange} className="flex-1 rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2">
              <option value="km">KM</option>
              <option value="distance">Distance</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 px-4 py-2 rounded-2xl bg-indigo-500 hover:bg-indigo-400"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>
      </div>
    </div>
  );
}

