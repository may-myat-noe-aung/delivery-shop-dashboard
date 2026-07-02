import React, { useEffect, useState } from "react";

export default function PrintReceipt({ order, shopId }) {
  const [shopName, setShopName] = useState("MY SHOP");

  useEffect(() => {
    if (!shopId) return;

    fetch(`https://api.pwezayshops.com/shops/${shopId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setShopName(data[0].shop_name);
        }
      })
      .catch((err) => console.error(err));
  }, [shopId]);

  if (!order) return null;

  return (
    <div className="print:block hidden w-[300px] p-4 text-black text-xs">
      {/* HEADER */}
      <div className="text-center mb-3">
        <h2 className="font-bold text-lg uppercase">
          {shopName}
        </h2>

        <p>Order: {order.id}</p>
        <p>{new Date(order.created_at).toLocaleString()}</p>
      </div>

      <hr className="my-2" />

      {/* CUSTOMER */}
      <div className="mb-2">
        <p>Name: {order.name}</p>
        <p>Phone: {order.phone}</p>
        <p>Address: {order.address}</p>
      </div>

      <hr className="my-2" />

      {/* ITEMS */}
      {order.orders.map((item, i) => (
        <div key={i} className="mb-2">
          <div className="flex justify-between font-semibold">
            <span>
              {item.menu_name} x {item.quantity}
            </span>

            <span>
              {item.total.toLocaleString()} Ks
            </span>
          </div>

          <div className="text-[10px] text-gray-700">
            Size: {item.size}
          </div>

          {item.ingredients?.length > 0 && (
            <div className="text-[10px] text-gray-700">
              Ingredients:{" "}
              {item.ingredients
                .map((ing) => ing.ingredients_name)
                .join(", ")}
            </div>
          )}
        </div>
      ))}

      <hr className="my-2" />

      {/* SUMMARY */}
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>
            {order.orders
              .reduce((sum, item) => sum + item.total, 0)
              .toLocaleString()}{" "}
            Ks
          </span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{order.delivery_fees.toLocaleString()} Ks</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span>{order.discount.toLocaleString()} Ks</span>
        </div>

        <div className="flex justify-between">
          <span>Tax</span>
          <span>{order.tax.toLocaleString()} Ks</span>
        </div>

        <div className="flex justify-between font-bold text-sm border-t pt-2 mt-2">
          <span>Total</span>
          <span>{order.grand_total.toLocaleString()} Ks</span>
        </div>
      </div>

      <hr className="my-2" />

      {/* PAYMENT */}
      <div className="text-[11px]">
        <p>Payment: {order.payment_method}</p>
        <p>Pay Name: {order.payment_name}</p>
        <p>Pay Phone: {order.payment_phone}</p>
      </div>

      {/* FOOTER */}
      <div className="text-center mt-4 text-[11px]">
        Thank you for your order ❤️
      </div>
    </div>
  );
}