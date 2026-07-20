import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAlert } from "../../AlertProvider";

export default function DeliveryToggle({ shopId }) {
  const token = localStorage.getItem("shopToken");
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 IMPORTANT FIX: READY STATE ADDED
  const [ready, setReady] = useState(false);

  const [loading, setLoading] = useState(false);
  const { showAlert, confirm } = useAlert();

  // =========================
  // GET CURRENT STATUS
  // =========================
  useEffect(() => {
    const fetchStatus = async () => {
      if (!shopId) return;

      try {
        const res = await axios.get(
          `https://api.pwezayshops.com/shops-deli-open/${shopId}`,
          {
            headers: {
              Authorization: `MSHteam ${token}`,
            },
          },
        );

        const status = res.data?.[0]?.open_shop_deli;

        // 🔥 strict conversion
        setIsOpen(status == 1 || status == "1");

        // 🔥 ONLY AFTER API DONE
        setReady(true);
      } catch (err) {
        console.log(err);
        showAlert("Failed to load delivery status", "error");
      }
    };

    fetchStatus();
  }, [shopId]);

  // =========================
  // TOGGLE DELIVERY
  // =========================
  const handleToggle = async () => {
    if (!shopId) return;

    const ok = await confirm(
      isOpen
        ? "Are you sure to close delivery server?"
        : "Are you sure to open delivery server?",
    );

    if (!ok) return;

    setLoading(true);

    try {
      const url = isOpen
        ? `https://api.pwezayshops.com/off-shop-deli/${shopId}`
        : `https://api.pwezayshops.com/open-shop-deli/${shopId}`;

      // const res = await axios.patch(url);
      const res = await axios.patch(
        url,
        {},
        {
          headers: {
            Authorization: `MSHteam ${token}`,
          },
        },
      );

      if (res.data?.success) {
        setIsOpen((prev) => !prev);
        showAlert(res.data.message, "success");
      } else {
        showAlert("Failed to update delivery", "error");
      }
    } catch (err) {
      showAlert(err.response?.data?.error || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 🔥 HARD FIX: WAIT UNTIL API READY
  // =========================
  if (!ready) {
    return (
      <div className="text-gray-400 font-medium">
        Loading delivery status...
      </div>
    );
  }

  return (
    <div className="flex justify-end items-center gap-4 mb-4">
      <span className="text-lg font-semibold">
        Delivery:{" "}
        <span className={isOpen ? "text-green-400" : "text-red-400"}>
          {isOpen ? "Open" : "Closed"}
        </span>
      </span>

      <button
        onClick={handleToggle}
        disabled={loading}
        className={`px-4 py-2 rounded-lg font-medium transition ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Loading..." : isOpen ? "Close Delivery" : "Open Delivery"}
      </button>
    </div>
  );
}
