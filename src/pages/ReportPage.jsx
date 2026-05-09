
  import React from "react";
  import { Navigate, useNavigate } from "react-router-dom";
  import { getAuth } from "../utils/auth";
  import ReportTable from "../components/Report/ReportTable";
  import ReportSummaryCards from "../components/Report/ReportSummaryCards";
import ShopDeliveryManCards from "../components/Report/ShopDeliveryManCards";
import RevenueChart from "../components/Report/RevenueChart";
import TopCategoryChart from "../components/Report/TopCategoryChart";
import SystemDeliveryManCards from "../components/Report/SystemDeliveryManCards";

  export default function ReportPage() {
    // const navigate = useNavigate();
    const { shopId } = getAuth();


      if (!shopId) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className=""> 
        <ReportSummaryCards shopId={shopId} />
        <ReportTable shopId={shopId} />
        <ShopDeliveryManCards shopId={shopId} />
        <SystemDeliveryManCards shopId={shopId} />

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <RevenueChart />
        <TopCategoryChart/>
        </div>
      </div>
    );
  }