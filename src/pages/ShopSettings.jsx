import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { MdPerson, MdEdit, MdSecurity, MdPayments } from "react-icons/md";
import { AlertTriangle, BadgeCheck, Check, CheckCircle } from "lucide-react";

import { getAuth } from "../utils/auth";

import AccountSettings from "../components/Setting/AccountSettings";
import PaymentSettings from "../components/Setting/PaymentSettings";
import ShopProfileView from "../components/Setting/ShopProfileView";
import ShopProfileEdit from "../components/Setting/ShopProfileEdit";

export default function ShopSettings() {
  const [tab, setTab] = useState("profile");

  const { shopId } = getAuth();

  const [shop, setShop] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const res = await fetch(`https://api.pwezayshops.com/shops/${shopId}`);

        const data = await res.json();

        setShop(data?.[0]);
      } catch (err) {
        console.error(err);
      }
    };

    if (!shopId) return;

    fetchShop();

    const interval = setInterval(() => {
      fetchShop();
    }, 3000);

    return () => clearInterval(interval);
  }, [shopId]);

  if (!shopId) {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    {
      key: "profile",
      label: "Profile",
      icon: <MdPerson size={18} />,
      desc: "View shop information",
    },
    {
      key: "edit",
      label: "Edit Profile",
      icon: <MdEdit size={18} />,
      desc: "Update shop details",
    },
    {
      key: "account",
      label: "Account",
      icon: <MdSecurity size={18} />,
      desc: "Change password",
    },
    {
      key: "payment",
      label: "Payment",
      icon: <MdPayments size={18} />,
      desc: "Payment methods",
    },
  ];

  return (
    <div className="text-white">
      {/* TOP MENU */}
      <div className="border border-slate-800 rounded-3xl p-4 h-fit mb-6">
        <div className="flex flex-row items-center gap-4">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`
                w-full text-left p-4 rounded-2xl transition-all duration-200
                border
                ${
                  tab === item.key
                    ? "bg-indigo-500/10 border-indigo-500 text-white"
                    : "border-transparent hover:bg-slate-800 text-slate-400 hover:text-white"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                    w-10 h-10 rounded-xl flex items-center justify-center
                    ${
                      tab === item.key
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }
                  `}
                >
                  {item.icon}
                </div>

                <div>
                  <h3 className="font-medium">{item.label}</h3>

                  <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 border border-slate-800 rounded-3xl p-6 h-full">
        {/* LEFT SIDE */}
  
<div
  className={`
    ${
      tab === "profile"
        ? "block"
        : "hidden xl:hidden 2xl:block"
    }
    xl:col-span-1
  `}
>
  {shop && (
    <div className="sticky top-6">
                <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-600/20 via-slate-900 to-slate-950 p-4 md:p-6">
                  {/* Glow */}
                  <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
                  <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500/10 blur-3xl rounded-full" />

                  <div className="relative flex flex-col items-center text-center">
                    <div className="absolute -top-4 2xl:-top-2 -right-2 2xl:right-0">
                      {shop.status === "active" ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 backdrop-blur-md border border-green-400/30">
                          <Check size={14} className="text-green-400" />
                          <span className="text-xs font-medium text-green-300">
                            Active
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/30">
                          <AlertTriangle size={14} className="text-amber-400" />
                          <span className="text-xs font-medium text-amber-300">
                            Warning
                          </span>
                        </div>
                      )}
                    </div>
                    {/* IMAGE */}
                    <div className="relative">
                      <img
                        src={`https://api.pwezayshops.com/shop-uploads/${shop.photo}`}
                        alt="shop"
                        className="2xl:w-36 2xl:h-36 xl:w-32 xl:h-32 w-36 h-36   rounded-3xl object-cover border-4 border-white/20 shadow-2xl"
                      />
                    </div>

                    {/* INFO */}
                    <h1 className="text-2xl font-bold text-white mt-4">
                      {shop.shop_name}
                    </h1>

                    <p className="text-slate-300 mt-1">
                      Owned by{" "}
                      <span className="text-indigo-400 font-medium">
                        {shop.shopkeeper_name}
                      </span>
                    </p>

                    {/* BADGES */}
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                      <Badge
                        color={
                          shop.open_shop === 1
                            ? "bg-green-500/20 text-green-300 border-green-400/20"
                            : "bg-red-500/20 text-red-300 border-red-400/20"
                        }
                        label={
                          shop.open_shop === 1 ? "Shop Open" : "Shop Closed"
                        }
                      />

                      <Badge
                        color={
                          shop.open_shop_deli === 1
                            ? "bg-green-500/20 text-green-300 border-green-400/20"
                            : "bg-red-500/20 text-red-300 border-red-400/20"
                        }
                        label={
                          shop.open_shop_deli === 1
                            ? "Delivery Open"
                            : "Delivery Closed"
                        }
                      />
                      {/* 
                    <Badge
                      color={
                        shop.status === "active"
                          ? "bg-indigo-500/20 text-indigo-300 border-indigo-400/20"
                          : "bg-red-500/20 text-red-300 border-red-400/20"
                      }
                      label={shop.status}
                    /> */}
                    </div>

                    {/* QUICK STATS */}
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className=" col-span-1 bg-white/5 rounded-2xl py-2 border border-white/10">
                        <p className="text-slate-400 text-sm">Have Delivery</p>

                        <h2 className="text-md font-semibold text-white mt-1">
                          {shop.have_deliverymen === 1 ? "Enabled" : "Disabled"}
                        </h2>
                      </div>

                      <div className="col-span-1 bg-white/5 rounded-2xl py-2 border border-white/10">
                        <p className="text-slate-400 text-sm">Delivery Fees</p>

                        <h2 className="text-md font-semibold text-white mt-1">
                          {shop.deli_fees_method || "km"}
                        </h2>
                      </div>

                      <div className="col-span-2 bg-white/5 rounded-2xl py-3 border border-white/10">
                        <p className="text-slate-400 text-sm">Payment Method</p>

                        <h2 className="text-md font-semibold text-white mt-1">
                          {shop.payments?.[0]
                            ? `${shop.payments[0].name} - ${shop.payments[0].method} (${shop.payments[0].phone})`
                            : "No payment"}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  )}
</div>



        {/* RIGHT SIDE */}
        <div className={tab === "profile" ? "xl:col-span-2" : "xl:col-span-3 2xl:col-span-2"}>
          <div className="">
            {tab === "profile" && <ShopProfileView shopId={shopId} />}

            {tab === "edit" && <ShopProfileEdit shopId={shopId} />}

            {tab === "account" && <AccountSettings shopId={shopId} />}

            {tab === "payment" && <PaymentSettings shopId={shopId} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <div className={`px-4 py-2 rounded-full border text-sm ${color}`}>
      {label}
    </div>
  );
}
