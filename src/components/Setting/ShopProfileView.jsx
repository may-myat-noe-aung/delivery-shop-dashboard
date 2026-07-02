// import React, { useEffect, useState } from "react";
// import {
//   Store,
//   Phone,
//   MapPin,
//   User,
//   Mail,
//   BadgeCheck,
//   CalendarDays,
//   Package,
//   Wallet,
// } from "lucide-react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// export default function ShopProfileView({ shopId }) {
//   const [shop, setShop] = useState(null);

//   useEffect(() => {
//     const fetchShop = async () => {
//       try {
//         const res = await fetch(`https://api.pwezayshops.com/shops/${shopId}`);

//         const data = await res.json();

//         setShop(data?.[0]);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     if (!shopId) return;

//     // first fetch
//     fetchShop();

//     // fetch every 3000ms
//     const interval = setInterval(() => {
//       fetchShop();
//     }, 500);

//     // cleanup
//     return () => clearInterval(interval);
//   }, [shopId]);

//   if (!shop) {
//     return (
//       <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
//         Loading profile...
//       </div>
//     );
//   }

//   return (
//     <div className="">
//       {/* RIGHT SIDE */}
//       <div className="xl:col-span-2 ">
//         {/* Your existing stats section */}
//         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <StatCard title="Menu Items" value={shop.items || 0} />
//             <StatCard
//               title="Delivery"
//               value={shop.have_deliverymen === 1 ? "Enabled" : "Disabled"}
//             />
//             <StatCard
//               title="Payment Method"
//               value={shop.payments?.[0]?.method || "N/A"}
//             />
//           </div> */}

//         {/* ================= INFO ================= */}
//         <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">
//           {/* HEADER */}
//           <div className="mb-4">
//             <h2 className="text-xl font-semibold text-white">
//               Shop Information
//             </h2>
//             {/*
//               <p className="text-slate-400 text-sm mt-1">
//                 Public shop information and contact details
//               </p> */}
//           </div>

//           {/* GRID */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//             {/* <InfoCard
//                 icon={<User size={18} />}
//                 label="Owner Name"
//                 value={shop.shopkeeper_name}
//               />

//               <InfoCard
//                 icon={<Store size={18} />}
//                 label="Shop Name"
//                 value={shop.shop_name}
//               /> */}

//             <InfoCard
//               icon={<Mail size={18} />}
//               label="Email Address"
//               value={shop.email}
//             />
//             {/* ================= MAP ================= */}
//             <div className="col-span-1 row-span-3 bg-[#111827] border border-slate-800 rounded-3xl p-4">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
//                   <MapPin size={18} />
//                 </div>

//                 <div>
//                   <h2 className="text-sm text-slate-400">Shop Location</h2>
//                 </div>
//               </div>

//               <div className="overflow-hidden rounded-2xl border border-slate-800">
//                 <MapContainer
//                   center={[16.796359, 96.196135]}
//                   zoom={16}
//                   scrollWheelZoom={false}
//                   className="h-[300px] w-full z-0"
//                 >
//                   <TileLayer
//                     attribution="&copy; OpenStreetMap contributors"
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />

//                   <Marker position={[16.796359, 96.196135]}>
//                     <Popup>{shop.shop_name}</Popup>
//                   </Marker>
//                 </MapContainer>
//               </div>
//             </div>

//             <InfoCard
//               icon={<Phone size={18} />}
//               label="Phone Number"
//               value={shop.phone}
//             />

//             <InfoCard
//               icon={<MapPin size={18} />}
//               label="Address"
//               value={shop.address}
//             />
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ================= INFO CARD ================= */
// function InfoCard({ icon, label, value }) {
//   return (
//     <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4 hover:border-indigo-500/30 transition">
//       <div className="flex items-center gap-3 mb-3">
//         <div className="w-11 h-11 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
//           {icon}
//         </div>

//         <p className="text-sm text-slate-400">{label}</p>
//       </div>

//       <h3 className="text-white font-medium break-all">{value || "-"}</h3>
//     </div>
//   );
// }

// /* ================= STATS ================= */
// function StatCard({ title, value }) {
//   return (
//     <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5">
//       <p className="text-slate-400 text-sm">{title}</p>

//       <h2 className="text-2xl font-bold text-white mt-2">{value}</h2>
//     </div>
//   );
// }

// /* ================= BADGE ================= */
// function Badge({ label, color }) {
//   return (
//     <div className={`px-4 py-2 rounded-full border text-sm ${color}`}>
//       {label}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Store,
  Phone,
  MapPin,
  User,
  Mail,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function ShopProfileView({ shopId }) {
  const [shop, setShop] = useState(null);

  // ✅ empty only (your requirement)
  const [location, setLocation] = useState({});

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(
          `https://api.pwezayshops.com/shops/${shopId}`
        );

        const data = await res.json();
        const shopData = data?.[0];

        setShop(shopData);

        // ================= LOCATION API =================
        const locRes = await fetch(
          `https://api.pwezayshops.com/get-location-shops/${shopId}`
        );

        const locData = await locRes.json();

        const locationString = locData?.location || "";

        const latMatch = locationString.match(/Lag\s*([-\d.]+)/i);
        const lngMatch = locationString.match(/Log\s*([-\d.]+)/i);

        const lat = latMatch ? parseFloat(latMatch[1]) : null;
        const lng = lngMatch ? parseFloat(lngMatch[1]) : null;

        setLocation({ lat, lng });

      } catch (err) {
        console.error(err);
      }
    };

    if (!shopId) return;

    fetchShop();

    const interval = setInterval(fetchShop, 1000);
    return () => clearInterval(interval);
  }, [shopId]);

  if (!shop) {
    return (
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        Loading profile...
      </div>
    );
  }

  const isLocationValid =
    location.lat !== null &&
    location.lng !== null &&
    !isNaN(location.lat) &&
    !isNaN(location.lng);

  return (
    <div>
      <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6">

        {/* HEADER */}
        <h2 className="text-xl font-semibold text-white mb-4">
          Shop Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InfoCard
            icon={<Mail size={18} />}
            label="Email Address"
            value={shop.email}
          />

          {/* ================= MAP ================= */}
          <div className="col-span-1 row-span-3 bg-[#111827] border border-slate-800 rounded-3xl p-4">

            <div className="flex items-center gap-3 mb-3">
              <MapPin size={18} className="text-indigo-400" />
              <h2 className="text-sm text-slate-400">Shop Location</h2>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800">

              {!isLocationValid ? (
                // ❌ UI when undefined
                <div className="h-[300px] flex items-center justify-center text-slate-400 bg-[#0f172a]">
                  Location not available
                </div>
              ) : (
                // ✅ MAP when valid
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={16}
                  scrollWheelZoom={false}
                  className="h-[300px] w-full z-0"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <Marker position={[location.lat, location.lng]}>
                    <Popup>{shop?.shop_name}</Popup>
                  </Marker>
                </MapContainer>
              )}

            </div>
          </div>

          <InfoCard
            icon={<Phone size={18} />}
            label="Phone Number"
            value={shop.phone}
          />

          <InfoCard
            icon={<MapPin size={18} />}
            label="Address"
            value={shop.address}
          />

        </div>
      </div>
    </div>
  );
}

/* ================= INFO CARD ================= */
function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-4">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <p className="text-sm text-slate-400">{label}</p>
      </div>

      <h3 className="text-white break-all">
        {value || "-"}
      </h3>
    </div>
  );
}