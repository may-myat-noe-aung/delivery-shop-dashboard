import React from "react";
import { MdRestaurantMenu } from "react-icons/md";

export default function Footer() {
  return (
    <footer >


      {/* Bottom Line */}
      <div className="border-t border-slate-700 mt-6 text-center py-[23px] text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </div>
    </footer>
  );
}