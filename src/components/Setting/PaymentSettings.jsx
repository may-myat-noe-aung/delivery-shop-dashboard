// import React, { useEffect, useState } from "react";
// import { Plus, Trash2, Save, Loader2, CreditCard } from "lucide-react";

// import { useAlert } from "../../AlertProvider";

// export default function PaymentSettings({ shopId }) {
//   const { showAlert, confirm } = useAlert();

//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [showModal, setShowModal] = useState(false);

//   const [newPayment, setNewPayment] = useState({
//     name: "",
//     phone: "",
//     method: "",
//   });

//   // ================= FETCH =================
//   useEffect(() => {
//     const fetchPayments = async () => {
//       try {
//         setLoading(true);

//         const res = await fetch(`https://api.pwezayshops.com/shops/${shopId}`);

//         const data = await res.json();

//         const paymentData = data?.[0]?.payments;

//         setPayments(Array.isArray(paymentData) ? paymentData : []);
//       } catch (err) {
//         console.error(err);

//         showAlert("Failed to load payments", "error");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (shopId) {
//       fetchPayments();
//     }
//   }, [shopId]);

//   // ================= CHANGE =================
//   const handleChange = (index, field, value) => {
//     const updated = [...payments];

//     updated[index][field] = value;

//     setPayments(updated);
//   };

//   // ================= ADD =================
//   const handleAdd = () => {
//     setNewPayment({
//       name: "",
//       phone: "",
//       method: "",
//     });

//     setShowModal(true);
//   };

//   // ================= DELETE =================
//   const handleDelete = async (index) => {
//     const confirmed = await confirm(
//       "Are you sure you want to delete this payment?",
//     );

//     if (!confirmed) return;

//     const updated = payments.filter((_, i) => i !== index);

//     setPayments(updated);

//     showAlert("Payment removed", "success");
//   };
// const handleAddPayment = async () => {
//   if (
//     !newPayment.name.trim() ||
//     !newPayment.phone.trim() ||
//     !newPayment.method.trim()
//   ) {
//     showAlert("Please fill all fields", "error");
//     return;
//   }

//   try {
//     const updatedPayments = [
//       ...payments,
//       {
//         name: newPayment.name,
//         phone: newPayment.phone,
//         method: newPayment.method,
//       },
//     ];

//     const res = await fetch(
//       `https://api.pwezayshops.com/update-payments-shops/${shopId}`,
//       {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           payments: updatedPayments,
//         }),
//       }
//     );

//     const data = await res.json();

//     if (res.ok) {
//       setPayments(updatedPayments);

//       setShowModal(false);

//       setNewPayment({
//         name: "",
//         phone: "",
//         method: "",
//       });

//       showAlert(
//         data?.message || "Payment added successfully",
//         "success"
//       );
//     } else {
//       showAlert(
//         data?.message || "Failed to add payment",
//         "error"
//       );
//     }
//   } catch (err) {
//     console.error(err);
//     showAlert("Something went wrong", "error");
//   }
// };

//   // ================= SAVE =================
//   const handleSave = async () => {
//     console.log(
//   "FINAL PAYLOAD",
//   JSON.stringify(
//     {
//       payments,
//     },
//     null,
//     2
//   )
// );
//     const confirmed = await confirm(
//       "Are you sure you want to save payment settings?",
//     );

//     if (!confirmed) return;

//     try {
//       setSaving(true);

//       const payload = {
//         payments: payments.map((p) => ({
//           method: p.method || "",
//           phone: p.phone || "",
//           name: p.name || "",
//         })),
//       };

//       console.log("SHOP ID:", shopId);
//       console.log("PAYLOAD:", payload);

//       const res = await fetch(
//         `https://api.pwezayshops.com/update-payments-shops/${shopId}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         },
//       );

//       const data = await res.json();

//       console.log("RESPONSE:", data);

//       if (res.ok) {
//         showAlert(data?.message || "Payments updated successfully", "success");
//       } else {
//         showAlert(data?.message || "Failed to update payments", "error");
//       }
//     } catch (err) {
//       console.error(err);
//       showAlert("Something went wrong", "error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ================= LOADING =================
//   if (loading) {
//     return (
//       <>
//         <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 animate-pulse">
//           <div className="h-8 w-52 bg-slate-800 rounded mb-6"></div>

//           <div className="space-y-5">
//             {[...Array(2)].map((_, index) => (
//               <div
//                 key={index}
//                 className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5"
//               >
//                 <div className="h-12 bg-slate-800 rounded-xl mb-4"></div>

//                 <div className="h-12 bg-slate-800 rounded-xl mb-4"></div>

//                 <div className="h-12 bg-slate-800 rounded-xl"></div>
//               </div>
//             ))}
//           </div>
//         </div>
//         {showModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//             <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-white">Add Payment</h3>

//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-slate-400 hover:text-white"
//                 >
//                   ✕
//                 </button>
//               </div>

//               <div className="space-y-4">
//                 <InputCard
//                   label="Account Name"
//                   value={newPayment.name}
//                   onChange={(e) =>
//                     setNewPayment({
//                       ...newPayment,
//                       name: e.target.value,
//                     })
//                   }
//                   placeholder="Kyaw Kyaw"
//                 />

//                 <InputCard
//                   label="Phone Number"
//                   value={newPayment.phone}
//                   onChange={(e) =>
//                     setNewPayment({
//                       ...newPayment,
//                       phone: e.target.value,
//                     })
//                   }
//                   placeholder="09xxxxxxxxx"
//                 />

//                 <InputCard
//                   label="Payment Method"
//                   value={newPayment.method}
//                   onChange={(e) =>
//                     setNewPayment({
//                       ...newPayment,
//                       method: e.target.value,
//                     })
//                   }
//                   placeholder="KBZ Pay"
//                 />
//               </div>

//               <div className="flex justify-end gap-3 mt-6">
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="h-11 px-5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   onClick={handleAddPayment}
//                   className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
//                 >
//                   Add Payment
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-6">
//         {/* ================= HEADER ================= */}
//         <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 md:p-6 relative overflow-hidden">
//           {/* GLOW */}
//           <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

//           <div className="relative flex items-center justify-between gap-4 flex-col md:flex-row mb-6">
//             <div>
//               <h2 className="text-xl font-bold text-white">Payment Settings</h2>

//             </div>

//             <button
//               onClick={handleAdd}
//               className="
//               h-11 px-5 rounded-2xl
//               bg-indigo-600 hover:bg-indigo-500
//               text-white font-medium
//               flex items-center gap-2
//               transition-all duration-200
//               shadow-lg shadow-indigo-500/20
//             "
//             >
//               <Plus size={18} />
//               Add Payment
//             </button>
//           </div>

//           {/* ================= EMPTY ================= */}
//           {payments.length === 0 && (
//             <div className="bg-[#111827] border border-dashed border-slate-700 rounded-3xl p-10 text-center">
//               <div className="flex justify-center mb-4">
//                 <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
//                   <CreditCard size={28} />
//                 </div>
//               </div>

//               <h3 className="text-lg font-semibold text-white">
//                 No Payment Methods
//               </h3>

//               <p className="text-slate-400 text-sm mt-2">
//                 Add your first payment method
//               </p>
//             </div>
//           )}

//           {/* ================= LIST ================= */}
//           <div className="space-y-5 h-[350px] overflow-y-auto custom-scrollbar">
//             {Array.isArray(payments) &&
//               payments.map((payment, index) => (
//                 <div
//                   key={index}
//                   className="
//               bg-[#111827]
//               border border-slate-800
//               rounded-3xl
//               p-4 md:py-4 md:px-6
//               relative overflow-hidden
//             "
//                 >
//                   {/* CARD GLOW */}
//                   <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full" />

//                   {/* TOP */}
//                   <div className="relative flex items-center justify-between ">
//                     <div>
//                       <h3 className="text-lg font-semibold text-white">
//                         Payment #{index + 1}
//                       </h3>

//                       {/* <p className="text-sm text-slate-400 mt-1">
//                   Configure payment information
//                 </p> */}
//                     </div>

//                     <button
//                       onClick={() => handleDelete(index)}
//                       className="
//                   size-9 rounded-xl
//                   bg-red-500/10 hover:bg-red-500/20
//                   border border-red-500/20
//                   text-red-400
//                   flex items-center justify-center
//                   transition-all duration-200
//                 "
//                     >
//                       <Trash2 size={16} />
//                     </button>
//                   </div>

//                   {/* INPUTS */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                     <InputCard
//                       label="Account Name"
//                       value={payment.name}
//                       onChange={(e) =>
//                         handleChange(index, "name", e.target.value)
//                       }
//                       placeholder="Kyaw Kyaw"
//                     />

//                     <InputCard
//                       label="Phone Number"
//                       value={payment.phone}
//                       onChange={(e) =>
//                         handleChange(index, "phone", e.target.value)
//                       }
//                       placeholder="09xxxxxxxxx"
//                     />

//                     <InputCard
//                       label="Payment Method"
//                       value={payment.method}
//                       onChange={(e) =>
//                         handleChange(index, "method", e.target.value)
//                       }
//                       placeholder="KBZ Pay"
//                     />
//                   </div>
//                 </div>
//               ))}
//           </div>

//           {/* ================= SAVE BUTTON ================= */}
//           {payments.length > 0 && (
//             <div className="flex justify-end mt-2">
//               <button
//                 onClick={handleSave}
//                 disabled={saving}
//                 className="
//               h-11 px-6 rounded-2xl
//               bg-indigo-600 hover:bg-indigo-500
//               text-white font-semibold
//               transition-all duration-200
//               flex items-center gap-2
//               disabled:opacity-50
//               disabled:cursor-not-allowed
//               shadow-lg shadow-indigo-500/20
//               min-w-[190px]
//             "
//               >
//                 {saving ? (
//                   <>
//                     <Loader2 size={18} className="animate-spin" />
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <Save size={18} />
//                     Update Payment
//                   </>
//                 )}
//               </button>
//             </div>
//           )}
//         </div>
//    </div>

// {showModal && (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//     <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-3xl p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h3 className="text-xl font-bold text-white">
//           Add Payment
//         </h3>

//         <button
//           onClick={() => setShowModal(false)}
//           className="text-slate-400 hover:text-white"
//         >
//           ✕
//         </button>
//       </div>

//       <div className="space-y-4">
//         <InputCard
//           label="Account Name"
//           value={newPayment.name}
//           onChange={(e) =>
//             setNewPayment({
//               ...newPayment,
//               name: e.target.value,
//             })
//           }
//           placeholder="Kyaw Kyaw"
//         />

//         <InputCard
//           label="Phone Number"
//           value={newPayment.phone}
//           onChange={(e) =>
//             setNewPayment({
//               ...newPayment,
//               phone: e.target.value,
//             })
//           }
//           placeholder="09xxxxxxxxx"
//         />

//         <InputCard
//           label="Payment Method"
//           value={newPayment.method}
//           onChange={(e) =>
//             setNewPayment({
//               ...newPayment,
//               method: e.target.value,
//             })
//           }
//           placeholder="KBZ Pay"
//         />
//       </div>

//       <div className="flex justify-end gap-3 mt-6">
//         <button
//           onClick={() => setShowModal(false)}
//           className="h-11 px-5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800"
//         >
//           Cancel
//         </button>

//         <button
//           onClick={handleAddPayment}
//           className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
//         >
//           Add Payment
//         </button>
//       </div>
//     </div>
//   </div>
// )}

// </>
// );
// }

// /* ================= INPUT ================= */
// function InputCard({ label, value, onChange, placeholder }) {
//   return (
//     <div>
//       <p className="text-sm text-slate-400 mb-3">{label}</p>

//       <input
//         type="text"
//         value={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="
//           w-full h-12 bg-slate-900/70 border border-slate-700
//           rounded-xl px-4
//           text-white placeholder:text-slate-500
//           outline-none
//           focus:border-indigo-500
//           transition-all
//         "
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Save, Loader2, CreditCard } from "lucide-react";
import { useAlert } from "../../AlertProvider";

export default function PaymentSettings({ shopId }) {
  const { showAlert, confirm } = useAlert();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newPayment, setNewPayment] = useState({
    name: "",
    phone: "",
    method: "",
  });

  // ✅ dropdown state (ONLY ADD)
  const [openDropdown, setOpenDropdown] = useState(null);


    const paymentMethods = [
    "KBZPay",
    "WAVEPay",
    "AYAPay",
    "CBPay",
    "AGBPay",
    "UABPay",
    "YOMAPay",
    "MCBPay",
  ];

  // ================= FETCH =================
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);

        const res = await fetch(`https://api.pwezayshops.com/shops/${shopId}`);
        const data = await res.json();

        const paymentData = data?.[0]?.payments;

        setPayments(Array.isArray(paymentData) ? paymentData : []);
      } catch (err) {
        console.error(err);
        showAlert("Failed to load payments", "error");
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchPayments();
  }, [shopId]);

  // ================= CHANGE =================
  const handleChange = (index, field, value) => {
    const updated = [...payments];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    setPayments(updated);
  };

  // ================= ADD =================
  const handleAdd = () => {
    setNewPayment({
      name: "",
      phone: "",
      method: "",
    });

    setShowModal(true);
  };

  // ================= DELETE =================
  const handleDelete = async (index) => {
    const confirmed = await confirm(
      "Are you sure you want to delete this payment?",
    );

    if (!confirmed) return;

    const updated = payments.filter((_, i) => i !== index);
    setPayments(updated);

    showAlert("Payment removed", "success");
  };

  // ================= ADD PAYMENT =================
  const handleAddPayment = async () => {
    if (
      !newPayment.name.trim() ||
      !newPayment.phone.trim() ||
      !newPayment.method.trim()
    ) {
      showAlert("Please fill all fields", "error");
      return;
    }

    try {
      const updatedPayments = [
        ...payments,
        {
          name: newPayment.name,
          phone: newPayment.phone,
          method: newPayment.method,
        },
      ];

      const res = await fetch(
        `https://api.pwezayshops.com/update-payments-shops/${shopId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payments: updatedPayments }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setPayments(updatedPayments);
        setShowModal(false);
        setNewPayment({ name: "", phone: "", method: "" });

        showAlert(data?.message || "Payment added", "success");
      } else {
        showAlert(data?.message || "Failed", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "error");
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    const confirmed = await confirm("Save payment settings?");
    if (!confirmed) return;

    try {
      setSaving(true);

      const payload = {
        payments: payments.map((p) => ({
          name: p.name || "",
          phone: p.phone || "",
          method: p.method || "",
        })),
      };

      const res = await fetch(
        `https://api.pwezayshops.com/update-payments-shops/${shopId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (res.ok) {
        showAlert(data?.message || "Updated successfully", "success");
      } else {
        showAlert(data?.message || "Failed", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-4 animate-pulse">
        <div className="h-8 w-52 bg-slate-800 rounded mb-6" />
        <div className="space-y-5">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5"
            >
              <div className="h-12 bg-slate-800 rounded-xl mb-4" />
              <div className="h-12 bg-slate-800 rounded-xl mb-4" />
              <div className="h-12 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <>
      <div className="space-y-6">
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Payment Settings</h2>

            <button
              onClick={handleAdd}
              className="h-11 px-5 bg-indigo-600 text-white rounded-2xl flex items-center gap-2"
            >
              <Plus size={18} />
              Add Payment
            </button>
          </div>

          {/* LIST */}
          <div className="space-y-5 h-[350px] overflow-y-auto custom-scrollbar">
            {payments.map((payment, index) => (
              <div
                key={index}
                className="bg-[#111827] border border-slate-800 rounded-3xl p-5"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-white font-semibold">
                    Payment #{index + 1}
                  </h3>

                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-400"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputCard
                    label="Account Name"
                    value={payment.name}
                    onChange={(e) =>
                      handleChange(index, "name", e.target.value)
                    }
                  />

                  <InputCard
                    label="Phone"
                    value={payment.phone}
                    onChange={(e) =>
                      handleChange(index, "phone", e.target.value)
                    }
                  />

                  {/* ================= CUSTOM DROPDOWN ================= */}
                  <div className="relative">
                    <p className="text-sm text-slate-400 mb-3">
                      Payment Method
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(openDropdown === index ? null : index);
                      }}
                      className="
                        w-full h-11 bg-slate-900 border border-slate-700
                        rounded-xl px-3 text-white text-left
                        flex justify-between items-center
                      "
                    >
                      {payment.method || "Select Method"}
                      <span className="text-slate-400">▼</span>
                    </button>

                    {openDropdown === index && (
                      <div
                        className="
      absolute z-50 mt-2 w-full
      bg-[#111827] border border-slate-700
      rounded-xl overflow-hidden
      max-h-48 overflow-y-auto custom-scrollbar
      shadow-lg 
    "
                        onClick={(e) => e.stopPropagation()}
                      >
                        {paymentMethods.map((m) => (
                          <div
                            key={m}
                            onClick={() => {
                              handleChange(index, "method", m);
                              setOpenDropdown(null);
                            }}
                            className="
          px-4 py-2 text-white
          hover:bg-indigo-600 cursor-pointer
          transition
        "
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SAVE */}
          {payments.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-11 px-6 bg-indigo-600 text-white rounded-2xl flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL (UNCHANGED except dropdown applied too) */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setOpenDropdown(null)}
        >
          <div className="bg-[#111827] p-6 rounded-3xl w-full max-w-md">
            <h3 className="text-white text-xl mb-4">Add Payment</h3>

            <div className="space-y-4">
              <InputCard
                label="Account Name"
                value={newPayment.name}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, name: e.target.value })
                }
              />

              <InputCard
                label="Phone"
                value={newPayment.phone}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, phone: e.target.value })
                }
              />

              {/* CUSTOM DROPDOWN (MODAL) */}
              <div className="relative">
                <p className="text-sm text-slate-400 mb-3">Payment Method</p>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === "modal" ? null : "modal");
                  }}
                  className="
                    w-full h-11 bg-slate-900 border border-slate-700
                    rounded-xl px-3 text-white text-left
                    flex justify-between items-center
                  "
                >
                  {newPayment.method || "Select Method"}
                  <span className="text-slate-400">▼</span>
                </button>

                {openDropdown === "modal" && (
                  <div
                    className="
                   absolute z-50 mt-2 w-full
      bg-[#111827] border border-slate-700
      rounded-xl overflow-hidden
      max-h-40 2xl:max-h-48 overflow-y-auto custom-scrollbar
      shadow-lg 
                  "
                  >
                    {paymentMethods.map((m) => (
                      <div
                        key={m}
                        onClick={() => {
                          setNewPayment({
                            ...newPayment,
                            method: m,
                          });
                          setOpenDropdown(null);
                        }}
                        className="
                          px-4 py-2 text-white
                          hover:bg-indigo-600 cursor-pointer
                        "
                      >
                        {m}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white border rounded-xl border-indigo-600"
              >
                Cancel
              </button>

              <button
                onClick={handleAddPayment}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl"
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ================= INPUT ================= */
function InputCard({ label, value, onChange }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-2">{label}</p>
      <input
        value={value}
        onChange={onChange}
        className="w-full h-11 bg-slate-900 border border-slate-700 rounded-xl px-3 text-white"
      />
    </div>
  );
}
