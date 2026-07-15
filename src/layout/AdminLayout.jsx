import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 overflow-y-auto py-6 px-8 custom-scrollbar ">
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
}
