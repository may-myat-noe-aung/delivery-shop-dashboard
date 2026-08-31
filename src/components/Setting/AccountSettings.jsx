import React, { useState } from "react";
import { Lock, Eye, EyeOff, Save, Loader2, ShieldCheck } from "lucide-react";

import { useAlert } from "../../AlertProvider";
import { apiFetch } from "../../api";

export default function AccountSettings({ shopId }) {
  const { showAlert, confirm } = useAlert();

  const [saving, setSaving] = useState(false);

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // ================= CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= TOGGLE PASSWORD =================
  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (
      !form.oldPassword?.trim() ||
      !form.newPassword?.trim() ||
      !form.confirmPassword?.trim()
    ) {
      return showAlert("Current and new password are required", "warning");
    }

    if (form.newPassword.length < 6) {
      return showAlert("New password must be at least 6 characters", "warning");
    }

    if (form.newPassword !== form.confirmPassword) {
      return showAlert("Confirm password does not match", "error");
    }

    const confirmed = await confirm(
      "Are you sure you want to change password?",
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      // DEBUG (optional but useful)
      console.log("PAYLOAD:", {
        current_pw: form.oldPassword,
        new_pw: form.newPassword,
      });

      const res = await apiFetch(
        `https://api.pwezayshops.com/change-passwords-shops/${shopId}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            current_pw: form.oldPassword,
            new_pw: form.newPassword,
          }),
        },
      );

      if (!res) return;

      const data = await res.json();

      if (data?.success) {
        showAlert(data?.message || "Password updated successfully", "success");

        setForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        showAlert(data?.message || "Failed to update password", "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Something went wrong", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ================= MAIN CARD ================= */}
      <div className="relative overflow-hidden bg-[#111827] border border-slate-800 rounded-3xl p-4 md:p-6">
        {/* GLOW */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="relative flex items-center gap-4 mb-8">
          {/* <div
            className="
              w-14 h-14 rounded-2xl
              bg-indigo-500/10
              text-indigo-400
              flex items-center justify-center
              border border-indigo-500/20
            "
          >
            <ShieldCheck size={28} />
          </div> */}

          <div>
            <h2 className="text-xl font-bold text-white">Account Security</h2>

            {/* <p className="text-slate-400 text-sm mt-1">
              Update your account password securely
            </p> */}
          </div>
        </div>

        {/* ================= PASSWORD FIELDS ================= */}
        <div className="space-y-5">
          <PasswordInput
            label="Current Password"
            name="oldPassword"
            value={form.oldPassword}
            onChange={handleChange}
            visible={showPassword.old}
            toggle={() => togglePassword("old")}
          />

          <PasswordInput
            label="New Password"
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            visible={showPassword.new}
            toggle={() => togglePassword("new")}
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            visible={showPassword.confirm}
            toggle={() => togglePassword("confirm")}
          />
        </div>

        {/* ================= BUTTON ================= */}
        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="
              h-12 px-6 rounded-2xl
              bg-indigo-600 hover:bg-indigo-500
              text-white font-semibold
              transition-all duration-200
              flex items-center gap-2
              disabled:opacity-50
              disabled:cursor-not-allowed
              shadow-lg shadow-indigo-500/20
              min-w-[190px]
            "
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={18} />
                Change Password
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

/* ================= PASSWORD INPUT ================= */
function PasswordInput({ label, name, value, onChange, visible, toggle }) {
  return (
    <div>
      <p className="text-sm text-slate-400 mb-3">{label}</p>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          <Lock size={18} />
        </div>

        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          className="
            w-full h-12
            bg-slate-900/70
            border border-slate-700
            rounded-xl
            pl-12 pr-12
            text-white
            outline-none
            focus:border-indigo-500
            transition-all
          "
        />

        <button
          type="button"
          onClick={toggle}
          className="
            absolute right-4 top-1/2 -translate-y-1/2
            text-slate-500 hover:text-white
            transition
          "
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
