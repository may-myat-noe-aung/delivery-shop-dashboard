// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Mail,
//   Lock,
//   Eye,
//   EyeOff,
//   Loader2,
//   Store,
// } from "lucide-react";

// import { useAlert } from "../AlertProvider";

// export default function LoginPage() {
//   const navigate = useNavigate();

//   const { showAlert } = useAlert();

//   const [loading, setLoading] = useState(false);

//   const [showPassword, setShowPassword] =
//     useState(false);

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   // ================= CHANGE =================
//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // ================= LOGIN =================
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     // VALIDATION
//     if (!form.email || !form.password) {
//       return showAlert(
//         "Please fill email and password",
//         "warning"
//       );
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(
//         "https://api.pwezayshops.com/login-shop",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(form),
//         }
//       );

//       const data = await res.json();

//       if (res.ok) {
//         // ================= LOCAL STORAGE =================
//         localStorage.setItem("shopId", data.id);

//         localStorage.setItem(
//           "haveDelivery",
//           data.have_deliverymen
//         );

//         // ================= ALERT =================
//         showAlert(
//           data?.message || "Login successful",
//           "success"
//         );

//         // ================= REDIRECT =================
//         setTimeout(() => {
//           navigate("/");
//         }, 500);
//       } else {
//         showAlert(
//           data?.message ||
//             "Login failed. Check email/password.",
//           "error"
//         );
//       }
//     } catch (err) {
//       console.error(err);

//       showAlert(
//         "Something went wrong. Please try again.",
//         "error"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="
//         min-h-screen
//         flex items-center justify-center
//         bg-gradient-to-br
//         from-slate-950
//         via-slate-900
//         to-indigo-950
//         px-4
//         relative overflow-hidden
//       "
//     >
//       {/* ================= GLOW ================= */}
//       <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

//       <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

//       {/* ================= CARD ================= */}
//       <div
//         className="
//           relative
//           w-full max-w-md
//           bg-[#111827]/90
//           backdrop-blur-xl
//           border border-slate-800
//           rounded-3xl
//           shadow-2xl
//           p-6 md:p-8
//         "
//       >
//         {/* LOGO */}
//         <div className="flex justify-center mb-6">
//           <div
//             className="
//               w-20 h-20 rounded-3xl
//               bg-indigo-500/10
//               border border-indigo-500/20
//               flex items-center justify-center
//               text-indigo-400
//             "
//           >
//             <Store size={36} />
//           </div>
//         </div>

//         {/* HEADER */}
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-white">
//             Shop Login
//           </h2>

//           <p className="text-slate-400 text-sm mt-2">
//             Login to manage your shop dashboard
//           </p>
//         </div>

//         {/* ================= FORM ================= */}
//         <form
//           onSubmit={handleLogin}
//           className="space-y-5"
//         >
//           {/* EMAIL */}
//           <div>
//             <p className="text-sm text-slate-400 mb-3">
//               Email Address
//             </p>

//             <div className="relative">
//               <div
//                 className="
//                   absolute left-4 top-1/2 -translate-y-1/2
//                   text-slate-500
//                 "
//               >
//                 <Mail size={18} />
//               </div>

//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={handleChange}
//                 className="
//                   w-full h-12
//                   bg-slate-900/70
//                   border border-slate-700
//                   rounded-2xl
//                   pl-12 pr-4
//                   text-white
//                   placeholder:text-slate-500
//                   outline-none
//                   focus:border-indigo-500
//                   transition-all
//                 "
//               />
//             </div>
//           </div>

//           {/* PASSWORD */}
//           <div>
//             <p className="text-sm text-slate-400 mb-3">
//               Password
//             </p>

//             <div className="relative">
//               {/* ICON */}
//               <div
//                 className="
//                   absolute left-4 top-1/2 -translate-y-1/2
//                   text-slate-500
//                 "
//               >
//                 <Lock size={18} />
//               </div>

//               {/* INPUT */}
//               <input
//                 type={
//                   showPassword ? "text" : "password"
//                 }
//                 name="password"
//                 placeholder="Enter your password"
//                 value={form.password}
//                 onChange={handleChange}
//                 className="
//                   w-full h-12
//                   bg-slate-900/70
//                   border border-slate-700
//                   rounded-2xl
//                   pl-12 pr-12
//                   text-white
//                   placeholder:text-slate-500
//                   outline-none
//                   focus:border-indigo-500
//                   transition-all
//                 "
//               />

//               {/* TOGGLE */}
//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowPassword(!showPassword)
//                 }
//                 className="
//                   absolute right-4 top-1/2 -translate-y-1/2
//                   text-slate-500 hover:text-white
//                   transition
//                 "
//               >
//                 {showPassword ? (
//                   <EyeOff size={18} />
//                 ) : (
//                   <Eye size={18} />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* LOGIN BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="
//               w-full h-12 mt-2
//               rounded-2xl
//               bg-indigo-600 hover:bg-indigo-500
//               text-white font-semibold
//               transition-all duration-200
//               flex items-center justify-center gap-2
//               disabled:opacity-50
//               disabled:cursor-not-allowed
//               shadow-lg shadow-indigo-500/20
//             "
//           >
//             {loading ? (
//               <>
//                 <Loader2
//                   size={18}
//                   className="animate-spin"
//                 />
//                 Logging in...
//               </>
//             ) : (
//               "Login"
//             )}
//           </button>
//         </form>

//         {/* FOOTER */}
//         <p className="mt-6 text-center text-sm text-slate-400">
//           Don’t have an account?{" "}
//           <span
//             onClick={() => navigate("/signup")}
//             className="
//               text-indigo-400
//               hover:text-indigo-300
//               font-medium
//               cursor-pointer
//               transition
//             "
//           >
//             Sign up
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Store } from "lucide-react";

import { useAlert } from "../AlertProvider";

export default function LoginPage() {
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!form.email || !form.password) {
      return showAlert("Please fill email and password", "warning");
    }

    try {
      setLoading(true);

      const res = await fetch("https://api.pwezayshops.com/login-shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("shopId", data.id);
        localStorage.setItem("shopToken", data.token);
        localStorage.setItem("haveDelivery", data.have_deliverymen);

        showAlert(data?.message || "Login successful", "success");

        navigate("/");
      } else {
        showAlert(
          data?.message || "Login failed. Check email/password.",
          "error",
        );
      }
    } catch (err) {
      console.error(err);

      showAlert("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-gradient-to-br
        from-slate-950
        via-slate-900
        to-indigo-950
        px-4
        relative overflow-hidden
      "
    >
      {/* ================= GLOW ================= */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full" />

      {/* ================= CARD ================= */}
      <div
        className="
          relative
          w-full max-w-md
          bg-[#111827]/90
          backdrop-blur-xl
          border border-slate-800
          rounded-3xl
          shadow-2xl
          p-6 md:p-8
        "
      >
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <div
            className="
              w-20 h-20 rounded-3xl
              bg-indigo-500/10
              border border-indigo-500/20
              flex items-center justify-center
              text-indigo-400
            "
          >
            <Store size={36} />
          </div>
        </div>

        {/* HEADER */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white">Shop Login</h2>

          <p className="text-slate-400 text-sm mt-2">
            Login to manage your shop dashboard
          </p>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div>
            <p className="text-sm text-slate-400 mb-3">Email Address</p>

            <div className="relative">
              <div
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  text-slate-500
                "
              >
                <Mail size={18} />
              </div>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                className="
                  w-full h-12
                  bg-slate-900/70
                  border border-slate-700
                  rounded-2xl
                  pl-12 pr-4
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-indigo-500
                  transition-all
                "
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <p className="text-sm text-slate-400 mb-3">Password</p>

            <div className="relative">
              {/* ICON */}
              <div
                className="
                  absolute left-4 top-1/2 -translate-y-1/2
                  text-slate-500
                "
              >
                <Lock size={18} />
              </div>

              {/* INPUT */}
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="
                  w-full h-12
                  bg-slate-900/70
                  border border-slate-700
                  rounded-2xl
                  pl-12 pr-12
                  text-white
                  placeholder:text-slate-500
                  outline-none
                  focus:border-indigo-500
                  transition-all
                "
              />

              {/* TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute right-4 top-1/2 -translate-y-1/2
                  text-slate-500 hover:text-white
                  transition
                "
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full h-12 mt-2
              rounded-2xl
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold
              transition-all duration-200
              flex items-center justify-center gap-2
              disabled:opacity-50
              disabled:cursor-not-allowed
              shadow-lg shadow-indigo-500/20
            "
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="
              text-indigo-400
              hover:text-indigo-300
              font-medium
              cursor-pointer
              transition
            "
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
