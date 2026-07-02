import React from "react";

export default function PrintInvoice({ order }) {
  if (!order) return null;

  const total =
    order.orders?.reduce((sum, item) => sum + item.total, 0) || 0;

  return (
    <div className="print:block hidden p-10 text-black">
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">INVOICE</h1>
        <p>Order ID: {order.id}</p>
        <p>Date: {new Date(order.created_at).toLocaleString()}</p>
      </div>

      <hr className="my-4" />

      {/* CUSTOMER */}
      <div className="mb-4">
        <p><b>Customer:</b> {order.name}</p>
        <p><b>Phone:</b> {order.phone}</p>
        <p><b>Address:</b> {order.address}</p>
      </div>

      <hr className="my-4" />

      {/* TABLE HEADER */}
      <div className="grid grid-cols-4 font-bold border-b pb-2">
        <span>Item</span>
        <span>Qty</span>
        <span>Price</span>
        <span>Total</span>
      </div>

      {/* ITEMS */}
      {order.orders.map((item, i) => (
        <div key={i} className="grid grid-cols-4 py-2 border-b text-sm">
          <span>{item.menu_name}</span>
          <span>{item.quantity}</span>
          <span>{item.amount}</span>
          <span>{item.total}</span>
        </div>
      ))}

      {/* TOTAL */}
      <div className="text-right mt-6 text-lg font-bold">
        Grand Total: {order.grand_total.toLocaleString()} Ks
      </div>

      {/* FOOTER */}
      <div className="text-center mt-10 text-sm">
        Thank you for your order ❤️
      </div>
    </div>
  );
}