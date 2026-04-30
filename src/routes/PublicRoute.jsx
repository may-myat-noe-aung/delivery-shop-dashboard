// import { Navigate } from "react-router-dom";
// import { getAuth } from "../auth";
// // import { getAuth } from "./auth";

// export default function PublicRoute({ children }) {
//   const shopId = getAuth();

//   return shopId ? <Navigate to="/" replace /> : children;
// }

import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ children }) {
  const shopId = localStorage.getItem("shopId");

  // ✅ already logged in → go dashboard
  if (shopId) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}