import React from "react";

export default function PaymentTab() {
  return (
    <div className="max-w-xl space-y-6">

      <h3 className="text-lg font-semibold">Payment Methods</h3>

      <div className="space-y-5">
        <Input label="KBZPay Name" />
        <Input label="WavePay Name" />
        <Input label="Cash Note" />
      </div>

      <button className="bg-blue-600 px-5 py-2 rounded-full">
        Save Payment
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