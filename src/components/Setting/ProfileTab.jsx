import React from "react";
import { Camera } from "lucide-react";

export default function ProfileTab() {
  return (
    <div className="max-w-xl space-y-6">

      {/* PHOTO */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20">
          <img
            src="http://38.60.244.137:3000/shop-uploads/S003.png"
            className="w-20 h-20 rounded-full object-cover"
          />

          <label className="absolute bottom-0 right-0 bg-blue-600 p-1 rounded-full cursor-pointer">
            <Camera size={14} />
            <input type="file" className="hidden" />
          </label>
        </div>

        <div>
          <h3 className="font-semibold">Shop Profile</h3>
          <p className="text-sm text-gray-400">
            Update your shop information
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="space-y-5">
        <Input label="Shop Name" />
        <Input label="Owner Name" />
        <Input label="Phone" />
        <Input label="Address" />
      </div>

      <button className="bg-blue-600 px-5 py-2 rounded-full">
        Save Changes
      </button>
    </div>
  );
}

function Input({ label }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input className="w-full bg-transparent border-b border-slate-600 py-2 outline-none focus:border-blue-500" />
    </div>
  );
}