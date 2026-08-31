import React, { useState, useRef, useEffect } from "react";
import { Camera, Eye, EyeOff } from "lucide-react";
import { useAlert } from "../../AlertProvider";
import { apiFetch } from "../../api";

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
const isValidPhone = (phone) => {
  return /^[0-9]{9,15}$/.test(phone);
};

export default function AddDeliveryForm({ shopId, onClose, onAdded }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    photo: null,
  });

  const { showAlert } = useAlert();

  const nameInputRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (nameInputRef.current) nameInputRef.current.focus();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, photo: file });
  };

  // ✅ FINAL SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------
    // VALIDATION
    // -------------------------
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showAlert("Please fill required fields", "warning");
      return;
    }

    // -------------------------
    // EMAIL CHECK
    // -------------------------
    if (!isValidEmail(formData.email)) {
      showAlert("Email သည် မှန်ကန်သော format မဟုတ်ပါ", "warning");
      return;
    }

    if (!isValidPhone(formData.phone)) {
      showAlert("ဖုန်းနံပါတ် format မမှန်ကန်ပါ", "warning");
      return;
    }

    // -------------------------
    // PASSWORD CHECK
    // -------------------------
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!strongPasswordRegex.test(formData.password)) {
      showAlert(
        "Password သည် အနည်းဆုံး 8 လုံးရှိရမည်၊ Uppercase, Lowercase, Number, Special Character ပါဝင်ရမည်",
        "error",
      );
      return;
    }

    // -------------------------
    // CONFIRM PASSWORD
    // -------------------------
    if (formData.password !== formData.confirmPassword) {
      showAlert("စကားဝှက်နှစ်ခု မကိုက်ညီပါ", "warning");
      return;
    }

    // -------------------------
    // API REQUEST
    // -------------------------
    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone || "");
    payload.append("password", formData.password);
    payload.append("work_type", shopId);
    payload.append("location", formData.location || "");

    if (formData.photo instanceof File) {
      payload.append("photo", formData.photo);
    }

try {
  setSaving(true);

  const res = await apiFetch(
    "https://api.pwezayshops.com/deliverymen",
    {
      method: "POST",
      body: payload,
    }
  );

  if (!res) return;

  const data = await res.json();

  if (!res.ok) {
    showAlert(data.message || "Failed to add delivery", "error");
    return;
  }

  showAlert(data.message || "Delivery added successfully", "success");

  onAdded?.();
  onClose?.();

  setFormData({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    location: "",
    photo: null,
  });

  setErrors({});
} catch (err) {
  showAlert("Network error", "error");
} finally {
  setSaving(false);
}
  };
  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 flex justify-center items-center z-50 bg-[rgba(0,0,0,0.6)]">
        <div className="relative w-[450px] p-6 rounded-2xl shadow-lg bg-gray-800 text-gray-100">
          <h2 className="text-lg font-semibold mb-4 text-indigo-500">
            Add Delivery Man
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* PHOTO */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative w-28 h-28">
                <img
                  src={
                    formData.photo
                      ? URL.createObjectURL(formData.photo)
                      : "https://i.pinimg.com/736x/4a/6b/e0/4a6be0cad2a1bb290e43477834fdf8ad.jpg"
                  }
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover border-2 border-dashed border-gray-600 shadow-sm"
                />
                <label className="absolute bottom-0 right-0 bg-indigo-500 hover:bg-[#9b5de5] text-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="mt-2 text-sm text-gray-300">Upload profile image</p>
            </div>

            {/* NAME */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
              required
              ref={nameInputRef}
            />

            {/* EMAIL */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
              required
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-3 py-2 rounded-lg text-sm border pr-10 bg-gray-700 border-gray-600 text-gray-100"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full px-3 py-2 rounded-lg text-sm border pr-10 bg-gray-700 border-gray-600 text-gray-100"
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            {/* PHONE (no need but kept UI) */}
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone "
              className="w-full px-3 py-2 rounded-lg text-sm border bg-gray-700 border-gray-600 text-gray-100"
            />

            {/* BUTTONS */}
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-sm border border-gray-600 text-gray-100 hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-sm text-white ${
                  saving ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-500"
                }`}
              >
                {saving ? "Creating New Delivery..." : "Creating New Delivery "}
              </button>
            </div>
          </form>

          {/* <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-300 hover:text-white"
          >
            ✕
          </button> */}

          <button
            onClick={onClose}
            className="absolute top-4 right-5 w-9 h-9 flex items-center justify-center 
  bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white 
  rounded-full transition duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </>
  );
}
