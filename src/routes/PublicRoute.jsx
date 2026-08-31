
// import { Navigate, Outlet } from "react-router-dom";

// export default function PublicRoute({ children }) {
//   const shopId = localStorage.getItem("shopId");

//   // ✅ already logged in → go dashboard
//   if (shopId) {
//     return <Navigate to="/" replace />;
//   }

//   return children ? children : <Outlet />;
// }
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute({ children }) {
  const token = localStorage.getItem("shopToken");

  // ✅ Already logged in → prevent login/signup page
  if (token) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}