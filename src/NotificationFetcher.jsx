// import { useEffect, useRef, useState } from "react";
// import NotificationDropdown from "./NotificationDropdown";
// import { getAuth } from "./utils/auth";

// export default function NotificationFetcher() {
//   const { shopId } = getAuth();

//   const [notifications, setNotifications] = useState([]);

//   const audioRef = useRef(null);

//   // =============================
//   // TRACKERS (FIXED)
//   // =============================
//   const lastOrderIdRef = useRef(localStorage.getItem("lastOrderId") || null);

//   const completedOrdersRef = useRef(
//     new Set(JSON.parse(localStorage.getItem("completedOrders") || "[]")),
//   );

//   // =============================
//   // INIT SOUND
//   // =============================
//   useEffect(() => {
//     audioRef.current = new Audio("/notification.mp3");
//     audioRef.current.preload = "auto";
//   }, []);

//   const playSound = () => {
//     try {
//       if (!audioRef.current) return;

//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;

//       const playPromise = audioRef.current.play();

//       if (playPromise !== undefined) {
//         playPromise.catch((err) => {
//           console.log("🔊 Sound blocked:", err);
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // =============================
//   // LOAD STORAGE
//   // =============================
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("notifications")) || [];
//     setNotifications(saved);
//   }, []);

//   const saveNotifications = (data) => {
//     setNotifications(data);
//     localStorage.setItem("notifications", JSON.stringify(data));
//   };

//   const addNotification = (notif) => {
//     const prev = JSON.parse(localStorage.getItem("notifications")) || [];

//     const updated = [notif, ...prev];

//     // ✅ FIX: update React state too
//     saveNotifications(updated);

//     playSound();
//   };

//   // =============================
//   // FETCH DATA
//   // =============================
//   const fetchData = async () => {
//     try {
//       // =====================
//       // NEW ORDERS
//       // =====================
//       const orderRes = await fetch(
//         `https://api.pwezayshops.com/orders-by-shop-noti/${shopId}`,
//       );
//       const orderData = await orderRes.json();

//       const orders = orderData?.data || [];

//       if (orders.length > 0) {
//         const latestOrder = orders[0];

//         if (latestOrder?.id !== lastOrderIdRef.current) {
//           lastOrderIdRef.current = latestOrder.id;
//           localStorage.setItem("lastOrderId", latestOrder.id);

//           //         addNotification({
//           //   type: "shop-orders",
//           //   message: `New order received by ${latestOrder.name || "Unknown"}
//           // Order ID - ${latestOrder.id}`,
//           //   orderId: latestOrder.id,
//           //   name: latestOrder.name,
//           //   userId: latestOrder.userId,
//           //   time: new Date().toLocaleTimeString(),
//           // });

//           addNotification({
//             type: "shop-orders",
//             orderType: latestOrder.type, // Normal | Fast | Timer | Special
//             message: `New order received by ${latestOrder.name || "Unknown"}
// Order ID - ${latestOrder.id}`,
//             orderId: latestOrder.id,
//             name: latestOrder.name,
//             userId: latestOrder.userId,
//             time: new Date().toLocaleTimeString(),
//           });
//         }
//       }

//       // =====================
//       // COMPLETED ORDERS
//       // =====================
//       const reportRes = await fetch(
//         `https://api.pwezayshops.com/report-shops/${shopId}`,
//       );
//       const reportData = await reportRes.json();
//       const reportList = reportData?.data || [];

//       reportList.forEach((item) => {
//         const order = item?.order;

//         if (!order) return;

//         const orderId = order.id;

//         if (
//           order.orders_done === 1 &&
//           !completedOrdersRef.current.has(orderId)
//         ) {
//           completedOrdersRef.current.add(orderId);

//           localStorage.setItem(
//             "completedOrders",
//             JSON.stringify([...completedOrdersRef.current]),
//           );

//           addNotification({
//             type: "shop-report",
//             orderId: order.id,
//             message: `Order Completed #${order.id}
// Customer: ${order.name || "Unknown"}
// Delivery: ${item?.deliveryman?.name || "N/A"}
// Total: ${order.grand_total?.toLocaleString()} MMK`,
//             time: new Date().toLocaleTimeString(),
//           });
//         }
//       });
//     } catch (err) {
//       console.error("Notification error:", err);
//     }
//   };

//   // =============================
//   // POLLING
//   // =============================
//   useEffect(() => {
//     fetchData();

//     const interval = setInterval(fetchData, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return <NotificationDropdown notifications={notifications} />;
// }

// import { useEffect, useRef, useState } from "react";
// import NotificationDropdown from "./NotificationDropdown";
// import { getAuth } from "./utils/auth";

// export default function NotificationFetcher() {
//   const { shopId } = getAuth();

//   const [notifications, setNotifications] = useState([]);
//   const audioRef = useRef(null);

//   // =============================
//   // INIT SOUND
//   // =============================
//   useEffect(() => {
//     audioRef.current = new Audio("/notification.mp3");
//     audioRef.current.preload = "auto";
//   }, []);

//   const playSound = () => {
//     try {
//       if (!audioRef.current) return;

//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;

//       const playPromise = audioRef.current.play();

//       if (playPromise !== undefined) {
//         playPromise.catch((err) => {
//           console.log("Sound blocked:", err);
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // =============================
//   // LOAD SAVED NOTIFICATIONS
//   // =============================
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("notifications")) || [];
//     setNotifications(saved);
//   }, []);

//   const saveNotifications = (data) => {
//     setNotifications(data);
//     localStorage.setItem("notifications", JSON.stringify(data));
//   };

//   const addNotification = (notif) => {
//     const prev = JSON.parse(localStorage.getItem("notifications")) || [];

//     const updated = [notif, ...prev];

//     saveNotifications(updated);
//     playSound();
//   };

//   // =============================
//   // FETCH DATA
//   // =============================
//   const fetchData = async () => {
//     try {
//       // Always read latest counts (avoid stale values)
//       const orderKey = "prevOrderCount";
//       const reportKey = "prevCompletedCount";

//       const prevOrderCount = parseInt(localStorage.getItem(orderKey) || "0");

//       const prevCompletedCount = parseInt(
//         localStorage.getItem(reportKey) || "0",
//       );

//       // =====================
//       // NEW ORDERS
//       // =====================
//       const orderRes = await fetch(
//         `https://api.pwezayshops.com/orders-by-shop-noti/${shopId}`,
//       );

//       const orderData = await orderRes.json();

//       const orders = orderData?.data || [];
//       const currentOrderCount = orders.length;
//       // 👇 ဒီနေရာမှာထည့်ပါ
//       console.log("Orders:", orders);
//       console.log("Previous:", prevOrderCount);
//       console.log("Current:", currentOrderCount);
//       if (currentOrderCount > prevOrderCount && orders.length > 0) {
//        const latestOrder = orders[0];

//         addNotification({
//           type: "shop-orders",
//           orderType: latestOrder.type,
//           message: `New order received by ${latestOrder.name || "Unknown"}
// Order ID - ${latestOrder.id}`,
//           orderId: latestOrder.id,
//           name: latestOrder.name,
//           userId: latestOrder.userId,
//           time: latestOrder.created_at
//             ? latestOrder.created_at.slice(11, 16)
//             : "",
//         });
//       }

//       localStorage.setItem(orderKey, currentOrderCount.toString());

//       // =====================
//       // COMPLETED ORDERS
//       // =====================
//       const reportRes = await fetch(
//         `https://api.pwezayshops.com/report-shops/${shopId}`,
//       );

//       const reportData = await reportRes.json();

//       const reportList = reportData?.data || [];

//       const completedList = reportList.filter(
//         (item) => item?.order?.orders_done === 1,
//       );

//       const currentCompletedCount = completedList.length;

//       if (
//         currentCompletedCount > prevCompletedCount &&
//         completedList.length > 0
//       ) {
//         const latestCompleted = completedList[0];

//         addNotification({
//           type: "shop-report",
//           orderId: latestCompleted.order.id,
//           message: `Order Completed #${latestCompleted.order.id}
// Customer: ${latestCompleted.order.name || "Unknown"}
// Delivery: ${latestCompleted?.deliveryman?.name || "N/A"}
// Total: ${latestCompleted.order.grand_total?.toLocaleString()} MMK`,
//           time: latestCompleted.order.created_at
//             ? latestCompleted.order.created_at.slice(11, 16)
//             : "",
//         });
//       }

//       localStorage.setItem(reportKey, currentCompletedCount.toString());
//     } catch (err) {
//       console.error("Notification error:", err);
//     }
//   };

//   // =============================
//   // POLLING
//   // =============================
//   useEffect(() => {
//     console.log("shopId =", shopId);
//     if (!shopId) return;
//     fetchData();

//     const interval = setInterval(fetchData, 5000);

//     return () => clearInterval(interval);
//   }, [shopId]);

//   return <NotificationDropdown notifications={notifications} />;
// }




// import { useEffect, useRef, useState } from "react";
// import NotificationDropdown from "./NotificationDropdown";
// import { getAuth } from "./utils/auth";

// export default function NotificationFetcher() {
//   const { shopId } = getAuth();

//   const [notifications, setNotifications] = useState([]);
//   const audioRef = useRef(null);

//   // =============================
//   // INIT SOUND
//   // =============================
//   useEffect(() => {
//     audioRef.current = new Audio("/notification.mp3");
//     audioRef.current.preload = "auto";
//   }, []);

//   const playSound = () => {
//     try {
//       if (!audioRef.current) return;

//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;

//       const playPromise = audioRef.current.play();

//       if (playPromise !== undefined) {
//         playPromise.catch((err) => {
//           console.log("Sound blocked:", err);
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // =============================
//   // LOAD SAVED NOTIFICATIONS
//   // =============================
//   useEffect(() => {
//     const saved = JSON.parse(localStorage.getItem("notifications")) || [];
//     setNotifications(saved);
//   }, []);

//   const saveNotifications = (data) => {
//     setNotifications(data);
//     localStorage.setItem("notifications", JSON.stringify(data));
//   };

//   const addNotification = (notif) => {
//     const prev = JSON.parse(localStorage.getItem("notifications")) || [];

//     const updated = [notif, ...prev];

//     saveNotifications(updated);
//     playSound();
//   };

//   // =============================
//   // FETCH DATA
//   // =============================
//   const fetchData = async () => {
//     try {
//       // Always read latest counts (avoid stale values)
//       const orderKey = "prevOrderCount";
//       const reportKey = "prevCompletedCount";

//       const prevOrderCount = parseInt(localStorage.getItem(orderKey) || "0");

//       const prevCompletedCount = parseInt(
//         localStorage.getItem(reportKey) || "0",
//       );

//       // =====================
//       // NEW ORDERS
//       // =====================
//       const orderRes = await fetch(
//         `https://api.pwezayshops.com/orders-by-shop-noti/${shopId}`,
//       );

//       const orderData = await orderRes.json();

//       const orders = orderData?.data || [];
//       const currentOrderCount = orders.length;
//       // 👇 ဒီနေရာမှာထည့်ပါ
//       console.log("Orders:", orders);
//       console.log("Previous:", prevOrderCount);
//       console.log("Current:", currentOrderCount);
//       if (currentOrderCount > prevOrderCount && orders.length > 0) {
//        const latestOrder = orders[0];

//         addNotification({
//           type: "shop-orders",
//           orderType: latestOrder.type,
//           message: `New order received by ${latestOrder.name || "Unknown"}
// Order ID - ${latestOrder.id}`,
//           orderId: latestOrder.id,
//           name: latestOrder.name,
//           userId: latestOrder.userId,
//           time: latestOrder.created_at
//             ? latestOrder.created_at.slice(11, 16)
//             : "",
//         });
//       }

//       localStorage.setItem(orderKey, currentOrderCount.toString());

//       // =====================
//       // COMPLETED ORDERS
//       // =====================
//       const reportRes = await fetch(
//         `https://api.pwezayshops.com/report-shops/${shopId}`,
//       );

//       const reportData = await reportRes.json();

//       const reportList = reportData?.data || [];

//       const completedList = reportList.filter(
//         (item) => item?.order?.orders_done === 1,
//       );

//       const currentCompletedCount = completedList.length;

//       if (
//         currentCompletedCount > prevCompletedCount &&
//         completedList.length > 0
//       ) {
//         const latestCompleted = completedList[0];

//         addNotification({
//           type: "shop-report",
//           orderId: latestCompleted.order.id,
//           message: `Order Completed #${latestCompleted.order.id}
// Customer: ${latestCompleted.order.name || "Unknown"}
// Delivery: ${latestCompleted?.deliveryman?.name || "N/A"}
// Total: ${latestCompleted.order.grand_total?.toLocaleString()} MMK`,
//           time: latestCompleted.order.created_at
//             ? latestCompleted.order.created_at.slice(11, 16)
//             : "",
//         });
//       }

//       localStorage.setItem(reportKey, currentCompletedCount.toString());
//     } catch (err) {
//       console.error("Notification error:", err);
//     }
//   };

//   // =============================
//   // POLLING
//   // =============================
//   useEffect(() => {
//     console.log("shopId =", shopId);
//     if (!shopId) return;
//     fetchData();

//     const interval = setInterval(fetchData, 5000);

//     return () => clearInterval(interval);
//   }, [shopId]);

//   return <NotificationDropdown notifications={notifications} />;
// }
import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropdown";
import { getAuth } from "./utils/auth";

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
      const orderRes = await fetch(
        `https://api.pwezayshops.com/orders-by-shop-noti/${shopId}`,{
          headers: {
            Authorization: `MSHteam ${token}`,
          },
        }
      );

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
      const reportRes = await fetch(
        `https://api.pwezayshops.com/report-shops/${shopId}`,{
          headers: {
            Authorization: `MSHteam ${token}`,
          },
        }
      );

      const reportData = await reportRes.json();

      const reportList = reportData?.data || [];

      const completedList = reportList.filter(
        (item) => item?.order?.orders_done === 1
      );

      if (completedList.length > 0) {
        const latestCompleted = completedList[0];

        const lastCompletedOrderId = localStorage.getItem(
          "lastCompletedOrderId"
        );

        // First load
        if (!lastCompletedOrderId) {
          localStorage.setItem(
            "lastCompletedOrderId",
            latestCompleted.order.id
          );
        }
        // New completed order
        else if (
          latestCompleted.order.id !== lastCompletedOrderId
        ) {
          addNotification({
            type: "shop-report",
            orderId: latestCompleted.order.id,
            message: `Order Completed #${latestCompleted.order.id}
Customer: ${latestCompleted.order.name || "Unknown"}
Delivery: ${latestCompleted?.deliveryman?.name || "N/A"}
Total: ${latestCompleted.order.grand_total?.toLocaleString()} MMK`,
            time:
              latestCompleted.order.created_at?.slice(11, 16) || "",
          });

          localStorage.setItem(
            "lastCompletedOrderId",
            latestCompleted.order.id
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