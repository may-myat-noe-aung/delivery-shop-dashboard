

import { useAlert } from "../../../AlertProvider";
import { updateDeliveryManStatus } from "../services/deliveryManApi";

export default function StatusDeliveryMan({
  delivery,
  loading,
  setLoading,
  onSuccess,
}) {
  const { showAlert } = useAlert();

  const changeStatus = async () => {
    const newStatus =
      delivery.status === "active" ? "warning" : "active";

    try {
      setLoading((prev) => ({
        ...prev,
        [delivery.id]: true,
      }));

      const res = await updateDeliveryManStatus(
        delivery.id,
        newStatus
      );

      showAlert(res.data.message || "Status Updated", "success");

      onSuccess(delivery.id, newStatus);
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to Update Status",
        "error"
      );
    } finally {
      setLoading((prev) => ({
        ...prev,
        [delivery.id]: false,
      }));
    }
  };

  const isActive = delivery.status === "active";

  return (
    <div className="flex justify-center">
      <button
        disabled={loading?.[delivery.id]}
        onClick={changeStatus}
        className={`px-3 py-1.5 rounded-full text-xs border transition ${
          isActive
            ? "bg-green-500/10 text-green-500 border-green-500 hover:bg-green-500/20"
            : "bg-red-500/10 text-red-500 border-red-500 hover:bg-red-500/20"
        }`}
      >
        {isActive ? "Active" : "Warning"}
      </button>
    </div>
  );
}