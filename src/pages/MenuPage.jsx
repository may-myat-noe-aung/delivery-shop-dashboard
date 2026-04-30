

import React, { useState } from "react";
import { Navigate } from "react-router-dom"; // ✅ ADD THIS
import MenuCreateModal from "../components/MenuCreate/MenuCreateModal";
import IngredientsCreateModal from "../components/MenuCreate/IngredientsCreateModal";
import CategoryCreateModal from "../components/MenuCreate/CategoryCreateModal";
import { Utensils, Box, Layers } from "lucide-react";
import MenuTable from "../components/MenuCreate/MenuTable";
import IngredientsTable from "../components/MenuCreate/IngredientsTable";
import CategoryTable from "../components/MenuCreate/CategoryTable";
import { getAuth } from "../utils/auth";

function SummaryButtonCard({ title, icon, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-600 p-4 relative overflow-hidden hover:scale-105 transition-transform"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
      <div className="relative flex items-center justify-between text-white text-lg font-semibold">
        <span>{title}</span>
        {icon}
      </div>
    </div>
  );
}

export default function MenuPage() {
  const { shopId } = getAuth();

  const [openMenu, setOpenMenu] = useState(false);
  const [openIngredient, setOpenIngredient] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  // ✅ ONLY CHANGE: redirect instead of showing message
  if (!shopId) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="space-y-8">
      {/* ===== Add Buttons ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryButtonCard
          title="+ Add New Menu"
          icon={<Utensils className="w-6 h-6" />}
          color="from-indigo-400/50 to-transparent"
          onClick={() => setOpenMenu(true)}
        />

        <SummaryButtonCard
          title="+ Add New Ingredients"
          icon={<Box className="w-6 h-6" />}
          color="from-emerald-400/50 to-transparent"
          onClick={() => setOpenIngredient(true)}
        />

        <SummaryButtonCard
          title="+ Add New Category"
          icon={<Layers className="w-6 h-6" />}
          color="from-sky-400/50 to-transparent"
          onClick={() => setOpenCategory(true)}
        />
      </div>

      {/* ===== Modals ===== */}
      {openMenu && (
        <MenuCreateModal
          shopId={shopId}
          close={() => setOpenMenu(false)}
          onSuccess={() => setOpenMenu(false)}
        />
      )}

      {openIngredient && (
        <IngredientsCreateModal
          shopId={shopId}
          close={() => setOpenIngredient(false)}
          onSuccess={() => setOpenIngredient(false)}
        />
      )}

      {openCategory && (
        <CategoryCreateModal
          shopId={shopId}
          close={() => setOpenCategory(false)}
          onSuccess={() => setOpenCategory(false)}
        />
      )}

      {/* ===== Tables ===== */}
      <div className="space-y-12">
        <MenuTable shopId={shopId} />
        <IngredientsTable shopId={shopId} />
        <CategoryTable shopId={shopId} />
      </div>
    </div>
  );
}

// import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
// import MenuCreateModal from "../components/MenuCreate/MenuCreateModal";
// import IngredientsCreateModal from "../components/MenuCreate/IngredientsCreateModal";
// import CategoryCreateModal from "../components/MenuCreate/CategoryCreateModal";
// import { Utensils, Box, Layers } from "lucide-react";
// import MenuTable from "../components/MenuCreate/MenuTable";
// import IngredientsTable from "../components/MenuCreate/IngredientsTable";
// import CategoryTable from "../components/MenuCreate/CategoryTable";

// // ✅ cookie helper
// const getCookie = (name) => {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(";").shift();
//   return null;
// };

// function SummaryButtonCard({ title, icon, color, onClick }) {
//   return (
//     <div
//       onClick={onClick}
//       className="cursor-pointer rounded-2xl border border-neutral-800 bg-neutral-600 p-4 relative overflow-hidden hover:scale-105 transition-transform"
//     >
//       <div className={`absolute inset-0 bg-gradient-to-br ${color}`} />
//       <div className="relative flex items-center justify-between text-white text-lg font-semibold">
//         <span>{title}</span>
//         {icon}
//       </div>
//     </div>
//   );
// }

// export default function MenuPage() {
//   const shopId = getCookie("shopId"); // ✅ direct cookie

//   const [openMenu, setOpenMenu] = useState(false);
//   const [openIngredient, setOpenIngredient] = useState(false);
//   const [openCategory, setOpenCategory] = useState(false);

//   // 🔐 auth check
//   if (!shopId) {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="space-y-8">
//       {/* ===== Add Buttons ===== */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//         <SummaryButtonCard
//           title="+ Add New Menu"
//           icon={<Utensils className="w-6 h-6" />}
//           color="from-indigo-400/50 to-transparent"
//           onClick={() => setOpenMenu(true)}
//         />

//         <SummaryButtonCard
//           title="+ Add New Ingredients"
//           icon={<Box className="w-6 h-6" />}
//           color="from-emerald-400/50 to-transparent"
//           onClick={() => setOpenIngredient(true)}
//         />

//         <SummaryButtonCard
//           title="+ Add New Category"
//           icon={<Layers className="w-6 h-6" />}
//           color="from-sky-400/50 to-transparent"
//           onClick={() => setOpenCategory(true)}
//         />
//       </div>

//       {/* ===== Modals ===== */}
//       {openMenu && (
//         <MenuCreateModal
//           shopId={shopId}
//           close={() => setOpenMenu(false)}
//           onSuccess={() => setOpenMenu(false)}
//         />
//       )}

//       {openIngredient && (
//         <IngredientsCreateModal
//           shopId={shopId}
//           close={() => setOpenIngredient(false)}
//           onSuccess={() => setOpenIngredient(false)}
//         />
//       )}

//       {openCategory && (
//         <CategoryCreateModal
//           shopId={shopId}
//           close={() => setOpenCategory(false)}
//           onSuccess={() => setOpenCategory(false)}
//         />
//       )}

//       {/* ===== Tables ===== */}
//       <div className="space-y-12">
//         <MenuTable shopId={shopId} />
//         <IngredientsTable shopId={shopId} />
//         <CategoryTable shopId={shopId} />
//       </div>
//     </div>
//   );
// }