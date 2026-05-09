import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdDeliveryDining,
  MdAddBox,
  MdAssessment,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
  MdSettings,
} from "react-icons/md";
import { useEffect, useState } from "react";
import { getAuth } from "../auth";
import { useAlert } from "../AlertProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const [shopPhoto, setShopPhoto] = useState(null);
  const [shopName, setShopName] = useState("Shop Admin");
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const { showAlert, confirm } = useAlert();

  useEffect(() => {
    const { shopId } = getAuth();
    if (!shopId) return;

    fetch(`http://38.60.244.137:3000/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          const shop = data[0];
          setShopName(shop.shop_name);
          setShopPhoto(shop.photo);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleLogout = async () => {
    const ok = await confirm("Are you sure you want to logout?");
    if (!ok) return;

    document.cookie = "shopId=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie =
      "haveDelivery=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    localStorage.removeItem("shopId");
    localStorage.removeItem("haveDelivery");

    showAlert("Logged out successfully!", "success");
    navigate("/login", { replace: true });
  };

  const navStyle = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl text-sm transition 
    ${
      isActive
        ? "bg-slate-800 text-white"
        : "text-slate-400 hover:bg-slate-800 hover:text-white"
    }`;

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.3 }}
      className="bg-[#0f172a] border-r border-slate-800 p-4   flex-col  flex min-h-screen  text-natural-100 h-screen sticky top-0"
    >
      {/*  Modern Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 rounded-full p-1 hover:bg-slate-700 transition"
      >
        {collapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
      </button>

      {/* 👤 Profile */}
      <div
        className={`flex items-center mb-4 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <img
          src={
            shopPhoto
              ? `http://38.60.244.137:3000/shop-uploads/${shopPhoto}`
              : "https://via.placeholder.com/40"
          }
          alt="Shop"
          className="w-10 h-10 rounded-full object-cover border border-slate-600"
        />

        {/* ✨ Animated Shop Name */}
        <AnimatePresence>
          {!collapsed && (
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
            >
              {shopName}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      {/*  Menu */}
      <div className="space-y-2 flex-1">
        {[
          { to: "/", icon: <MdDashboard size={20} />, label: "Dashboard" },
          {
            to: "/orders",
            icon: <MdRestaurantMenu size={20} />,
            label: "Food Orders",
          },
          {
            to: "/create-menu",
            icon: <MdAddBox size={20} />,
            label: "Create Menu",
          },
          {
            to: "/delivery-men",
            icon: <MdDeliveryDining size={20} />,
            label: "Delivery Men",
          },
          { to: "/report", icon: <MdAssessment size={20} />, label: "Report" },
          {
            to: "/settings",
            icon: <MdSettings size={20} />,
            label: "Settings",
          },
        ].map((item, i) => (
          <NavLink key={i} to={item.to} className={navStyle}>
            {item.icon}

            {/* ✨ Animated Text */}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </div>

      {/*  Logout */}
      <button
        onClick={handleLogout}
        className={`flex items-center p-3 rounded-xl text-sm text-red-400 hover:bg-slate-800 transition mt-4 border-t border-slate-800 pt-4 ${
          collapsed ? "justify-center" : "gap-3"
        }`}
      >
        <MdLogout size={20} />

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              Logout
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.aside>
  );
}
