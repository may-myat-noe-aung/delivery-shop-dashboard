
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAlert } from "../../AlertProvider";

export default function OrderPopup({ order, close, shopId }) {
  const { showAlert, confirm } = useAlert();
  const [loading, setLoading] = useState(false);
  const [localOrder, setLocalOrder] = useState(order);
  const [openItems, setOpenItems] = useState({}); // 🔥 accordion state
  const [previewImage, setPreviewImage] = useState(null);

  const total =
    localOrder?.orders?.reduce((sum, item) => sum + item.total, 0) || 0;

  // =========================
  // Toggle Accordion
  // =========================
  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // =========================
  // Bulk Approve
  // =========================
  const handleAllStatusChange = async (action) => {
    const confirmed = await confirm(`Confirm all items?`);
    if (!confirmed) return;

    setLoading(true);

    try {
      const endpoint = `http://38.60.244.137:3000/all-approved-orders/${localOrder.id}`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopId }),
      });

      const data = await res.json();

      if (res.ok) {
        showAlert(data.message, "success");

        setLocalOrder((prev) => ({
          ...prev,
          status: 1,
          orders: prev.orders.map((item) => ({
            ...item,
            status: 1,
          })),
        }));
      } else {
        showAlert(data.message || "Error", "error");
      }
    } catch {
      showAlert("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 w-full max-w-2xl text-white shadow-2xl max-h-[90vh] overflow-y-auto relative">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-5 text-slate-400 hover:text-white text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <h3 className="text-xl font-semibold text-indigo-400 mb-4">
          Order #{localOrder.id}
        </h3>

        {/* Customer Info */}
        <div className="flex flex-col  space-y-3 px-4">
          <div className="flex flex-row  justify-between items-center">
            <div>
              <p>
                <span className="text-slate-400 mb-3">Customer:</span>{" "}
                {localOrder.name}
              </p>
              <p>
                <span className="text-slate-400">Phone:</span>{" "}
                {localOrder.phone}
              </p>
            </div>
            <div>
              <p>
                <span className="text-slate-400 mb-3">Remark:</span>{" "}
                {localOrder.remark || "-"}
              </p>
              <p>
                <span className="text-slate-400">Address:</span>{" "}
                {localOrder.address}
              </p>
            </div>
          </div>
          <p>
            <span className="text-slate-400">Location:</span>{" "}
            {localOrder.location}
          </p>
        </div>

        {/* =========================
            ITEMS (Accordion)
        ========================= */}
        <div className="bg-slate-800 rounded-2xl px-4 pt-4 mb-5 space-y-3">
          {localOrder.orders.map((item, i) => {
            const isOpen = openItems[i];

            return (
              <div key={i} className="border border-slate-700 rounded-xl">
                {/* HEADER */}
                <div
                  onClick={() => toggleItem(i)}
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-700 transition rounded-xl"
                >
                  <div>
                    <div className="font-medium">{item.menu_name}</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-md text-slate-400">
                      {item.total.toLocaleString()} Ks
                    </div>
                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                {isOpen && (
                  <div className="px-4 pb-3 text-sm text-slate-300 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-md ">Size: {item.size}</p>
                      <p className="text-md ">Qty: {item.quantity}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p>
                        Ingredients Name:{" "}
                        {item.ingredients.length > 0
                          ? item.ingredients.map((ing) => (
                              <span
                                key={ing.ingredients_id}
                                className="inline-block bg-slate-700 px-2 py-0.5 rounded mr-1 mt-1"
                              >
                                {ing.ingredients_name}
                              </span>
                            ))
                          : "None"}
                      </p>
                      <p>
                        Ingredients Price:{" "}
                        {item.ingredients.length > 0
                          ? item.ingredients.map((ing) => (
                              <span
                                key={ing.ingredients_id}
                                className="inline-block bg-slate-700 px-2 py-0.5 rounded mr-1 mt-1"
                              >
                                {ing.ingredients_price}
                              </span>
                            ))
                          : "None"}
                      </p>
                    </div>

                    <p className="text-md text-slate-400">
                      {item.product_description}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =========================
            SUMMARY
        ========================= */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-5 text-sm space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{total.toLocaleString()} Ks</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>- {localOrder.discount} Ks</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>{localOrder.tax} Ks</span>
          </div>
           <div className="flex justify-between">
            <span>Delivery Fees</span>
            <span>{localOrder.delivery_fees} Ks</span>
          </div>
          <div className="flex justify-between">
            <span>Extra</span>
            <span>{localOrder.extra} Ks</span>
          </div>

          <div className="border-t border-slate-700 pt-2 flex justify-between text-lg font-bold text-cyan-400">
            <span>Grand Total</span>
            <span>{localOrder.grand_total.toLocaleString()} Ks</span>
          </div>
        </div>

        {/* =========================
            PAYMENT
        ========================= */}
        <div className="mb-5 flex items-top justify-between">
          <div>
            <h4 className="text-indigo-400 text-lg font-semibold mb-2">
              Payment
            </h4>

            <p className="text-md">Method: {localOrder.payment_method}</p>
            <p className="text-md">Name: {localOrder.payment_name}</p>
            <p className="text-md">Phone: {localOrder.payment_phone}</p>

            {/* =========================
            META
        ========================= */}
            <div className="text-md text-slate-400 space-y-1 my-5">
              <p className="text-md">
                Created: {new Date(localOrder.created_at).toLocaleString()}
              </p>
              <p className="text-md">
                Pickup: {localOrder.orders_pickup ? "Done" : "Not Done"}
              </p>
              <p> Esign : {localOrder.esign ? "Done" : "Not Done"}</p>
              {/* <p className="text-md">Done: {localOrder.orders_done ? "Done" : "Not Done"}</p> */}
            </div>
          </div>

          <div>
            {localOrder.payment_photo && (
              <img
                src={`http://38.60.244.137:3000/${localOrder.payment_photo}`}
                onClick={() =>
                  setPreviewImage(
                    `http://38.60.244.137:3000/${localOrder.payment_photo}`,
                  )
                }
                className="mt-2 w-40 rounded-lg border border-slate-600 cursor-pointer hover:scale-105 transition"
              />
            )}
          </div>
        </div>

        {/* ACTION */}
        {localOrder.orders.some((item) => item.status === 0) && (
          <div className="flex justify-end">
            <button
              disabled={loading}
              onClick={() => handleAllStatusChange("approve")}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl"
            >
              Confirm All
            </button>
          </div>
        )}
        {/* Preview Image */}
        {previewImage && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-3xl w-full px-4">
              {/* Close Button */}
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 text-white text-2xl"
              >
                ✕
              </button>

              {/* Image */}
              <img
                src={previewImage}
                className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
