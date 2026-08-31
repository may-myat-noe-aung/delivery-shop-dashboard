import { useEffect, useRef, useState } from "react";

import FinanceNotificationDropdown from "./FinanceNotificationDropdown";

import { getAuth } from "./utils/auth";

import { apiFetch } from "./api";

export default function FinanceNotificationFetcher() {
  const { shopId } = getAuth();

  const [financeData, setFinanceData] = useState(null);

  const [hasNotification, setHasNotification] =
    useState(false);

  const audioRef = useRef(null);

  // =============================
  // INIT SOUND
  // =============================

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");

    audioRef.current.preload = "auto";
  }, []);

  // =============================
  // PLAY SOUND
  // =============================

  const playSound = () => {
    try {
      if (!audioRef.current) return;

      audioRef.current.pause();

      audioRef.current.currentTime = 0;

      const playPromise =
        audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.log(
            "Finance notification sound blocked:",
            err
          );
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // =============================
  // FETCH FINANCE DATA
  // =============================

  const fetchFinanceData = async () => {
    if (!shopId) return;

    try {
      const res = await apiFetch(
        `https://api.pwezayshops.com/finance-noti-by-shop/${shopId}`
      );

      if (!res) return;

      const data = await res.json();

      if (!data?.success) {
        setFinanceData(null);
        setHasNotification(false);
        return;
      }

      // =================================
      // CHECK UNPAID PLATFORM FEE
      // =================================

      const platformRecords =
        data?.platform_fee_records || [];

      const unpaidPlatformRecords =
        platformRecords.filter(
          (record) =>
            record?.status === "unpaid"
        );

      // =================================
      // CHECK UNPAID COMMISSION
      // =================================

      const commissionRecords =
        data?.commission_records || [];

      const unpaidCommissionRecords =
        commissionRecords.filter(
          (record) =>
            record?.status === "unpaid"
        );

      // =================================
      // CHECK WHETHER PAYMENT IS REQUIRED
      // =================================

      const paymentRequired =
        unpaidPlatformRecords.length > 0 ||
        unpaidCommissionRecords.length > 0;

      // =================================
      // SAVE CURRENT DATA
      // =================================

      setFinanceData({
        ...data,

        unpaidPlatformRecords,
        unpaidCommissionRecords,
      });

      // =================================
      // NOTIFICATION STATE
      // =================================

      setHasNotification(paymentRequired);

    } catch (err) {
      console.error(
        "Finance notification error:",
        err
      );
    }
  };

  // =============================
  // POLLING
  // =============================

  useEffect(() => {
    if (!shopId) return;

    fetchFinanceData();

    const interval = setInterval(
      fetchFinanceData,
      8000
    );

    return () => {
      clearInterval(interval);
    };
  }, [shopId]);

  // =============================
  // RENDER
  // =============================

  return (
    <FinanceNotificationDropdown
      financeData={financeData}
      hasNotification={hasNotification}
    />
  );
}