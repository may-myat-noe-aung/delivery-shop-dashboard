// import React, { useEffect, useState } from "react";

// export default function ShopProfileSettings({ shopId }) {
//   const [shop, setShop] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const res = await fetch(
//           `http://38.60.244.137:3000/shops/${shopId}`
//         );
//         const data = await res.json();
//         setShop(data?.[0]);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (shopId) load();
//   }, [shopId]);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-400 py-10">
//         Loading profile...
//       </div>
//     );
//   }

//   if (!shop) {
//     return (
//       <div className="text-center text-red-500 py-10">
//         No shop data found
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">

//       {/* HEADER CARD */}
//       <div className="bg-[#1a2030]/90 border border-slate-700 rounded-3xl p-6 flex items-center gap-6">

//   <img
//   src={`http://38.60.244.137:3000/admin-uploads/${shop.photo}`}
//   alt="shop"
//   className="w-24 h-24 rounded-2xl object-cover border border-slate-600"
// />

//         <div>
//           <h1 className="text-2xl font-bold text-white">
//             {shop.shop_name}
//           </h1>

//           <p className="text-gray-400">
//             Owner: {shop.shopkeeper_name}
//           </p>

//           <p className="text-sm text-gray-500">
//             ID: {shop.id}
//           </p>
//         </div>
//       </div>

//       {/* GRID SECTIONS */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//         {/* ACCOUNT INFO */}
//         <div className="bg-[#1a2030]/80 border border-slate-700 rounded-2xl p-5 space-y-3">
//           <h2 className="text-lg font-semibold text-white">
//             Account Info
//           </h2>

//           <Info label="Email" value={shop.email} />
//           <Info label="Phone" value={shop.phone} />
//           <Info label="Status" value={shop.status} />
//           <Info label="Permission" value={shop.permission} />
//         </div>

//         {/* SHOP INFO */}
//         <div className="bg-[#1a2030]/80 border border-slate-700 rounded-2xl p-5 space-y-3">
//           <h2 className="text-lg font-semibold text-white">
//             Shop Info
//           </h2>

//           <Info label="Address" value={shop.address} />
//           <Info label="Items" value={shop.items} />
//           <Info label="Delivery" value={shop.have_deliverymen ? "Yes" : "No"} />
//           <Info label="Open Shop" value={shop.open_shop ? "Open" : "Closed"} />
//         </div>

//         {/* PAYMENT INFO */}
//         <div className="bg-[#1a2030]/80 border border-slate-700 rounded-2xl p-5 space-y-3 md:col-span-2">
//           <h2 className="text-lg font-semibold text-white">
//             Payment Methods
//           </h2>

//           <div className="flex flex-wrap gap-3 text-sm text-gray-300">
//             {shop.payment_method?.map((m, i) => (
//               <span
//                 key={i}
//                 className="px-3 py-1 bg-neutral-800 rounded-full"
//               >
//                 {m} - {shop.payment_name?.[i]}
//               </span>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* Small reusable component */
// function Info({ label, value }) {
//   return (
//     <div className="flex justify-between border-b border-slate-800 py-2 text-sm">
//       <span className="text-gray-400">{label}</span>
//       <span className="text-white font-medium">{value}</span>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShopProfileSettings({ shopId }) {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `http://38.60.244.137:3000/shops/${shopId}`
        );
        const data = await res.json();
        setShop(data?.[0]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) load();
  }, [shopId]);

  if (loading) {
    return <div className="text-center text-gray-400 py-10">Loading...</div>;
  }

  if (!shop) {
    return <div className="text-center text-red-500 py-10">No data</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-[#1a2030] p-6 rounded-2xl flex justify-between items-center">

        <div className="flex items-center gap-4">
          <img
            src={`http://38.60.244.137:3000/shop-uploads/${shop.photo}`}
            className="w-20 h-20 rounded-xl object-cover"
          />

          <div>
            <h1 className="text-white text-xl font-bold">
              {shop.shop_name}
            </h1>
            <p className="text-gray-400 text-sm">
              {shop.shopkeeper_name}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/shop-edit/${shop.id}`)}
          className="bg-blue-600 px-4 py-2 rounded-lg text-white"
        >
          Edit
        </button>
      </div>

      {/* INFO */}
      <div className="grid md:grid-cols-2 gap-4">

        <Card title="Account">
          <Info label="Email" value={shop.email} />
          <Info label="Phone" value={shop.phone} />
        </Card>

        <Card title="Shop">
          <Info label="Address" value={shop.address} />
          <Info label="Items" value={shop.items} />
        </Card>

      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-[#1a2030] p-4 rounded-xl">
      <h2 className="text-white mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between text-sm text-gray-300 py-1">
      <span>{label}</span>
      <span>{value || "-"}</span>
    </div>
  );
}