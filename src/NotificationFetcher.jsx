
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { getAuth } from "./utils/auth";
import { apiFetch } from "./api";

export default function NotificationFetcher() {
  const { shopId } = getAuth();
  const token = localStorage.getItem("shopToken");

  const [notifications, setNotifications] = useState([]);
  const audioRef = useRef(null);

  // =============================
  // INIT SOUND
  // =============================
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.preload = "auto";
  }, []);

  const playSound = () => {
    try {
      if (!audioRef.current) return;

      audioRef.current.pause();
      audioRef.current.currentTime = 0;

      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log("Sound blocked:", err);
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // LOAD SAVED NOTIFICATIONS
  // =============================
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(saved);
  }, []);

  const saveNotifications = (data) => {
    setNotifications(data);
    localStorage.setItem("notifications", JSON.stringify(data));
  };

  const addNotification = (notif) => {
    const prev = JSON.parse(localStorage.getItem("notifications")) || [];

    const updated = [notif, ...prev];

    saveNotifications(updated);
    playSound();
  };

  // =============================
  // FETCH DATA
  // =============================
  const fetchData = async () => {
    try {
      // =====================
      // NEW ORDERS
      // =====================
      const orderRes = await apiFetch(
        `https://api.pwezayshops.com/orders-by-shop-noti/${shopId}`,
        {},
      );
      if (!orderRes) return;
      const orderData = await orderRes.json();

      const orders = orderData?.data || [];

      if (orders.length > 0) {
        const latestOrder = orders[0];

        const lastOrderId = localStorage.getItem("lastOrderId");

        // First load
        if (!lastOrderId) {
          localStorage.setItem("lastOrderId", latestOrder.id);
        }
        // New order
        else if (latestOrder.id !== lastOrderId) {
          addNotification({
            type: "shop-orders",
            orderType: latestOrder.type,
            message: `New order received by ${latestOrder.name || "Unknown"}
Order ID - ${latestOrder.id}`,
            orderId: latestOrder.id,
            name: latestOrder.name,
            userId: latestOrder.userId,
            time: latestOrder.created_at?.slice(11, 16) || "",
          });

          localStorage.setItem("lastOrderId", latestOrder.id);
        }
      }

      // =====================
      // COMPLETED ORDERS
      // =====================
      const reportRes = await apiFetch(
        `https://api.pwezayshops.com/report-shops/${shopId}`,
      );
      if (!reportRes) return;
      const reportData = await reportRes.json();

      const reportList = reportData?.data || [];

      const completedList = reportList.filter(
        (item) => item?.order?.orders_done === 1,
      );

      if (completedList.length > 0) {
        const latestCompleted = completedList[0];

        const lastCompletedOrderId = localStorage.getItem(
          "lastCompletedOrderId",
        );

        // First load
        if (!lastCompletedOrderId) {
          localStorage.setItem(
            "lastCompletedOrderId",
            latestCompleted.order.id,
          );
        }
        // New completed order
        else if (latestCompleted.order.id !== lastCompletedOrderId) {
          addNotification({
            type: "shop-report",
            orderId: latestCompleted.order.id,
            message: `Order Completed #${latestCompleted.order.id}
Customer: ${latestCompleted.order.name || "Unknown"}
Delivery: ${latestCompleted?.deliveryman?.name || "N/A"}
Total: ${latestCompleted.order.grand_total?.toLocaleString()} MMK`,
            time: latestCompleted.order.created_at?.slice(11, 16) || "",
          });

          localStorage.setItem(
            "lastCompletedOrderId",
            latestCompleted.order.id,
          );
        }
      }
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  // =============================
  // POLLING
  // =============================
  useEffect(() => {
    if (!shopId) return;

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [shopId]);

  return <NotificationDropdown notifications={notifications} />;
}
