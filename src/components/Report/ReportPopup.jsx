
import { ChevronUp, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ReportPopup({ data, close }) {
  const [previewImage, setPreviewImage] = useState(null);

  const order = data?.order;
  const deliveryman = data?.deliveryman;

  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1e293b] border border-slate-700 rounded-3xl p-6 w-full max-w-3xl text-white shadow-2xl max-h-[90vh] overflow-y-auto relative custom-scrollbar">
        {/* Close */}
        <button
          onClick={close}
          className="absolute top-4 right-5 w-9 h-9 flex items-center justify-center
          bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white
          rounded-full transition"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-indigo-400 mb-6">
          Report #{order.id}
        </h2>

        {/* Customer + Delivery */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-800 rounded-2xl p-4">
            <h3 className="text-cyan-400 font-semibold mb-3">Customer Info</h3>

            <p>Name : {order.name}</p>
            <p>Phone : {order.phone}</p>
            <p>Address : {order.address}</p>
            <p>Type : {order.type}</p>
            <p>Kilo : {order.kilo}</p>
            <p>Remark : {order.remark || "-"} </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-4">
            <h3 className="text-yellow-400 font-semibold mb-3">Delivery Man</h3>

            <p>ID : {deliveryman?.id || "-"}</p>
            <p>Name : {deliveryman?.name || "-"}</p>
            <p>Phone : {deliveryman?.phone || "-"}</p>
            <p>Status : {deliveryman?.status || "-"}</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <h3 className="text-indigo-400 font-semibold mb-4">Ordered Items</h3>

          <div className="space-y-3">
            {order.orders.map((item, index) => {
              const isOpen = openItems[index];

              return (
                <div key={index} className="border border-slate-700 rounded-xl">
                  {/* Header */}
                  <div
                    onClick={() => toggleItem(index)}
                    className="flex justify-between items-center p-3 cursor-pointer hover:bg-slate-700 transition rounded-xl"
                  >
                    <div>
                      <h4 className="font-semibold text-cyan-400">
                        {item.menu_name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <span>{item.total.toLocaleString()} Ks</span>

                      {isOpen ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </div>
                  </div>

                  {/* Content */}

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
                        Product Description : {item.product_description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-slate-800 rounded-2xl p-4 mb-6">
          <h3 className="text-indigo-400 font-semibold mb-4">
            Payment Summary
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{order.discount} Ks</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>{order.tax} Ks</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fees</span>
              <span>{order.delivery_fees} Ks</span>
            </div>

            <div className="flex justify-between">
              <span>Extra</span>
              <span>{order.extra} Ks</span>
            </div>

            <div className="border-t border-slate-700 pt-3 flex justify-between font-bold text-cyan-400 text-lg">
              <span>Grand Total</span>
              <span>{order.grand_total.toLocaleString()} Ks</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="flex flex-col md:flex-row justify-between gap-5">
          <div>
            <h3 className="text-indigo-400 font-semibold mb-3">
              Payment Information
            </h3>

            <p>Method : {order.payment_method}</p>
            <p>Name : {order.payment_name}</p>
            <p>Phone : {order.payment_phone}</p>

            <div className="mt-4 text-slate-400 text-sm">
              <p>Created : {new Date(order.created_at).toLocaleString()}</p>

              <p>Pickup : {order.orders_pickup ? "Done" : "Pending"}</p>

              <p>Done : {order.orders_done ? "Done" : "Pending"}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5">
            {/* Payment Photo */}
            {order.payment_photo && (
              <div>
                <p className="mb-2 text-sm text-slate-400">
                  Payment Screenshot
                </p>

                <img
                  src={`https://api.pwezayshops.com/${order.payment_photo}`}
                  onClick={() =>
                    setPreviewImage(
                      `https://api.pwezayshops.com/${order.payment_photo}`,
                    )
                  }
                  className="w-40 rounded-xl border border-slate-700 cursor-pointer hover:scale-105 transition"
                />
              </div>
            )}

            {/* E-Sign */}
            {order.esign && (
              <div>
                <p className="mb-2 text-sm text-slate-400">
                  Customer Signature
                </p>

                <img
                  src={`https://api.pwezayshops.com${order.esign}`}
                  onClick={() =>
                    setPreviewImage(`https://api.pwezayshops.com${order.esign}`)
                  }
                  className="w-40 rounded-xl border border-slate-700 cursor-pointer hover:scale-105 transition bg-white"
                />
              </div>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {/* {previewImage && (
          <div
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]"
          >
            <img
              src={previewImage}
              className="max-w-4xl max-h-[90vh] rounded-xl"
            />
          </div>
        )} */}

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
                className="absolute top-0 -right-8 w-10 h-10 flex items-center justify-center
  bg-black/30 backdrop-blur-md border border-red-400/80
  hover:bg-red-500 hover:text-white text-red-400
  rounded-full transition"
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
