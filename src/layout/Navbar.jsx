import { useNavigate, useLocation } from "react-router-dom";
import { useAlert } from "../AlertProvider";
import { useState, useEffect } from "react";
import {
  Bell,
  RefreshCcw,
  Store,
  Settings,
} from "lucide-react";
import NotificationFetcher from "../NotificationFetcher";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert, confirm } = useAlert();

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // =============================
  // FETCH SHOP STATUS
  // =============================
  const fetchShopStatus = async () => {
    try {
      const shopId =
        localStorage.getItem("shopId") || "S001";

      const res = await fetch(
        `https://api.pwezayshops.com/shops-open/${shopId}`
      );

      const data = await res.json();
      const status = data?.[0]?.open_shop;

      setIsOpen(status === 1);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchShopStatus();
  }, []);

  // =============================
  // TOGGLE SHOP
  // =============================
  const handleToggle = async () => {
    if (loading) return;

    const action = isOpen ? "close" : "open";
    const ok = await confirm(
      `Are you sure you want to ${action} shop?`
    );
    if (!ok) return;

    setLoading(true);

    try {
      const shopId =
        localStorage.getItem("shopId") || "S001";

      const url = isOpen
        ? `https://api.pwezayshops.com/off-shop/${shopId}`
        : `https://api.pwezayshops.com/open-shop/${shopId}`;

      const res = await fetch(url, { method: "PATCH" });
      const data = await res.json();

      if (data.success) {
        fetchShopStatus();
        showAlert(data.message, "success");
      } else {
        showAlert("Failed to update shop", "error");
      }
    } catch (err) {
      showAlert("Server error", "error");
    } finally {
      setLoading(false);
    }
  };

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
      case "/settings":
        return "Settings";
      default:
        return "Admin Panel";
    }
  };

  return (
    <nav className="h-16 bg-[#0f172a] border-b border-slate-800 px-6 flex items-center justify-between ">

      {/* ================= LEFT ================= */}
      <div className="flex items-center gap-3">
        {/* <Store className="text-indigo-400" /> */}

        <h1 className="text-lg font-semibold text-indigo-300">
          {getTitle()}
        </h1>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="flex items-center gap-4">

    <div className="flex items-center gap-4">

 <NotificationFetcher />

  <div className="flex items-center gap-3 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">

    <span
      className={`text-sm font-medium ${
        isOpen
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {isOpen ? "Open" : "Closed"}
    </span>

    <button
      onClick={handleToggle}
      disabled={loading}
      className={`w-11 h-5 flex items-center rounded-full p-1 transition ${
        isOpen
          ? "bg-green-500"
          : "bg-gray-500"
      }`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
          isOpen ? "translate-x-5" : ""
        }`}
      />
    </button>
  </div>

</div>

     

      </div>
    </nav>
  );
}