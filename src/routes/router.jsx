// import { createBrowserRouter } from "react-router-dom";
// import AdminLayout from "../layout/AdminLayout.jsx"; // IMPORTANT
// import PublicRoute from "./PublicRoute";
// import PrivateRoute from "./PrivateRoute";
// import LoginPage from "../pages/LoginPage";
// import DashboardPage from "../pages/DashboardPage.jsx";
// import OrdersConfirm from "../pages/OrdersConfirmPage.jsx";
// import DeliveryMenPage from "../pages/DeliveryMenPage.jsx";
// import CreateMenuPage from "../pages/CreateMenuPage.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/login",
//     element: (
//       <PublicRoute>
//         <LoginPage />
//       </PublicRoute>
//     ),
//   },
//   {
//     element: <PrivateRoute />, // 🔐 protect
//     children: [
//       {
//         path: "/",
//         element: <AdminLayout />, // ✅ MUST have layout here
//         children: [
//           { index: true, element: <DashboardPage /> },
//           { path: "orders", element: <OrdersConfirm /> },
//           { path: "delivery-men", element: <DeliveryMenPage /> },
//           { path: "create-menu", element: <CreateMenuPage /> },
//         ],
//       },
//     ],
//   },
// ]);

// export default router;

import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout.jsx"; // IMPORTANT
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage"; // ✅ new
import DashboardPage from "../pages/DashboardPage.jsx";
import OrdersConfirm from "../pages/OrdersConfirmPage.jsx";
import DeliveryMenPage from "../pages/DeliveryMenPage.jsx";
import MenuPage from "../pages/MenuPage.jsx";
import ReportPage from "../pages/ReportPage.jsx";
import { Settings } from "lucide-react";
import ShopAccountEdit from "../components/Setting/ShopAccountEdit.jsx";
// import SettingsPage1 from "../pages/SettingsPage.jsx";
import ShopSettings from "../pages/ShopSettings.jsx";
import FinancesPage from "../pages/FinancesPage.jsx";

const router = createBrowserRouter([
  // 👉 Public Pages
  {
    path: "/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup", // ✅ Signup route
    element: (
      <PublicRoute>
        <SignupPage />
      </PublicRoute>
    ),
  },

  // 👉 Protected Pages
  {
    element: <PrivateRoute />, // 🔐 protect
    children: [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: "orders", element: <OrdersConfirm /> },
          { path: "delivery-men", element: <DeliveryMenPage /> },
          { path: "create-menu", element: <MenuPage /> },
          { path: "finance", element: <FinancesPage /> },
          { path: "report", element: <ReportPage /> },
          { path: "settings", element: <ShopSettings /> },
          { path: "shop-edit/:id", element: <ShopAccountEdit /> },
        ],
      },
    ],
  },
]);

export default router;
