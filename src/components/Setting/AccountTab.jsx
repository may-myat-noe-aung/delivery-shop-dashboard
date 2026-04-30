import React from "react";

export default function AccountTab() {
  return (
    <div className="max-w-xl space-y-6">

      <h3 className="text-lg font-semibold">Account Settings</h3>

      <div className="space-y-5">
        <Input label="Email" />
        <Input label="New Password" />
        <Input label="Confirm Password" />
      </div>

      <button className="bg-blue-600 px-5 py-2 rounded-full">
        Update Account
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