import React, { useState, useEffect } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useAlert } from "../../../AlertProvider";

export default function EditDeliveryMan({
  open,
  activeUser,
  setEditModal,
  setDeliverymen,
}) {
  const { showAlert } = useAlert();

  const [loading, setLoading] = useState(false);
const token = localStorage.getItem("shopToken");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    work_type: "",
    location: "",
    password: "",
    photo: null,
  });
  useEffect(() => {
  if (open) {
    setLoading(false);
  }
}, [open]);

useEffect(() => {
  if (!open || !activeUser) return;

  setLoading(false); 
  setConfirmPassword("");
  setShowPassword(false);
  setShowConfirmPassword(false);

  setFormData({
    name: activeUser.name || "",
    email: activeUser.email || "",
    phone: activeUser.phone || "",
    location: activeUser.location || "",
    work_type: activeUser.work_type || "",
    password: "",
    photo: null,
  });
}, [open, activeUser]);

  if (!open || !activeUser) return null;

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[0-9]{9,15}$/.test(phone);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showAlert("Name is required", "warning");
      return;
    }

    if (!formData.email.trim()) {
      showAlert("Email is required", "warning");
      return;
    }

    if (!isValidEmail(formData.email)) {
      showAlert("Email သည် မှန်ကန်သော format မဟုတ်ပါ", "warning");
      return;
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      showAlert("ဖုန်းနံပါတ် format မမှန်ကန်ပါ", "warning");
      return;
    }
    if (!formData.password && confirmPassword) {
      showAlert("New Password ကို အရင်ဖြည့်ပါ", "warning");
      return;
    }
    if (formData.password) {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

      if (!strongPasswordRegex.test(formData.password)) {
        showAlert(
          "Password သည် အနည်းဆုံး 8 လုံးရှိရမည်၊ Uppercase, Lowercase, Number, Special Character ပါဝင်ရမည်",
          "error",
        );
        return;
      }

      if (formData.password !== confirmPassword) {
        showAlert("စကားဝှက်နှစ်ခု မကိုက်ညီပါ", "warning");
        return;
      }
    }
    try {
      setLoading(true);

      const submitData = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          submitData.append(key, value);
        }
      });

      submitData.set("work_type", formData.work_type || "");

      if (!formData.phone) {
        submitData.set("phone", "");
      }

      const res = await axios.put(
        `https://api.pwezayshops.com/deliverymen/${activeUser.id}`,
        submitData,
         {
    headers: {
      Authorization: `MSHteam ${token}`,
    },
  }
      );

      setDeliverymen((prev) =>
        prev.map((item) =>
          item.id === activeUser.id
            ? {
                ...item,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                location: formData.location,
                work_type: formData.work_type,
              }
            : item,
        ),
      );

      showAlert(res.data.message || "Updated successfully", "success");

      setEditModal(false);
    } catch (err) {
      showAlert(err.response?.data?.message || "Update failed", "error");
    }

    // API Call
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="rounded-3xl w-[480px] max-h-[90vh] overflow-y-auto p-8 relative border shadow-[0_25px_80px_rgba(0,0,0,0.25)] bg-gray-900 border-gray-700 text-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Edit Delivery Man
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              {formData.photo ? (
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Preview"
                  className="w-full h-full rounded-full object-cover border-4 border-gray-800"
                />
              ) : activeUser.photo ? (
                <img
                  src={`https://api.pwezayshops.com/deliverymen-uploads/${activeUser.photo}`}
                  alt={activeUser.name}
                  className="w-full h-full rounded-full object-cover border-4 border-gray-800"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                  Avatar
                </div>
              )}

              <label className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      photo: e.target.files[0],
                    }))
                  }
                />
                <Camera className="w-4 h-4" />
              </label>
            </div>
          </div>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700"
            required
          />

          <input
            type="text"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
            className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password (optional)"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 pr-10"
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 pr-10"
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="px-5 py-2 rounded-xl border border-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* <button
          onClick={() => setEditModal(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button> */}

        <button
          onClick={() => setEditModal(false)}
          className="absolute top-4 right-5 w-9 h-9 flex items-center justify-center 
  bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white 
  rounded-full transition duration-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
