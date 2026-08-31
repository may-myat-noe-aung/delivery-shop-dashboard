import React, { useEffect, useRef, useState } from "react";

import {
  CreditCard,
  CalendarDays,
  X,
  AlertTriangle,
  WalletCards,
  Clock3,
} from "lucide-react";

export default function FinanceNotificationDropdown({
  financeData,
  hasNotification = false,
}) {
  const [open, setOpen] = useState(false);

  const notiRef = useRef(null);

  // =========================================
  // DATA
  // =========================================

  const shopInfo = financeData?.shopsInfo || {};

  const unpaidPlatform =
    financeData?.unpaidPlatformRecords || [];

  const unpaidCommission =
    financeData?.unpaidCommissionRecords || [];

  // =========================================
  // CLOSE WHEN CLICK OUTSIDE
  // =========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notiRef.current &&
        !notiRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================
  // FORMAT MONEY
  // =========================================

  const formatMoney = (value) => {
    const number = Number(value || 0);

    return number.toLocaleString();
  };

  // =========================================
  // GET LATEST UNPAID PERIOD
  // =========================================

  const allUnpaidRecords = [
    ...unpaidPlatform.map((item) => ({
      ...item,
      financeType: "Platform Fee",
    })),

    ...unpaidCommission.map((item) => ({
      ...item,
      financeType: "Commission",
    })),
  ];

  const latestUnpaidRecord =
    [...allUnpaidRecords].sort(
      (a, b) =>
        new Date(b.period_end) -
        new Date(a.period_end)
    )[0];

  // =========================================
  // PAYMENT COUNTS
  // =========================================

  const totalUnpaid =
    unpaidPlatform.length +
    unpaidCommission.length;

  // =========================================
  // BUTTON
  // =========================================

  return (
    <div
      ref={notiRef}
      className="relative"
    >
      {/* =====================================
          FINANCE BUTTON
      ===================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen((prev) => !prev)
        }
        className="
          group
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-2xl
          border
          border-neutral-800
          bg-neutral-900
          transition-all
          duration-300
          hover:border-emerald-500/30
          hover:bg-neutral-800
        "
        aria-label="Finance notifications"
      >
        {/* Glow */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-2xl
            bg-emerald-500/0
            blur-xl
            transition
            duration-300
            group-hover:bg-emerald-500/10
          "
        />

        <CreditCard
          size={19}
          className="
            relative
            text-emerald-300
            transition-transform
            duration-300
            group-hover:scale-110
          "
        />

        {/* =====================================
            NOTIFICATION BADGE
        ===================================== */}

        {hasNotification && (
          <span
            className="
              absolute
              -right-1
              -top-1
              flex
              h-[18px]
              min-w-[18px]
              items-center
              justify-center
              rounded-full
              border
              border-neutral-950
              bg-red-500
              px-1
              text-[10px]
              font-bold
              text-white
              shadow-lg
              shadow-red-500/30
              animate-pulse
            "
          >
            !
          </span>
        )}
      </button>

      {/* =====================================
          DROPDOWN
      ===================================== */}

      {open && (
        <div
          className="
            absolute
            right-0
            z-50
            mt-3
            w-[420px]
            overflow-hidden
            rounded-2xl
            border
            border-neutral-800
            bg-[#0f172a]/95
            shadow-2xl
            shadow-black/50
            backdrop-blur-xl
          "
        >
          {/* ===================================
              HEADER
          =================================== */}

          <div
            className="
              relative
              flex
              items-center
              justify-between
              border-b
              border-neutral-800
              px-5
              py-4
            "
          >
            {/* Header glow */}

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-20
                bg-gradient-to-b
                from-emerald-500/10
                to-transparent
              "
            />

            <div className="relative flex items-center gap-3">
              {/* Icon */}

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-500/20
                  bg-emerald-500/10
                "
              >
                <WalletCards
                  size={19}
                  className="text-emerald-300"
                />
              </div>

              {/* Title */}

              <div>
                <h3 className="text-sm font-semibold text-neutral-200">
                  Finance
                </h3>

                <p className="mt-0.5 text-[11px] text-neutral-500">
                  Payment reminder
                </p>
              </div>
            </div>

            {/* Close */}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                rounded-lg
                p-1.5
                text-neutral-600
                transition
                hover:bg-white/5
                hover:text-neutral-300
              "
            >
              <X size={16} />
            </button>
          </div>

          {/* ===================================
              CONTENT
          =================================== */}

          <div className="max-h-[420px] overflow-y-auto custom-scrollbar p-4">

            {/* =================================
                NO PAYMENT
            ================================= */}

            {!hasNotification && (
              <div className="flex flex-col items-center justify-center px-5 py-12 text-center">

                <div
                  className="
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-emerald-500/20
                    bg-emerald-500/5
                  "
                >
                  <CreditCard
                    size={24}
                    className="text-emerald-400/60"
                  />
                </div>

                <p className="text-sm font-medium text-neutral-300">
                  No payment due
                </p>

                <p className="mt-1 max-w-[260px] text-xs leading-5 text-neutral-600">
                  သင့်ဆိုင်အတွက် ပေးချေရန်
                  ကျန်ရှိသော Finance Payment မရှိပါ။
                </p>
              </div>
            )}

            {/* =================================
                PAYMENT REQUIRED
            ================================= */}

            {hasNotification && (
              <div className="space-y-3">

                {/* =================================
                    MAIN ALERT
                ================================= */}

                <div
                  className="
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    border-amber-500/20
                    bg-gradient-to-br
                    from-amber-500/[0.08]
                    via-amber-500/[0.03]
                    to-transparent
                    p-4
                  "
                >
                  {/* Glow */}

                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-8
                      -top-8
                      h-24
                      w-24
                      rounded-full
                      bg-amber-400/10
                      blur-2xl
                    "
                  />

                  <div className="relative">

                    {/* Alert Header */}

                    <div className="flex items-start gap-3">

                      <div
                        className="
                          flex
                          h-10
                          w-10
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          border-amber-400/20
                          bg-amber-500/10
                        "
                      >
                        <AlertTriangle
                          size={19}
                          className="text-amber-300"
                        />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-semibold text-amber-200">
                          Payment Required
                        </p>

                        <p className="mt-1 text-xs leading-5 text-neutral-500">
                          သင့်ဆိုင်အတွက် ငွေပေးချေရန်
                          ကျန်ရှိနေပါသည်။
                        </p>

                      </div>
                    </div>

                    {/* Shop */}

                    {/* <div
                      className="
                        mt-4
                        rounded-xl
                        border
                        border-white/5
                        bg-black/20
                        px-3
                        py-3
                      "
                    >
                      <p className="text-xs font-medium text-neutral-300">
                        {shopInfo?.shop_name ||
                          "Your Shop"}
                      </p>

                      <p className="mt-1 text-[10px] text-neutral-600">
                        Shop ID:{" "}
                        <span className="text-neutral-500">
                          {shopInfo?.id || "-"}
                        </span>
                      </p>
                    </div> */}
                  </div>
                </div>

                {/* =================================
                    SUMMARY
                ================================= */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-red-500/10
                    bg-red-500/[0.03]
                    px-4
                    py-3
                  "
                >
                  <div className="flex items-center gap-2">

                    <Clock3
                      size={15}
                      className="text-red-400"
                    />

                    <span className="text-xs text-neutral-500">
                      Outstanding payments
                    </span>

                  </div>

                  <span
                    className="
                      rounded-full
                      border
                      border-red-500/20
                      bg-red-500/10
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      text-red-300
                    "
                  >
                    {totalUnpaid}
                  </span>
                </div>

                {/* =================================
                    PLATFORM FEE
                ================================= */}

                {unpaidPlatform.length > 0 && (
                  <div
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-neutral-800
                      bg-white/[0.025]
                      p-4
                      transition
                      hover:border-emerald-500/20
                      hover:bg-white/[0.04]
                    "
                  >
                    {/* Hover gradient */}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-emerald-500/[0.05]
                        to-transparent
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    />

                    <div className="relative">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-emerald-500/20
                              bg-emerald-500/10
                            "
                          >
                            <CreditCard
                              size={17}
                              className="text-emerald-300"
                            />
                          </div>

                          <div>

                            <p className="text-xs font-semibold text-neutral-300">
                              Platform Fee
                            </p>

                            <p className="mt-1 text-xs text-neutral-600">
                              {platformMethod(
                                shopInfo?.platform_fees_method
                              )}
                            </p>

                          </div>
                        </div>

                        <div className="text-right">

                          <p className="text-sm font-semibold text-emerald-300">
                            {formatMoney(
                              shopInfo?.platform_fees
                            )}{" "}
                            MMK
                          </p>

                          <p className="mt-1 text-xs text-neutral-600">
                            {unpaidPlatform.length} unpaid
                          </p>

                        </div>
                      </div>

                      {/* Period */}

                      {/* <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          border-t
                          border-white/5
                          pt-3
                        "
                      >
                        <span className="text-[10px] text-neutral-600">
                          Latest period
                        </span>

                        <span className="text-[10px] text-neutral-400">
                          {formatDate(
                            unpaidPlatform[0]?.period_start
                          )}{" "}
                          —{" "}
                          {formatDate(
                            unpaidPlatform[0]?.period_end
                          )}
                        </span>
                      </div> */}

                    </div>
                  </div>
                )}

                {/* =================================
                    COMMISSION
                ================================= */}

                {unpaidCommission.length > 0 && (
                  <div
                    className="
                      group
                      relative
                      overflow-hidden
                      rounded-xl
                      border
                      border-neutral-800
                      bg-white/[0.025]
                      p-4
                      transition
                      hover:border-purple-500/20
                      hover:bg-white/[0.04]
                    "
                  >
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-r
                        from-purple-500/[0.05]
                        to-transparent
                        opacity-0
                        transition
                        group-hover:opacity-100
                      "
                    />

                    <div className="relative">

                      <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-purple-500/20
                              bg-purple-500/10
                            "
                          >
                            <WalletCards
                              size={17}
                              className="text-purple-300"
                            />
                          </div>

                          <div>

                            <p className="text-xs font-semibold text-neutral-300">
                              Commission
                            </p>

                            <p className="mt-1 text-xs text-neutral-600">
                              {shopInfo?.commission_fees_method ||
                                "N/A"}
                            </p>

                          </div>
                        </div>

                        <div className="text-right">

                          <p className="text-sm font-semibold text-purple-300">
                            {shopInfo?.commission_fees ||
                              "0"}%
                          </p>

                          <p className="mt-1 text-xs text-neutral-600">
                            {unpaidCommission.length} unpaid
                          </p>

                        </div>
                      </div>

                      {/* Period */}

                      {/* <div
                        className="
                          mt-3
                          flex
                          items-center
                          justify-between
                          border-t
                          border-white/5
                          pt-3
                        "
                      >
                        <span className="text-[10px] text-neutral-600">
                          Latest period
                        </span>

                        <span className="text-[10px] text-neutral-400">
                          {formatDate(
                            unpaidCommission[0]?.period_start
                          )}{" "}
                          —{" "}
                          {formatDate(
                            unpaidCommission[0]?.period_end
                          )}
                        </span>
                      </div> */}

                    </div>
                  </div>
                )}

                {/* =================================
                    DUE DATE
                ================================= */}

                {/* {latestUnpaidRecord && (
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-neutral-800
                      bg-black/20
                      px-4
                      py-3
                    "
                  >
                    <div
                      className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-lg
                        bg-neutral-800/50
                      "
                    >
                      <CalendarDays
                        size={15}
                        className="text-neutral-400"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] text-neutral-600">
                        Outstanding period ends
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-neutral-300">
                        {formatDate(
                          latestUnpaidRecord.period_end
                        )}
                      </p>
                    </div>
                  </div>
                )} */}
              </div>
            )}
          </div>


        </div>
      )}
    </div>
  );
}

// =========================================
// SAFE METHOD DISPLAY
// =========================================

function platformMethod(method) {
  if (!method) return "N/A";

  return method;
}