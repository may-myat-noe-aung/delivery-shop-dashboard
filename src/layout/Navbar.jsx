// import { useNavigate } from "react-router-dom";
// import { MdLogout } from "react-icons/md";

// export default function Navbar() {
//   const navigate = useNavigate();

//   return (
//     <nav className="h-16 bg-[#1e293b] border-b border-slate-800 px-8 flex items-center justify-between">

//       <h1 className="text-lg font-semibold text-indigo-400">
//         Dashboard
//       </h1>

//       <button
//         onClick={() => navigate("/signin")}
//         className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
//       >
//         <MdLogout size={18} />
//         Logout
//       </button>

//     </nav>
//   );
// }
// import { useNavigate } from "react-router-dom";
// import { MdLogout } from "react-icons/md";

// export default function Navbar() {
//   const navigate = useNavigate();

//   // Step 2a: Logout function
//   const handleLogout = () => {
//     // Optional: token / auth info clear
//     localStorage.removeItem("token");  // သင် token save လုပ်ထားရင်
//     navigate("/login");                // ✅ correct route
//   };

//   return (
//     <nav className="h-16 bg-[#1e293b] border-b border-slate-800 px-8 flex items-center justify-between">
//       <h1 className="text-lg font-semibold text-indigo-400">Dashboard</h1>

//       <button
//         onClick={handleLogout} // Step 2b: use handleLogout
//         className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
//       >
//         <MdLogout size={18} />
//         Logout
//       </button>
//     </nav>
//   );
// }

import { useNavigate } from "react-router-dom";
import { MdLogout } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // token မသုံးဘူးဆို clear လုပ်စရာမလို
    navigate("/login"); // ✅ redirect to login page
  };

  return (
    <nav className="h-16 bg-[#1e293b] border-b border-slate-800 px-8 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-indigo-400">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
      >
        <MdLogout size={18} />
        Logout
      </button>
    </nav>
  );
}