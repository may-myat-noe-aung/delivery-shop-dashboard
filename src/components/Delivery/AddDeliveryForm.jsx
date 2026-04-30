// import React, { useState, useRef, useEffect } from "react";
// import { Camera, Eye, EyeOff } from "lucide-react";
// import axios from "axios";
// import { useAlert } from "../../AlertProvider";

// export default function AddDeliveryForm({ onClose, onAdded }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     confirmPassword: "",
//     work_type: "Full time",
//     photo: null,
//   });

//   const [showPasscode, setShowPasscode] = useState(false);
//   const [passcode, setPasscode] = useState("");
//   const { showAlert } = useAlert();

//   const nameInputRef = useRef(null);
//   const passcodeInputRef = useRef(null);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       axios
//         .get("http://38.60.244.137:3000/deliverymen")
//         .then((res) => console.log("Auto fetch success:", res.data))
//         .catch((err) => console.log("Auto fetch error:", err));
//     }, 500);
//     return () => clearTimeout(timer);
//   }, []);

//   useEffect(() => {
//     if (nameInputRef.current) nameInputRef.current.focus();
//   }, []);

//   useEffect(() => {
//     if (showPasscode && passcodeInputRef.current) passcodeInputRef.current.focus();
//   }, [showPasscode]);

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setFormData({ ...formData, photo: file });
//   };

//   const openPasscodeBox = (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//  showAlert("Passwords do not match!", "warning");
//       return;
//     }
//     setShowPasscode(true);
//   };

//   const verifyPasscode = async () => {
//   if (passcode !== "234567") {
//  showAlert("Invalid Passcode!", "error");
//     return;
//   }

//   setShowPasscode(false);

//   try {
//     const payload = new FormData();
//     payload.append("name", formData.name);
//     payload.append("email", formData.email);
//     payload.append("phone", formData.phone);
//     payload.append("password", formData.password);
//     payload.append("work_type", formData.work_type);

//     if (formData.photo instanceof File) {
//       payload.append("photo", formData.photo);
//     }

//     const response = await axios.post(
//       "http://38.60.244.137:3000/deliverymen",
//       payload,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     showAlert(response.data.message || "Added successfully", "success");

//     onAdded?.();
//     onClose?.();

//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       password: "",
//       confirmPassword: "",
//       work_type: "Full time",
//       photo: null,
//     });

//     setPasscode("");
//   } catch (error) {
//     showAlert(
//       error.response?.data?.message || error.message || "Something went wrong.",
//       "error"
//     );
//   }
// };
//   return (
//     <>
//       {/* Main Modal */}
//       <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.6)]">
//         <div className="relative w-[450px] p-6 rounded-2xl shadow-lg bg-gray-800 text-gray-100">
//           <h2 className="text-lg font-semibold mb-4 text-indigo-500">Add Delivery Man</h2>

//           <form onSubmit={openPasscodeBox} className="space-y-3">
//             {/* Photo */}
//             <div className="flex flex-col items-center mb-4">
//               <div className="relative w-28 h-28">
//                 <img
//                   src={
//                     formData.photo
//                       ? URL.createObjectURL(formData.photo)
//                       : "https://i.pinimg.com/736x/4a/6b/e0/4a6be0cad2a1bb290e43477834fdf8ad.jpg"
//                   }
//                   alt="Profile Preview"
//                   className="w-full h-full rounded-full object-cover border-2 border-dashed border-gray-600 shadow-sm"
//                 />
//                 <label className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-[#9b5de5] text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md">
//                   <Camera className="w-4 h-4" />
//                   <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                 </label>
//               </div>
//               <p className="mt-2 text-sm text-gray-300">Upload profile image (optional)</p>
//             </div>

//             {/* Inputs */}
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Name"
//               className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
//               required
//               ref={nameInputRef}
//             />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
//               required
//             />

//             {/* Password */}
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Password"
//                 className="w-full px-3 py-2 rounded-lg text-sm border pr-10 bg-gray-700 border-gray-600 text-gray-100"
//                 required
//               />
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300" onClick={() => setShowPassword(!showPassword)}>
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </span>
//             </div>

//             {/* Confirm Password */}
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm Password"
//                 className="w-full px-3 py-2 rounded-lg text-sm border pr-10 bg-gray-700 border-gray-600 text-gray-100"
//                 required
//               />
//               <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </span>
//             </div>

//             <input
//               type="text"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Phone"
//               className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
//               required
//             />

//             <select
//               name="work_type"
//               value={formData.work_type}
//               onChange={handleChange}
//               className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
//             >
//               <option>Full time</option>
//               <option>Part time</option>
//             </select>

//             <div className="flex justify-end gap-2 pt-3">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="px-4 py-2 rounded-lg text-sm border border-gray-600 text-gray-100 hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm">
//                 Save
//               </button>
//             </div>
//           </form>

//           <button onClick={onClose} className="absolute top-3 right-3 text-gray-300 hover:text-white">
//             ✕
//           </button>
//         </div>
//       </div>

//       {/* Passcode Modal */}
//       {showPasscode && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
//           <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)]" onClick={() => setShowPasscode(false)} />
//           <div className="relative p-6 w-[330px] rounded-xl shadow-2xl border bg-gray-800 border-gray-600 text-gray-100">
//             <h3 className="text-lg font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
//               Enter Passcode
//             </h3>
//             <input
//               ref={passcodeInputRef}
//               type="password"
//               className="border rounded-lg w-full px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 bg-gray-700 border-gray-600 text-gray-100"
//               placeholder="Passcode"
//               value={passcode}
//               onChange={(e) => setPasscode(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && verifyPasscode()}
//             />
//             <div className="flex justify-between gap-2">
//               <button
//                 onClick={() => setShowPasscode(false)}
//                 className="px-4 py-1.5 rounded-lg border border-gray-600 text-sm text-gray-100 hover:bg-gray-700"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={verifyPasscode}
//                 className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90"
//               >
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAlert } from "../../AlertProvider";

export default function AddDeliveryForm({ shopId, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    work_type: null, // null OR shop_id
    location: "",
    photo: null,
  });

  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const { showAlert } = useAlert();

  const nameInputRef = useRef(null);
  const passcodeInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     axios
  //       .get("http://38.60.244.137:3000/deliverymen")
  //       .then((res) => console.log("Auto fetch success:", res.data))
  //       .catch((err) => console.log("Auto fetch error:", err));
  //   }, 500);
  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get("http://38.60.244.137:3000/shops")
  //     .then((res) => setShops(res.data))
  //     .catch((err) => console.log(err));
  // }, []);

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, []);

  useEffect(() => {
    if (showPasscode && passcodeInputRef.current)
      passcodeInputRef.current.focus();
  }, [showPasscode]);

  useEffect(() => {
    if (shopId) {
      setFormData((prev) => ({
        ...prev,
        work_type: shopId, // or shop_id (recommended)
      }));
    }
  }, [shopId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, photo: file });
  };

  const openPasscodeBox = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showAlert("Passwords do not match!", "warning");
      return;
    }
    setShowPasscode(true);
  };

  const verifyPasscode = async () => {
    if (passcode !== "234567") {
      showAlert("Invalid Passcode!", "error");
      return;
    }

    setShowPasscode(false);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("phone", formData.phone);
      payload.append("password", formData.password);
      payload.append("work_type", formData.work_type);
      // payload.append("work_type", formData.work_type || null);
      payload.append("location", formData.location || null);

      if (formData.photo instanceof File) {
        payload.append("photo", formData.photo);
      }

      const response = await axios.post(
        "http://38.60.244.137:3000/deliverymen",
        payload,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      showAlert(response.data.message || "Added successfully", "success");

      onAdded?.();
      onClose?.();

      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        work_type: shopId || null,
        location: "",
        photo: null,
      });

      setPasscode("");
    } catch (error) {
      showAlert(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong.",
        "error",
      );
    }
  };
  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.6)]">
        <div className="relative w-[450px] p-6 rounded-2xl shadow-lg bg-gray-800 text-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-indigo-500">
            Add Delivery Man
          </h2>

          <form onSubmit={openPasscodeBox} className="space-y-3">
            {/* Photo */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-28 h-28">
                <img
                  src={
                    formData.photo
                      ? URL.createObjectURL(formData.photo)
                      : "https://i.pinimg.com/736x/4a/6b/e0/4a6be0cad2a1bb290e43477834fdf8ad.jpg"
                  }
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover border-2 border-dashed border-gray-600 shadow-sm"
                />
                <label className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-[#9b5de5] text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-300">
                Upload profile image (optional)
              </p>
            </div>

            {/* Inputs */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
              required
              ref={nameInputRef}
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location (optional)"
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 rounded-lg text-sm border pr-10 bg-gray-700 border-gray-600 text-gray-100"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 rounded-lg text-sm border pr-10 bg-gray-700 border-gray-600 text-gray-100"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
              required
            />

            {/* <select
              name="work_type"
              value={formData.work_type}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
            >
              <option>Full time</option>
              <option>Part time</option>
            </select> */}

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm border border-gray-600 text-gray-100 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm"
              >
                Save
              </button>
            </div>
          </form>

          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-300 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Passcode Modal */}
      {showPasscode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div
            className="absolute inset-0 bg-[rgba(0,0,0,0.6)]"
            onClick={() => setShowPasscode(false)}
          />
          <div className="relative p-6 w-[330px] rounded-xl shadow-2xl border bg-gray-800 border-gray-600 text-gray-100">
            <h3 className="text-lg font-bold text-center mb-4 bg-gradient-to-r from-indigo-500 to-indigo-600 bg-clip-text text-transparent">
              Enter Passcode
            </h3>
            <input
              ref={passcodeInputRef}
              type="password"
              className="border rounded-lg w-full px-3 py-2 mb-4 focus:ring-2 focus:ring-indigo-500 bg-gray-700 border-gray-600 text-gray-100"
              placeholder="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verifyPasscode()}
            />
            <div className="flex justify-between gap-2">
              <button
                onClick={() => setShowPasscode(false)}
                className="px-4 py-1.5 rounded-lg border border-gray-600 text-sm text-gray-100 hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={verifyPasscode}
                className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow hover:opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* Work Type */
}

// <div className="relative w-full">
//   {/* SELECT BOX */}
//   <div
//     onClick={() => setOpen(!open)}
//     className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100 cursor-pointer"
//   >
//     {formData.work_type
//       ? shops.find((s) => s.id === formData.work_type)?.shop_name
//       : "None"}
//   </div>

//   {/* DROPDOWN LIST */}
//   {open && (
//     <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg max-h-52 overflow-y-auto">
//       {/* NONE */}
//       <div
//         onClick={() => {
//           setFormData({ ...formData, work_type: null });
//           setOpen(false);
//         }}
//         className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
//       >
//         None
//       </div>

//       {/* SHOPS */}
//       {shops.map((shop) => (
//         <div
//           key={shop.id}
//           onClick={() => {
//             setFormData({
//               ...formData,
//               work_type: shop.id,
//             });
//             setOpen(false);
//           }}
//           className="px-3 py-2 hover:bg-gray-700 cursor-pointer"
//         >
//           {shop.shop_name}
//         </div>
//       ))}
//     </div>
//   )}
// </div>
