import { Trash2 } from "lucide-react";
import { deleteDeliveryMan } from "../services/deliveryManApi";
import { useAlert } from "../../../AlertProvider";

export default function DeleteDeliveryMan({
  delivery,
  onSuccess,
  loading,
  setLoading,
}) {
  const { showAlert, confirm } = useAlert();

const handleDelete = async () => {
  const ok = await confirm(
    "Are you sure you want to delete delivery man?"
  );

  if (!ok) return;

  try {
    setLoading((prev) => ({
      ...prev,
      [delivery.id]: true,
    }));

    const res = await deleteDeliveryMan(delivery.id);

    if (!res) return; // token expired => apiFetch က redirect လုပ်ပြီးသား

    const data = await res.json();

    if (!res.ok) {
      showAlert(data.message || "Delete Failed", "error");
      return;
    }

    showAlert(
      data.message || "Deleted Successfully",
      "success"
    );

    onSuccess(delivery.id);
  } catch (err) {
    console.error(err);
    showAlert(err.message || "Delete Failed", "error");
  } finally {
    setLoading((prev) => ({
      ...prev,
      [delivery.id]: false,
    }));
  }
};

  return (
    <button
      onClick={handleDelete}
      className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500 transition-all duration-300 hover:scale-105"
    >
      <Trash2 size={16} />
    </button>
  );
}
