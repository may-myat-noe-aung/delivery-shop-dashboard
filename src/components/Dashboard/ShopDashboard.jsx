import LessMenus from "./LessMenus";
import OrderChart from "./OrderChart";
import PaymentMethodChart from "./PaymentMethodChart";
import TodayOrders from "./TodayOrders";
import TopCustomers from "./TopCustomers";
import TopDeliveryMen from "./TopDeliveryMen";
import TopMenus from "./TopMenus";

export default function ShopDashboard({ shopId }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">

      {/* ORDER CHART */}
      <div className="md:col-span-2 xl:col-span-2 2xl:col-span-2">
        <OrderChart shopId={shopId} />
      </div>

      {/* TOP CUSTOMERS */}
      <div className="md:col-span-1 xl:col-span-1 2xl:col-span-1">
        <TopCustomers shopId={shopId} />
      </div>

      {/* PAYMENT CHART */}
      <div className="md:col-span-1 xl:col-span-1 2xl:col-span-1">
        <PaymentMethodChart shopId={shopId} />
      </div>

      {/* TOP MENUS */}
      <div className="md:col-span-1 xl:col-span-1 2xl:col-span-1">
        <TopMenus shopId={shopId} />
      </div>

      {/* LESS MENUS */}
      <div className="md:col-span-1 xl:col-span-1 2xl:col-span-1">
        <LessMenus shopId={shopId} />
      </div>

      {/* DELIVERY MEN */}
      <div className="md:col-span-2 xl:col-span-2 2xl:col-span-3">
        <TopDeliveryMen shopId={shopId} />
      </div>

      {/* TODAY ORDERS */}
      <div className="md:col-span-2 xl:col-span-2 2xl:col-span-3">
        <TodayOrders shopId={shopId} />
      </div>

    </div>
  );
}