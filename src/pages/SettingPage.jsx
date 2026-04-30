import React from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import ShopAccountSettings from "../components/Setting/ShopAccountSettings";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { shopId } = getAuth();

  if (!shopId) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6"> 
      <ShopAccountSettings shopId={shopId} />
    </div>
  );
}