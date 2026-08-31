

// import { Navigate, Outlet } from "react-router-dom";
// import { getAuth } from "../auth";

// export default function PrivateRoute() {
//   const { shopId } = getAuth(); // ✅ destructure

//   return shopId ? <Outlet /> : <Navigate to="/login" replace />;
// }
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const token = localStorage.getItem("shopToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}