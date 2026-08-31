import React, { useEffect, useMemo, useState } from "react";
import {
  CreditCard,
  WalletCards,
  Loader2,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import { apiFetch } from "../../api";

const API_URL = "https://api.pwezayshops.com";

export default function FinanceDetails({ shopId }) {
  const [finance, setFinance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // PAGINATION
  // =========================
  const [platformPage, setPlatformPage] = useState(1);
  const [commissionPage, setCommissionPage] = useState(1);

  const pageSize = 5;
  const pageWindow = 10;

  // =========================
  // FETCH FINANCE
  // =========================
  useEffect(() => {
    if (!shopId) return;

    const fetchFinance = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`${API_URL}/finance/${shopId}`);

        if (!res) {
          throw new Error("Unauthorized or session expired");
        }

        if (!res.ok) {
          throw new Error(
            `Failed to load finance data (${res.status})`
          );
        }

        const data = await res.json();

        if (!data?.success) {
          throw new Error(
            data?.message || "Failed to load finance data"
          );
        }

        setFinance(data);

        // Reset pagination whenever new shop data arrives
        setPlatformPage(1);
        setCommissionPage(1);
      } catch (err) {
        console.error("Finance fetch error:", err);
        setError(
          err.message || "Failed to load finance data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, [shopId]);

  // =========================
  // FORMAT MONEY
  // =========================
  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString();
  };

  // =========================
  // FORMAT DATE
  // =========================
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

  // =========================
  // STATUS BADGE
  // =========================
  const StatusBadge = ({ status }) => {
    const paid = status === "paid";

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
          paid
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
            : "border-amber-500/20 bg-amber-500/10 text-amber-300"
        }`}
      >
        {paid ? (
          <CheckCircle2 size={12} />
        ) : (
          <Clock3 size={12} />
        )}

        {paid ? "Paid" : "Unpaid"}
      </span>
    );
  };

  // =========================
  // DATA
  // =========================
  const shopInfo = finance?.shopsInfo || {};

  const platformRecords =
    finance?.platform_fee_records || [];

  const commissionRecords =
    finance?.commission_records || [];

  // =========================
  // PLATFORM PAGINATION
  // =========================
  const platformTotalPages = Math.ceil(
    platformRecords.length / pageSize
  );

  const platformPaginatedRecords = useMemo(() => {
    const start = (platformPage - 1) * pageSize;
    const end = start + pageSize;

    return platformRecords.slice(start, end);
  }, [platformRecords, platformPage]);

  const platformStartPage =
    Math.floor((platformPage - 1) / pageWindow) *
      pageWindow +
    1;

  const platformEndPage = Math.min(
    platformStartPage + pageWindow - 1,
    platformTotalPages
  );

  // =========================
  // COMMISSION PAGINATION
  // =========================
  const commissionTotalPages = Math.ceil(
    commissionRecords.length / pageSize
  );

  const commissionPaginatedRecords = useMemo(() => {
    const start = (commissionPage - 1) * pageSize;
    const end = start + pageSize;

    return commissionRecords.slice(start, end);
  }, [commissionRecords, commissionPage]);

  const commissionStartPage =
    Math.floor((commissionPage - 1) / pageWindow) *
      pageWindow +
    1;

  const commissionEndPage = Math.min(
    commissionStartPage + pageWindow - 1,
    commissionTotalPages
  );

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-center rounded-2xl border border-neutral-800  py-16">
          <div className="flex items-center gap-3 text-neutral-400">
            <Loader2
              size={20}
              className="animate-spin text-emerald-400"
            />

            <span className="text-md">
              Loading finance data...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <p className="text-sm font-medium text-red-400">
          Failed to load finance data
        </p>

        <p className="mt-1 text-sm text-neutral-500">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          PLATFORM FEE TABLE
      ====================================================== */}
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#1a2030]/80 backdrop-blur-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
              <CreditCard
                size={17}
                className="text-emerald-300"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">
                Platform Fee
              </h3>

              {/* <p className="mt-0.5 text-[11px] text-neutral-500">
                {shopInfo.platform_fees_method || "N/A"} ·{" "}
                {formatMoney(shopInfo.platform_fees)} MMK
              </p> */}
            </div>

          </div>

          <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-sm font-semibold text-emerald-300">
            {platformRecords.length} Records
          </span>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px] ">

            <thead className="border-b border-slate-700 text-slate-400">

              <tr>

                <th className="px-5 py-4 text-left">
                  #
                </th>

                <th className="px-5 py-4 text-left">
                  Type
                </th>

                <th className="px-5 py-4 text-left">
                  Period
                </th>

                <th className="px-5 py-4 text-right">
                  Amount
                </th>

                <th className="px-5 py-4 text-right">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {platformPaginatedRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-slate-400"
                  >
                    No platform fee records.
                  </td>
                </tr>
              ) : (
                platformPaginatedRecords.map(
                  (record, index) => {

                    const globalIndex =
                      (platformPage - 1) * pageSize +
                      index +
                      1;

                    return (
                      <tr
                        key={record.id}
                        className="border-b border-slate-800 hover:bg-slate-800/40 transition duration-200"
                      >

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {globalIndex}
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-slate-300">
                            {record.type || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm text-slate-300">
                              {formatDate(
                                record.period_start
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              to{" "}
                              {formatDate(
                                record.period_end
                              )}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-semibold text-emerald-300">
                            {formatMoney(record.amount)} MMK
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <StatusBadge
                            status={record.status}
                          />
                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Platform Pagination */}
        {platformTotalPages > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-800 px-5 py-4 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">

            <p>
              Page {platformPage} of{" "}
              {platformTotalPages}
            </p>

            <div className="flex flex-wrap gap-2">

              <button
                disabled={platformPage === 1}
                onClick={() =>
                  setPlatformPage(
                    Math.max(1, platformPage - 1)
                  )
                }
                className={`rounded-md border border-neutral-700 px-3 py-1 transition ${
                  platformPage === 1
                    ? "cursor-not-allowed text-neutral-600"
                    : "text-emerald-400 hover:bg-neutral-900"
                }`}
              >
                Prev
              </button>

              {Array.from(
                {
                  length:
                    platformEndPage -
                    platformStartPage +
                    1,
                },
                (_, i) =>
                  platformStartPage + i
              ).map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    setPlatformPage(n)
                  }
                  className={`rounded-md border border-neutral-700 px-3 py-1 transition ${
                    platformPage === n
                      ? "bg-emerald-300 font-semibold text-black"
                      : "text-emerald-300 hover:bg-neutral-900"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                disabled={
                  platformPage ===
                  platformTotalPages
                }
                onClick={() =>
                  setPlatformPage(
                    Math.min(
                      platformTotalPages,
                      platformPage + 1
                    )
                  )
                }
                className={`rounded-md border border-neutral-700 px-3 py-1 transition ${
                  platformPage ===
                  platformTotalPages
                    ? "cursor-not-allowed text-neutral-600"
                    : "text-emerald-400 hover:bg-neutral-900"
                }`}
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>

      {/* =====================================================
          COMMISSION TABLE
      ====================================================== */}
      <div className="overflow-hidden rounded-3xl border border-slate-700 bg-[#1a2030]/80 backdrop-blur-xl shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-500/20 bg-purple-500/10">
              <WalletCards
                size={17}
                className="text-purple-300"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white">
                Commission
              </h3>

              {/* <p className="mt-0.5 text-[11px] text-neutral-500">
                {shopInfo.commission_fees_method ||
                  "N/A"}{" "}
                · {shopInfo.commission_fees || 0}%
              </p> */}
            </div>

          </div>

          <span className="rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-sm font-semibold text-purple-300">
            {commissionRecords.length} Records
          </span>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[800px] ">

            <thead className="border-b border-slate-700 text-slate-400">

              <tr>

                <th className="px-5 py-4 text-left">
                  #
                </th>

                <th className="px-5 py-4 text-left">
                  Type
                </th>

                <th className="px-5 py-4 text-left">
                  Period
                </th>

                <th className="px-5 py-4 text-right">
                  Sale Amount
                </th>

                <th className="px-5 py-4 text-right">
                  Commission
                </th>

                <th className="px-5 py-4 text-right">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {commissionPaginatedRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center text-sm text-slate-400"
                  >
                    No commission records.
                  </td>
                </tr>
              ) : (
                commissionPaginatedRecords.map(
                  (record, index) => {

                    const globalIndex =
                      (commissionPage - 1) * pageSize +
                      index +
                      1;

                    return (
                      <tr
                        key={record.id}
                        className="border-b border-slate-800 hover:bg-slate-800/40 transition duration-200"
                      >

                        <td className="px-5 py-4 text-sm text-slate-500">
                          {globalIndex}
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-slate-300">
                            {record.type || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-sm text-slate-300">
                              {formatDate(
                                record.period_start
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              to{" "}
                              {formatDate(
                                record.period_end
                              )}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <span className="text-sm font-medium text-slate-300">
                            {formatMoney(
                              record.sale_amount
                            )}{" "}
                            MMK
                          </span>
                        </td>

                        <td className="px-5 py-4 text-right">

                          <div>

                            <p className="text-sm font-semibold text-purple-300">
                              {formatMoney(
                                record.commission_fees
                              )}{" "}
                              MMK
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                              {record.commission_percentages ||
                                0}
                              %
                            </p>

                          </div>

                        </td>

                        <td className="px-5 py-4 text-right">
                          <StatusBadge
                            status={record.status}
                          />
                        </td>

                      </tr>
                    );
                  }
                )
              )}

            </tbody>

          </table>

        </div>

        {/* Commission Pagination */}
        {commissionTotalPages > 0 && (
          <div className="flex flex-col gap-2 border-t border-slate-800 px-5 py-4 text-sm text-neutral-400 md:flex-row md:items-center md:justify-between">

            <p>
              Page {commissionPage} of{" "}
              {commissionTotalPages}
            </p>

            <div className="flex flex-wrap gap-2">

              <button
                disabled={commissionPage === 1}
                onClick={() =>
                  setCommissionPage(
                    Math.max(1, commissionPage - 1)
                  )
                }
                className={`rounded-md border border-neutral-700 px-3 py-1 transition ${
                  commissionPage === 1
                    ? "cursor-not-allowed text-neutral-600"
                    : "text-purple-400 hover:bg-neutral-900"
                }`}
              >
                Prev
              </button>

              {Array.from(
                {
                  length:
                    commissionEndPage -
                    commissionStartPage +
                    1,
                },
                (_, i) =>
                  commissionStartPage + i
              ).map((n) => (
                <button
                  key={n}
                  onClick={() =>
                    setCommissionPage(n)
                  }
                  className={`rounded-md border border-neutral-700 px-3 py-1 transition ${
                    commissionPage === n
                      ? "bg-purple-300 font-semibold text-black"
                      : "text-purple-300 hover:bg-neutral-900"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                disabled={
                  commissionPage ===
                  commissionTotalPages
                }
                onClick={() =>
                  setCommissionPage(
                    Math.min(
                      commissionTotalPages,
                      commissionPage + 1
                    )
                  )
                }
                className={`rounded-md border border-neutral-700 px-3 py-1 transition ${
                  commissionPage ===
                  commissionTotalPages
                    ? "cursor-not-allowed text-neutral-600"
                    : "text-purple-400 hover:bg-neutral-900"
                }`}
              >
                Next
              </button>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}