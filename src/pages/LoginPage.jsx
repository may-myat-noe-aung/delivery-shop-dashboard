// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate(); // navigation

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       const res = await fetch("http://38.60.244.137:3000/login-shop", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Login successful!");
//         navigate("/"); // ✅ success → dashboard
//       } else {
//         setMessage(data.message || "Login failed. Check email/password.");
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
//       <div className="bg-[#1a2030]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-96">
//         <h2 className="text-2xl font-semibold mb-6 text-indigo-400 text-center">Shop Login</h2>

//         {message && (
//           <div className={`mb-4 px-4 py-2 rounded-md text-center ${
//             message.includes("successful") ? "bg-green-600" : "bg-red-600"
//           }`}>
//             {message}
//           </div>
//         )}

//         <form onSubmit={handleLogin} className="flex flex-col gap-3">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`mt-2 px-4 py-2 rounded-2xl text-white font-semibold ${
//               loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400"
//             } transition`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAlert } from "../AlertProvider";

// export default function LoginPage() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { showAlert } = useAlert(); // use alert context

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("http://38.60.244.137:3000/login-shop", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // ✅ Show success alert from API message
//         showAlert(data.message, "success");

//         // Redirect to dashboard after short delay
//         setTimeout(() => {
//           navigate("/"); // dashboard route
//         }, 500);
//       } else {
//         // Error message from API
//         showAlert(data.message || "Login failed. Check email/password.", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Something went wrong. Please try again.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
//       <div className="bg-[#1a2030]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-96">
//         <h2 className="text-2xl font-semibold mb-6 text-indigo-400 text-center">
//           Shop Login
//         </h2>

//         <form onSubmit={handleLogin} className="flex flex-col gap-3">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={handleChange}
//             className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={handleChange}
//             className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className={`mt-2 px-4 py-2 rounded-2xl text-white font-semibold ${
//               loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400"
//             } transition`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../AlertProvider";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showAlert } = useAlert(); // alert context

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // --- helper to set cookie ---
  const setCookie = (name, value, days = 1) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Strict`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://38.60.244.137:3000/login-shop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ store id in cookie
        setCookie("shopId", data.id, 1); // 1 day expiration

        // ✅ show success alert
        showAlert(data.message, "success");

        // ✅ redirect to dashboard after short delay
        setTimeout(() => {
          navigate("/"); // dashboard route
        }, 500);
      } else {
        showAlert(data.message || "Login failed. Check email/password.", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-900 text-white">
      <div className="bg-[#1a2030]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-96">
        <h2 className="text-2xl font-semibold mb-6 text-indigo-400 text-center">
          Shop Login
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="rounded-2xl bg-neutral-900 border border-neutral-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`mt-2 px-4 py-2 rounded-2xl text-white font-semibold ${
              loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-400"
            } transition`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}