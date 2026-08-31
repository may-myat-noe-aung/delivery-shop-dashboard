import React from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import FinanceDetails from "../components/Finance/FinanceDetails";

export default function FinancesPage() {
  const { shopId } = getAuth();

  if (!shopId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-4">
      <FinanceDetails shopId={shopId} />
    </div>
  );
}