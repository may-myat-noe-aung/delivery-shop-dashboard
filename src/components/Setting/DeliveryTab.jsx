import React, { useState } from "react";

export default function DeliveryTab() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="max-w-xl space-y-6">

      <h3 className="text-lg font-semibold">Delivery Settings</h3>

      {/* TOGGLE */}
      <div className="flex items-center justify-between">
        <span>Enable Delivery</span>
        <button
          onClick={() => setEnabled(!enabled)}
          className={`w-12 h-6 rounded-full ${
            enabled ? "bg-green-500" : "bg-gray-500"
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full transform transition ${
              enabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <Input label="Delivery Fee" />
      <Input label="Delivery Area" />

      <button className="bg-blue-600 px-5 py-2 rounded-full">
        Save Delivery Settings
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