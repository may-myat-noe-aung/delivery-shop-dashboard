import React from "react";
import { MdRestaurantMenu } from "react-icons/md";

export default function Footer() {
  return (
    <footer >


      {/* Bottom Line */}
      <div className="border-t border-slate-700 text-center py-[23px] text-slate-500 text-sm sticky bottom-0">
        &copy; {new Date().getFullYear()} MyShop. All rights reserved.
      </div>
    </footer>
  );
}