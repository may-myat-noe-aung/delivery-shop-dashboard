

// import { useNavigate, useLocation } from "react-router-dom";
// import { MdLogout } from "react-icons/md";
// import { useAlert } from "../AlertProvider";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { showAlert, confirm } = useAlert();

//   // ✅ Logout function with confirmation and alert
//   // const handleLogout = async () => {
//   //   const ok = await confirm("Are you sure you want to logout?");
//   //   if (!ok) return;

//   //   // 🔐 remove cookie
//   //   document.cookie = "shopId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

//   //   // 🔔 show success alert
//   //   showAlert("Logged out successfully!", "success");

//   //   // ✅ navigate to login
//   //   navigate("/login", { replace: true });
//   // };
//   const handleLogout = async () => {
//   const ok = await confirm("Are you sure you want to logout?");
//   if (!ok) return;

//   // 🔐 cookie ဖျက်
//   document.cookie =
//     "shopId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
//   document.cookie =
//     "haveDelivery=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

//   // 🧹 localStorage ဖျက်
//   localStorage.removeItem("shopId");
//   localStorage.removeItem("haveDelivery");

//   // 🔔 alert ပြ
//   showAlert("Logged out successfully!", "success");

//   // 🚀 login page သို့သွား
//   navigate("/login", { replace: true });
// };

//   // 🔥 Dynamic Title
//   const getTitle = () => {
//     switch (location.pathname) {
//       case "/":
//         return "Dashboard";
//       case "/orders":
//         return "Food Orders";
//       case "/delivery-men":
//         return "Delivery Men";
//       case "/create-menu":
//         return "Create Menu";
//       default:
//         return "Admin Panel";
//     }
//   };

//   return (
//     <nav className="h-16 bg-[#1e293b] border-b border-slate-800 px-8 flex items-center justify-between">
//       <h1 className="text-lg font-semibold text-indigo-400">{getTitle()}</h1>

//       <button
//         onClick={handleLogout}
//         className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
//       >
//         <MdLogout size={18} />
//         Logout
//       </button>
//     </nav>
//   );
// }

import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../AlertProvider";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert, confirm } = useAlert();

  // ✅ shop status state (false = closed, true = open)
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: fetch shop status from API
  const fetchShopStatus = async () => {
    try {
      const shopId = localStorage.getItem("shopId") || "S001";

      const res = await fetch(
        `http://38.60.244.137:3000/shops-open/${shopId}`
      );

      const data = await res.json();

      const status = data?.[0]?.open_shop;

      setIsOpen(status === 1);
    } catch (err) {
      console.error("Failed to fetch shop status:", err);
    }
  };

  // 🔥 NEW: run once on load
  useEffect(() => {
    fetchShopStatus();
  }, []);

  // 🔥 Toggle function
  const handleToggle = async () => {
    if (loading) return;

    const actionText = isOpen ? "close" : "open";
    const ok = await confirm(`Are you sure you want to ${actionText} shop?`);
    if (!ok) return;

    setLoading(true);

    try {
      const shopId = localStorage.getItem("shopId") || "S001";

      const url = isOpen
        ? `http://38.60.244.137:3000/off-shop/${shopId}`
        : `http://38.60.244.137:3000/open-shop/${shopId}`;

      const res = await fetch(url, {
        method: "PATCH",
      });

      const data = await res.json();

      if (data.success) {
        // 🔥 NEW: sync again with backend (better than manual toggle)
        fetchShopStatus();

        showAlert(data.message, "success");
      } else {
        showAlert("Something went wrong", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Dynamic Title
  const getTitle = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/orders":
        return "Food Orders";
      case "/delivery-men":
        return "Delivery Men";
      case "/create-menu":
        return "Create Menu";
      default:
        return "Admin Panel";
    }
  };

  return (
    <nav className="h-16 bg-[#1e293b] border-b border-slate-800 px-8 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-indigo-400">
        {getTitle()}
      </h1>

      {/* 🔥 Toggle UI */}
      <div className="flex items-center gap-3">
        <span
          className={`text-sm font-medium ${
            isOpen ? "text-green-400" : "text-red-400"
          }`}
        >
          {isOpen ? "Open" : "Closed"}
        </span>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
            isOpen ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
              isOpen ? "translate-x-6" : ""
            }`}
          />
        </button>
      </div>
    </nav>
  );
}