// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Camera,
//   Eye,
//   EyeOff,
//   Loader2,
//   Store,
//   User,
//   Mail,
//   Phone,
//   Lock,
//   MapPin,
//   Package,
//   CreditCard,
//   Truck,
// } from "lucide-react";

// import { useAlert } from "../AlertProvider";

// export default function SignupPage() {
//   const navigate = useNavigate();

//   const { showAlert } = useAlert();

//   const [loading, setLoading] = useState(false);
//   const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

//   const [showPassword, setShowPassword] = useState(false);

//   // ================= CATEGORY =================
//   const categories = [
//     {
//       id: 1,
//       name: "Snack",
//       icon: "snack",
//     },
//     {
//       id: 2,
//       name: "Alcoholic",
//       icon: "alcoholic",
//     },
//     {
//       id: 3,
//       name: "Breakfast",
//       icon: "breakfast",
//     },
//     {
//       id: 4,
//       name: "Cake",
//       icon: "cake",
//     },
//     {
//       id: 5,
//       name: "Coffee",
//       icon: "coffee",
//     },
//     {
//       id: 6,
//       name: "Drink",
//       icon: "drink",
//     },
//     {
//       id: 7,
//       name: "Fast Food",
//       icon: "fastfood",
//     },
//     {
//       id: 8,
//       name: "Lunch",
//       icon: "lunch",
//     },
//     {
//       id: 9,
//       name: "Morning",
//       icon: "morning",
//     },
//     {
//       id: 10,
//       name: "Sweets",
//       icon: "sweets",
//     },
//   ];

//   // ================= PAYMENT METHODS =================
//   const paymentMethods = [
//     "KBZ",
//     "WAVE",
//     "AYA",
//     "CB",
//     "AGB",
//     "UAB",
//     "YOMA",
//     "MCB",
//   ];

//   const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

//   // ================= FORM =================
// const [form, setForm] = useState({
//   shopkeeper_name: "",
//   shop_name: "",
//   email: "",
//   phone: "",
//   password: "",
//   address: "",

//   items: "",

//   location: {
//     latitude: "",
//     longitude: "",
//   },

//   payments: [
//     {
//       name: "",
//       phone: "",
//       method: "",
//     },
//   ],

//   have_deliverymen: 1,
//   deli_fees_method: "km",

//   category: [],

//   photo: "",
// });

//   // ================= CHANGE =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // ================= PAYMENT CHANGE =================
//   const handlePaymentChange = (e) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       payments: [
//         {
//           ...prev.payments[0],
//           [name]: value,
//         },
//       ],
//     }));
//   };

//   // ================= CATEGORY =================
//   const handleCategory = (id) => {
//     setForm((prev) => {
//       const exists = prev.category.includes(id);

//       return {
//         ...prev,
//         category: exists
//           ? prev.category.filter((item) => item !== id)
//           : [...prev.category, id],
//       };
//     });
//   };

//   // ================= PHOTO =================
// const handleFileChange = (e) => {
//   const file = e.target.files[0];

//   if (!file) return;

//   // LIMIT
//   if (file.size > 2 * 1024 * 1024) {
//     showAlert(
//       "Image must be under 2MB",
//       "error"
//     );

//     return;
//   }

//   const reader = new FileReader();

//   reader.onloadend = () => {
//     setForm((prev) => ({
//       ...prev,
//       photo: reader.result,
//     }));
//   };

//   reader.readAsDataURL(file);
// };

//   // ================= LOCATION =================
// const getCurrentLocation = () => {
//   if (!navigator.geolocation) {
//     showAlert(
//       "Geolocation is not supported",
//       "error"
//     );

//     return;
//   }

//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const lat = parseFloat(
//         position.coords.latitude
//       );

//       const lng = parseFloat(
//         position.coords.longitude
//       );

//       setForm((prev) => ({
//         ...prev,

//         location: {
//           latitude: lat,
//           longitude: lng,
//         },
//       }));

//       showAlert(
//         "Location added successfully",
//         "success"
//       );
//     },

//     (error) => {
//       console.error(error);

//       showAlert(
//         "Cannot get current location",
//         "error"
//       );
//     }
//   );
// };

//   // ================= SIGNUP =================
// const handleSignup = async (e) => {
//   e.preventDefault();

//   // CATEGORY VALIDATION
//   if (form.category.length === 0) {
//     showAlert(
//       "Please select category",
//       "error"
//     );

//     return;
//   }

//   try {
//     setLoading(true);

//     // PAYLOAD
//  const payload = {
//   ...form,

//   items: Number(form.items),

//   // location: JSON.stringify({
//   //   latitude: Number(form.location.latitude),
//   //   longitude: Number(form.location.longitude),
//   // }),
//   location: `Lat ${Number(form.location.latitude)}, Long ${Number(form.location.longitude)}`,

//   payments: JSON.stringify(form.payments),

//   category: JSON.stringify(form.category),
// };

//     console.log(payload);

//     const res = await fetch(
//       "https://api.pwezayshops.com/shops",
//       {
//         method: "POST",

//         headers: {
//           "Content-Type":
//             "application/json",
//         },

//         body: JSON.stringify(payload),
//       }
//     );

//     const data = await res.json();

//     console.log(data);

//     const apiMessage =
//       data?.message ||
//       data?.error ||
//       "Unknown error";

//     if (res.ok) {
//       showAlert(apiMessage, "success");

//       setTimeout(() => {
//         navigate("/login");
//       }, 800);
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
//     <div
//       className="
//         min-h-screen
//         bg-gradient-to-br
//         from-slate-950
//         via-slate-900
//         to-indigo-950
//         text-white
//         px-4 py-10
//         relative overflow-hidden

//       "
//     >
//       {/* GLOW */}
//       <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

//       <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

//       <div className="relative max-w-4xl mx-auto border border-slate-800 rounded-3xl p-8">
//         {/* HEADER */}
//         <div className="flex items-center justify-between mb-8">
//           {/* LEFT TEXT */}
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-white">
//               Create Shop Account
//             </h1>

//             <p className="text-slate-400 mt-1">
//               Setup your shop profile and start selling
//             </p>
//           </div>

//           {/* RIGHT ICON */}
//           <div className="hidden md:flex">
//             <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
//               <Store size={28} className="text-indigo-400" />
//             </div>
//           </div>
//         </div>

//         {/* ================= FORM ================= */}
//         <form onSubmit={handleSignup} className="space-y-6">
//           {/* PHOTO */}
//           <div className="flex justify-center mb-6">
//             <label className="relative cursor-pointer group">
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="hidden"
//               />

//               {/* OUTER RING */}
//               <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-500/40 to-purple-500/20">
//                 {/* IMAGE BOX */}
//                 <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-slate-700 relative">
//                   {form.photo ? (
//                     <img
//                       src={form.photo}
//                       alt="preview"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
//                       No Image
//                     </div>
//                   )}

//                   {/* HOVER OVERLAY */}
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
//                     <Camera size={24} className="text-white" />
//                   </div>
//                 </div>
//               </div>

//               {/* SMALL EDIT BUTTON */}
//               <div className="absolute bottom-2 right-2 bg-indigo-600 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-white/10">
//                 <Camera size={16} className="text-white" />
//               </div>
//             </label>
//           </div>

//           {/* SHOP INFO */}
//           <SectionCard title="Shop Information" icon={<Store size={20} />}>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               <InputField
//                 icon={<User size={18} />}
//                 name="shopkeeper_name"
//                 value={form.shopkeeper_name}
//                 onChange={handleChange}
//                 placeholder="Shopkeeper Name"
//               />

//               <InputField
//                 icon={<Store size={18} />}
//                 name="shop_name"
//                 value={form.shop_name}
//                 onChange={handleChange}
//                 placeholder="Shop Name"
//               />

//               <InputField
//                 icon={<Package size={18} />}
//                 name="items"
//                 type="number"
//                 value={form.items}
//                 onChange={handleChange}
//                 placeholder="Items Count"
//               />
//             </div>

//             {/* ================= CATEGORY SELECT ================= */}

//             <div className="mt-6">
//               <p className="text-slate-300 mb-4">Select Categories</p>

//               {/* CUSTOM SELECT */}
//               <div className="relative">
//                 {/* SELECT BUTTON */}
//                 <button
//                   type="button"
//                   onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
//                   className="
//         w-full min-h-[56px]
//         bg-slate-900/80
//         border border-slate-700
//         rounded-2xl
//         px-5 py-3
//         text-left
//         text-white
//         flex items-center justify-between
//         hover:border-indigo-500
//         transition-all
//       "
//                 >
//                   <div className="flex flex-wrap gap-2">
//                     {form.category.length > 0 ? (
//                       form.category.map((catId) => {
//                         const cat = categories.find(
//                           (item) => item.id === catId,
//                         );

//                         return (
//                           <div
//                             key={catId}
//                             className="
//                   flex items-center gap-2
//                   bg-indigo-500/10
//                   border border-indigo-500/20
//                   px-3 py-1 rounded-xl
//                 "
//                           >
//                             <img
//                               src={`/categoriesIcon/${cat.icon}.png`}
//                               alt={cat.name}
//                               className="w-5 h-5"
//                             />

//                             <span className="text-sm">{cat.name}</span>
//                           </div>
//                         );
//                       })
//                     ) : (
//                       <span className="text-slate-500">Choose Categories</span>
//                     )}
//                   </div>

//                   <div className="text-slate-400 text-sm">▼</div>
//                 </button>

//                 {/* DROPDOWN */}
//                 {showCategoryDropdown && (
//                   <div
//                     className="
//           absolute top-full left-0 mt-3
//           w-full z-50
//           bg-[#0f172a]
//           border border-slate-700
//           rounded-2xl
//           p-3
//           shadow-2xl
//           max-h-[300px]
//           overflow-y-auto
//         "
//                   >
//                     <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                       {categories.map((item) => {
//                         const active = form.category.includes(item.id);

//                         return (
//                           <button
//                             type="button"
//                             key={item.id}
//                             onClick={() => {
//                               const exists = form.category.includes(item.id);

//                               setForm((prev) => ({
//                                 ...prev,
//                                 category: exists
//                                   ? prev.category.filter((id) => id !== item.id)
//                                   : [...prev.category, item.id],
//                               }));
//                             }}
//                             className={`
//                   relative
//                   py-4 rounded-2xl border
//                   transition-all
//                   ${
//                     active
//                       ? "border-indigo-500 bg-indigo-500/10"
//                       : "border-slate-700 bg-slate-400 hover:border-slate-500"
//                   }
//                 `}
//                           >
//                             {/* CHECK */}
//                             {active && (
//                               <div
//                                 className="
//                       absolute top-2 right-2
//                       w-5 h-5 rounded-full
//                       bg-indigo-500
//                       text-white text-xs
//                       flex items-center justify-center
//                     "
//                               >
//                                 ✓
//                               </div>
//                             )}

//                             <img
//                               src={`/categoriesIcon/${item.icon}.png`}
//                               alt={item.name}
//                               className="size-10 mx-auto"
//                             />

//                             <p className="text-sm mt-2 text-white">
//                               {item.name}
//                             </p>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </SectionCard>

//           {/* ACCOUNT */}
//           <SectionCard title="Account Information" icon={<Mail size={20} />}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//               <InputField
//                 icon={<Mail size={18} />}
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="Email Address"
//               />

//               <InputField
//                 icon={<Phone size={18} />}
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 placeholder="Phone Number"
//               />

//               {/* PASSWORD */}
//               <div className="relative md:col-span-2">
//                 <div
//                   className="
//                     absolute left-4 top-1/2 -translate-y-1/2
//                     text-slate-500
//                   "
//                 >
//                   <Lock size={18} />
//                 </div>

//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Password"
//                   className="
//                     w-full h-12
//                     bg-slate-900
//                     border border-slate-700
//                     rounded-2xl
//                     pl-12 pr-12
//                     text-white
//                     outline-none
//                     focus:border-indigo-500
//                   "
//                 />

//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="
//                     absolute right-4 top-1/2 -translate-y-1/2
//                     text-slate-500 hover:text-white
//                   "
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//               </div>
//             </div>
//           </SectionCard>
//                 {/* PAYMENT */}
//           <SectionCard
//             title="Payment Information"
//             icon={<CreditCard size={20} />}
//           >
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//               <InputField
//                 icon={<User size={18} />}
//                 name="name"
//                 value={form.payments[0].name}
//                 onChange={handlePaymentChange}
//                 placeholder="Payment Name"
//               />

//               <InputField
//                 icon={<Phone size={18} />}
//                 name="phone"
//                 value={form.payments[0].phone}
//                 onChange={handlePaymentChange}
//                 placeholder="Payment Phone"
//               />

//               {/* CUSTOM PAYMENT SELECT */}
//               <div className="relative">
//                 {/* BUTTON */}
//                 <button
//                   type="button"
//                   onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
//                   className="
//           relative
//           w-full h-12
//           bg-slate-900
//           border border-slate-700
//           rounded-2xl
//           pl-12 pr-10
//           text-left
//           text-white
//           hover:border-indigo-500
//           transition-all
//         "
//                 >
//                   {/* ICON */}
//                   <div
//                     className="
//             absolute left-4 top-1/2
//             -translate-y-1/2
//             text-slate-500
//           "
//                   >
//                     <CreditCard size={18} />
//                   </div>

//                   {/* VALUE */}
//                   <span
//                     className={
//                       form.payments[0].method ? "text-white" : "text-slate-500"
//                     }
//                   >
//                     {form.payments[0].method || "Select Payment "}
//                   </span>

//                   {/* ARROW */}
//                   <div
//                     className="
//             absolute right-4 top-1/2
//             -translate-y-1/2
//             text-slate-500
//           "
//                   >
//                     ▼
//                   </div>
//                 </button>

//                 {/* DROPDOWN */}
//                 {showPaymentDropdown && (
//                   <div
//                     className="
//             absolute top-full left-0 mt-3
//             w-full z-50
//             bg-[#0f172a]
//             border border-slate-700
//             rounded-2xl
//             p-2
//             shadow-2xl
//           "
//                   >
//                     <div className="space-y-2">
//                       {paymentMethods.map((method) => {
//                         const active = form.payments[0].method === method;

//                         return (
//                           <button
//                             key={method}
//                             type="button"
//                             onClick={() => {
//                               setForm((prev) => ({
//                                 ...prev,
//                                 payments: [
//                                   {
//                                     ...prev.payments[0],
//                                     method,
//                                   },
//                                 ],
//                               }));

//                               setShowPaymentDropdown(false);
//                             }}
//                             className={`
//                     w-full h-12 rounded-xl
//                     px-4 text-left
//                     transition-all
//                     border
//                     ${
//                       active
//                         ? "bg-indigo-500/10 border-indigo-500 text-white"
//                         : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
//                     }
//                   `}
//                           >
//                             {method}
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </SectionCard>

//           {/* LOCATION */}
//           <SectionCard title="Location Information" icon={<MapPin size={20} />}>
//             <div className="space-y-5 ">
//               <textarea
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 rows={3}
//                 placeholder="Shop Address"
//                 className="
//                   w-full
//                   bg-slate-900
//                   border border-slate-700
//                   rounded-2xl
//                   px-4 py-3
//                   text-white
//                   outline-none
//                   focus:border-indigo-500
//                 "
//               />

//               {/* LOCATION BUTTON */}
//               <div className="flex gap-3">
//                 <input
//                   type="text"
//                   readOnly
//                   value={
//                     form.location.latitude
//                       ? `Lat ${form.location.latitude}, Log ${form.location.longitude}`
//                       : ""
//                   }
//                   placeholder="Current Location"
//                   className="
//                     flex-1 h-12
//                     bg-slate-900
//                     border border-slate-700
//                     rounded-2xl
//                     px-4
//                     text-white
//                   "
//                 />

//                 <button
//                   type="button"
//                   onClick={getCurrentLocation}
//                   className="
//                     w-12 h-12 rounded-2xl
//                     bg-indigo-600 hover:bg-indigo-500
//                     flex items-center justify-center
//                   "
//                 >
//                   <MapPin size={18} />
//                 </button>
//               </div>
//             </div>
//           </SectionCard>

//           {/* DELIVERY */}
//           <SectionCard title="Delivery Information" icon={<Truck size={20} />}>
//             <div className="flex flex-col lg:flex-row lg:items-end gap-5">
//               {/* HAVE DELIVERY */}
//               <div className="flex-1">
//                 <p className="text-slate-300 mb-4">Have Own Delivery?</p>

//                 <div className="flex gap-4">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setForm((prev) => ({
//                         ...prev,
//                         have_deliverymen: 1,
//                         deli_fees_method: "km",
//                       }))
//                     }
//                     className={`
//             flex-1 h-14 rounded-2xl border
//             font-medium transition-all
//             ${
//               form.have_deliverymen === 1
//                 ? "border-indigo-500 bg-indigo-500/10 text-white"
//                 : "border-slate-700 text-slate-400 hover:border-slate-500"
//             }
//           `}
//                   >
//                     Yes
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() =>
//                       setForm((prev) => ({
//                         ...prev,
//                         have_deliverymen: 0,
//                         deli_fees_method: "",
//                       }))
//                     }
//                     className={`
//             flex-1 h-14 rounded-2xl border
//             font-medium transition-all
//             ${
//               form.have_deliverymen === 0
//                 ? "border-red-500 bg-red-500/10 text-white"
//                 : "border-slate-700 text-slate-400 hover:border-slate-500"
//             }
//           `}
//                   >
//                     No
//                   </button>
//                 </div>
//               </div>

//               {/* PRICE METHOD */}
//               {form.have_deliverymen === 1 && (
//                 <div className="w-full lg:w-[260px]">
//                   <p className="text-slate-300 mb-4">Delivery Price Type</p>

//                   <div
//                     className="
//             h-14 px-5
//             rounded-2xl
//             bg-indigo-500/10
//             border border-indigo-500/20
//             flex items-center
//             text-white font-medium
//           "
//                   >
//                     Price By KM
//                   </div>
//                 </div>
//               )}
//             </div>
//           </SectionCard>

//           {/* BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="
//               w-full h-14
//               rounded-3xl
//               bg-indigo-600 hover:bg-indigo-500
//               text-white font-semibold text-lg
//               transition-all duration-200
//               flex items-center justify-center gap-3
//               disabled:opacity-50
//             "
//           >
//             {loading ? (
//               <>
//                 <Loader2 size={20} className="animate-spin" />
//                 Creating Account...
//               </>
//             ) : (
//               "Create Shop Account"
//             )}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// /* ================= SECTION ================= */
// function SectionCard({ title, icon, children }) {
//   return (
//     <div
//       className="
//         bg-[#111827]
//         border border-slate-800
//         rounded-3xl
//         p-6
//       "
//     >
//       <div className="flex items-center gap-3 mb-6">
//         <div
//           className="
//             w-11 h-11 rounded-2xl
//             bg-indigo-500/10
//             text-indigo-400
//             flex items-center justify-center
//           "
//         >
//           {icon}
//         </div>

//         <h2 className="text-xl font-semibold">{title}</h2>
//       </div>

//       {children}
//     </div>
//   );
// }

// /* ================= INPUT ================= */
// function InputField({
//   icon,
//   name,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
// }) {
//   return (
//     <div className="relative">
//       <div
//         className="
//           absolute left-4 top-1/2 -translate-y-1/2
//           text-slate-500
//         "
//       >
//         {icon}
//       </div>

//       <input
//         type={type}
//         name={name}
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="
//           w-full h-12
//           bg-slate-900
//           border border-slate-700
//           rounded-2xl
//           pl-12 pr-4
//           text-white
//           outline-none
//           focus:border-indigo-500
//           transition-all
//         "
//       />
//     </div>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Eye,
  EyeOff,
  Loader2,
  Store,
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Package,
  CreditCard,
  Truck,
} from "lucide-react";

import { useAlert } from "../AlertProvider";

export default function SignupPage() {
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

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

  // ================= PAYMENT METHODS =================
  const paymentMethods = [
    "KBZPay",
    "WAVEPay",
    "AYAPay",
    "CBPay",
    "AGBPay",
    "UABPay",
    "YOMAPay",
    "MCBPay",
  ];

  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // ================= FORM =================
  const [form, setForm] = useState({
    shopkeeper_name: "",
    shop_name: "",
    email: "",
    phone: "",
    password: "",
    address: "",

    items: "",

    location: {
      latitude: "",
      longitude: "",
    },

    payments: [
      {
        name: "",
        phone: "",
        method: "",
      },
    ],

    have_deliverymen: 1,
    deli_fees_method: "km",

    category: [],

    photo: "",
  });

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= PAYMENT CHANGE =================
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      payments: [
        {
          ...prev.payments[0],
          [name]: value,
        },
      ],
    }));
  };

  // ================= CATEGORY =================
  const handleCategory = (id) => {
    setForm((prev) => {
      const exists = prev.category.includes(id);

      return {
        ...prev,
        category: exists
          ? prev.category.filter((item) => item !== id)
          : [...prev.category, id],
      };
    });
  };

  // ================= PHOTO =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // LIMIT
    if (file.size > 2 * 1024 * 1024) {
      showAlert("Image must be under 2MB", "error");

      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ================= LOCATION =================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showAlert("Geolocation is not supported", "error");

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude);

        const lng = parseFloat(position.coords.longitude);

        setForm((prev) => ({
          ...prev,

          location: {
            latitude: lat,
            longitude: lng,
          },
        }));

        showAlert("Location added successfully", "success");
      },

      (error) => {
        console.error(error);

        showAlert("Cannot get current location", "error");
      },
    );
  };

  // ================= SIGNUP =================
  const handleSignup = async (e) => {
    e.preventDefault();

    if (
      !form.shopkeeper_name.trim() ||
      !form.shop_name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim() ||
      !form.address.trim() ||
      !form.items ||
      !form.location.latitude ||
      !form.location.longitude ||
      !form.payments[0].name.trim() ||
      !form.payments[0].phone.trim() ||
      !form.payments[0].method ||
      form.category.length === 0
    ) {
      showAlert("Please fill all required fields", "error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showAlert("Email သည် မှန်ကန်သော format မဟုတ်ပါ", "warning");
      return;
    }

    // PHONE VALIDATION
    const phoneRegex = /^[0-9]{8,12}$/;

    if (!phoneRegex.test(form.phone)) {
      showAlert("Phone Number သည် မှန်ကန်သော format မဟုတ်ပါ", "warning");
      return;
    }

    // PASSWORD VALIDATION
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(form.password)) {
      showAlert(
        "Password သည် အနည်းဆုံး 8 လုံးရှိရမည်၊ Uppercase, Lowercase, Number နှင့် Special Character ပါဝင်ရမည်။",
        "error",
      );
      return;
    }

    try {
      setLoading(true);

      // const payload = {
      //   ...form,
      //   items: Number(form.items),
      //   location: `Lag ${form.location.latitude}, Log ${form.location.longitude}`,
      // payments: form.payments,
      //   category: JSON.stringify(form.category),
      // };
const payload = {
  ...form,
  items: Number(form.items),
  location: `Lag ${form.location.latitude}, Log ${form.location.longitude}`,
  payments: form.payments,
  category: JSON.stringify(form.category),
}
      const res = await fetch("https://api.pwezayshops.com/shops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const apiMessage = data?.message || data?.error || "Unknown error";

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
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-indigo-950
        text-white
        px-4 py-10
        relative overflow-hidden
        
      "
    >
      {/* GLOW */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      <div className="relative max-w-4xl mx-auto border border-slate-800 rounded-3xl p-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          {/* LEFT TEXT */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Create Shop Account
            </h1>

            <p className="text-slate-400 mt-1">
              Setup your shop profile and start selling
            </p>
          </div>

          {/* RIGHT ICON */}
          <div className="hidden md:flex">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Store size={28} className="text-indigo-400" />
            </div>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* PHOTO */}
          <div className="flex justify-center mb-6">
            <label className="relative cursor-pointer group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* OUTER RING */}
              <div className="w-32 h-32 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-tr from-indigo-500/40 to-purple-500/20">
                {/* IMAGE BOX */}
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border border-slate-700 relative">
                  {form.photo ? (
                    <img
                      src={form.photo}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 text-sm">
                      No Image
                    </div>
                  )}

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Camera size={24} className="text-white" />
                  </div>
                </div>
              </div>

              {/* SMALL EDIT BUTTON */}
              <div className="absolute bottom-2 right-2 bg-indigo-600 w-9 h-9 rounded-full flex items-center justify-center shadow-lg border border-white/10">
                <Camera size={16} className="text-white" />
              </div>
            </label>
          </div>

          {/* SHOP INFO */}
          <SectionCard title="Shop Information" icon={<Store size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                icon={<User size={18} />}
                name="shopkeeper_name"
                value={form.shopkeeper_name}
                onChange={handleChange}
                placeholder="Shopkeeper Name"
              />

              <InputField
                icon={<Store size={18} />}
                name="shop_name"
                value={form.shop_name}
                onChange={handleChange}
                placeholder="Shop Name"
              />

              <InputField
                icon={<Package size={18} />}
                name="items"
                type="number"
                value={form.items}
                onChange={handleChange}
                placeholder="Items Count"
              />
            </div>

            {/* ================= CATEGORY SELECT ================= */}

            <div className="mt-6">
              <p className="text-slate-300 mb-4">Select Categories</p>

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
                    {form.category.length > 0 ? (
                      form.category.map((catId) => {
                        const cat = categories.find(
                          (item) => item.id === catId,
                        );

                        return (
                          <div
                            key={catId}
                            className="
                  flex items-center gap-2
                  bg-indigo-500/10
                  border border-indigo-500/20
                  px-3 py-2 rounded-xl
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
          max-h-[250px] custom-scrollbar
          overflow-y-auto
        "
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {categories.map((item) => {
                        const active = form.category.includes(item.id);

                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => {
                              const exists = form.category.includes(item.id);

                              setForm((prev) => ({
                                ...prev,
                                category: exists
                                  ? prev.category.filter((id) => id !== item.id)
                                  : [...prev.category, item.id],
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

                            <p className="text-sm mt-1 text-white">
                              {item.name}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ACCOUNT */}
          <SectionCard title="Account Information" icon={<Mail size={20} />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField
                icon={<Mail size={18} />}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
              />

              <InputField
                icon={<Phone size={18} />}
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />

              {/* PASSWORD */}
              <div className="relative md:col-span-2">
                <div
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-slate-500
                  "
                >
                  <Lock size={18} />
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="
                    w-full h-12
                    bg-slate-900
                    border border-slate-700
                    rounded-2xl
                    pl-12 pr-12
                    text-white
                    outline-none
                    focus:border-indigo-500
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute right-4 top-1/2 -translate-y-1/2
                    text-slate-500 hover:text-white
                  "
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </SectionCard>
          {/* PAYMENT */}
          <SectionCard
            title="Payment Information"
            icon={<CreditCard size={20} />}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputField
                icon={<User size={18} />}
                name="name"
                value={form.payments[0].name}
                onChange={handlePaymentChange}
                placeholder="Payment Name"
              />

              <InputField
                icon={<Phone size={18} />}
                name="phone"
                value={form.payments[0].phone}
                onChange={handlePaymentChange}
                placeholder="Payment Phone"
              />

              {/* CUSTOM PAYMENT SELECT */}
              <div className="relative">
                {/* BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowPaymentDropdown(!showPaymentDropdown)}
                  className="
          relative
          w-full h-12
          bg-slate-900
          border border-slate-700
          rounded-2xl
          pl-12 pr-10
          text-left
          text-white
          hover:border-indigo-500
          transition-all
        "
                >
                  {/* ICON */}
                  <div
                    className="
            absolute left-4 top-1/2
            -translate-y-1/2
            text-slate-500
          "
                  >
                    <CreditCard size={18} />
                  </div>

                  {/* VALUE */}
                  <span
                    className={
                      form.payments[0].method ? "text-white" : "text-slate-500"
                    }
                  >
                    {form.payments[0].method || "Select Payment "}
                  </span>

                  {/* ARROW */}
                  <div
                    className="
            absolute right-4 top-1/2
            -translate-y-1/2
            text-slate-500
          "
                  >
                    ▼
                  </div>
                </button>

                {/* DROPDOWN */}
                {showPaymentDropdown && (
                  <div
                    className="
            absolute top-full left-0 mt-3
            w-full z-50
            bg-[#0f172a]
            border border-slate-700
            rounded-2xl
            p-2
            shadow-2xl
          "
                  >
                    <div className="space-y-2">
                      {paymentMethods.map((method) => {
                        const active = form.payments[0].method === method;

                        return (
                          <button
                            key={method}
                            type="button"
                            onClick={() => {
                              setForm((prev) => ({
                                ...prev,
                                payments: [
                                  {
                                    ...prev.payments[0],
                                    method,
                                  },
                                ],
                              }));

                              setShowPaymentDropdown(false);
                            }}
                            className={`
                    w-full h-12 rounded-xl
                    px-4 text-left
                    transition-all
                    border
                    ${
                      active
                        ? "bg-indigo-500/10 border-indigo-500 text-white"
                        : "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500"
                    }
                  `}
                          >
                            {method}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* LOCATION */}
          <SectionCard title="Location Information" icon={<MapPin size={20} />}>
            <div className="space-y-5 ">
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                placeholder="Shop Address"
                className="
                  w-full
                  bg-slate-900
                  border border-slate-700
                  rounded-2xl
                  px-4 py-3
                  text-white
                  outline-none
                  focus:border-indigo-500
                "
              />

              {/* LOCATION BUTTON */}
              <div className="flex gap-3">
                <input
                  type="text"
                  readOnly
                  value={
                    form.location.latitude
                      ? `Lag ${form.location.latitude}, Log ${form.location.longitude}`
                      : ""
                  }
                  placeholder="Current Location"
                  className="
                    flex-1 h-12
                    bg-slate-900
                    border border-slate-700
                    rounded-2xl
                    px-4
                    text-white
                  "
                />

                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="
                    w-12 h-12 rounded-2xl
                    bg-indigo-600 hover:bg-indigo-500
                    flex items-center justify-center
                  "
                >
                  <MapPin size={18} />
                </button>
              </div>
            </div>
          </SectionCard>

          {/* DELIVERY */}
          <SectionCard title="Delivery Information" icon={<Truck size={20} />}>
            <div className="flex flex-col lg:flex-row lg:items-end gap-5">
              {/* HAVE DELIVERY */}
              <div className="flex-1">
                <p className="text-slate-300 mb-4">Have Own Delivery?</p>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        have_deliverymen: 1,
                        deli_fees_method: "km",
                      }))
                    }
                    className={`
            flex-1 h-14 rounded-2xl border
            font-medium transition-all
            ${
              form.have_deliverymen === 1
                ? "border-indigo-500 bg-indigo-500/10 text-white"
                : "border-slate-700 text-slate-400 hover:border-slate-500"
            }
          `}
                  >
                    Yes
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        have_deliverymen: 0,
                        deli_fees_method: "",
                      }))
                    }
                    className={`
            flex-1 h-14 rounded-2xl border
            font-medium transition-all
            ${
              form.have_deliverymen === 0
                ? "border-red-500 bg-red-500/10 text-white"
                : "border-slate-700 text-slate-400 hover:border-slate-500"
            }
          `}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* PRICE METHOD */}
              {form.have_deliverymen === 1 && (
                <div className="w-full lg:w-[260px]">
                  <p className="text-slate-300 mb-4">Delivery Price Type</p>

                  <div
                    className="
            h-14 px-5
            rounded-2xl
            bg-indigo-500/10
            border border-indigo-500/20
            flex items-center
            text-white font-medium
          "
                  >
                    Price By KM
                  </div>
                </div>
              )}
            </div>
          </SectionCard>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-14
              rounded-3xl
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold text-lg
              transition-all duration-200
              flex items-center justify-center gap-3
              disabled:opacity-50
            "
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Shop Account"
            )}
          </button>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="
      text-indigo-400
      hover:text-indigo-300
      font-medium
      transition
      underline-offset-4 hover:underline
    "
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */
function SectionCard({ title, icon, children }) {
  return (
    <div
      className="
        bg-[#111827]
        border border-slate-800
        rounded-3xl
        p-6
      "
    >
      <div className="flex items-center gap-3 mb-6">
        <div
          className="
            w-11 h-11 rounded-2xl
            bg-indigo-500/10
            text-indigo-400
            flex items-center justify-center
          "
        >
          {icon}
        </div>

        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      {children}
    </div>
  );
}

/* ================= INPUT ================= */
function InputField({
  icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="relative">
      <div
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-slate-500
        "
      >
        {icon}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full h-12
          bg-slate-900
          border border-slate-700
          rounded-2xl
          pl-12 pr-4
          text-white
          outline-none
          focus:border-indigo-500
          transition-all
        "
      />
    </div>
  );
}
