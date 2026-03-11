import { NavLink } from "react-router-dom";
import { MdDashboard, MdRestaurantMenu } from "react-icons/md";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0f172a] border-r border-slate-800 p-6">

      <h2 className="text-2xl font-bold mb-10 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
        Shop Admin
      </h2>

      <div className="space-y-2">

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-sm transition
            ${isActive
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <MdDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl text-sm transition
            ${isActive
              ? "bg-slate-800 text-white"
              : "text-slate-400 hover:bg-slate-800 hover:text-white"
            }`
          }
        >
          <MdRestaurantMenu size={20} />
          Food Orders Confirm
        </NavLink>

      </div>
    </aside>
  );
}