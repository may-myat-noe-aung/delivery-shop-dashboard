import React, { useState } from "react";
import { MapPin } from "lucide-react";

export default function LocationInput() {
  const [location, setLocation] = useState("");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocation(`Lat ${lat}, Log ${lng}`);
      },
      (error) => {
        console.error(error);
        alert("Cannot get location");
      }
    );
  };

  return (
    <div className="flex items-center gap-2">
      {/* Input */}
      <input
        type="text"
        value={location}
        readOnly
        placeholder="Current location..."
        className="border px-4 py-2 rounded-lg w-full bg-black"
      />

      {/* Icon Button */}
      <button
        onClick={getCurrentLocation}
        className="p-2 rounded-lg bg-indigo-500 text-white"
      >
        <MapPin size={20} />
      </button>
    </div>
  );
}