

// import { createBrowserRouter } from "react-router-dom";

// import AdminLayout from "./layout/AdminLayout";
// import Dashboard from "./components/Dashboard";
// import OrdersConfirm from "./pages/OrdersConfirm";
// import LoginPage from "./pages/LoginPage";

// const router = createBrowserRouter([
//   {
//     path: "/login",       // ✅ Login Page route
//     element: <LoginPage />,
//   },
//   {
//     path: "/",
//     element: <AdminLayout />,
//     children: [
//       { index: true, element: <Dashboard /> },
//       { path: "orders", element: <OrdersConfirm /> },
//     ],
//   },
// ]);

// export default router;

import { createBrowserRouter } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./components/Dashboard";
import OrdersConfirm from "./pages/OrdersConfirm";
import LoginPage from "./pages/LoginPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> }, // login page
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "orders", element: <OrdersConfirm /> },
    ],
  },
]);

export default router;