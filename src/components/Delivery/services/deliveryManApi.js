import { apiFetch } from "../../../api";

const API = "https://api.pwezayshops.com";

export const deleteDeliveryMan = (id) =>
  apiFetch(`${API}/deliverymen/${id}`, {
    method: "DELETE",
  });

export const updateDeliveryManStatus = (id, status) =>
  apiFetch(`${API}/deliverymen/status/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const updateDeliveryMan = (id, formData) =>
  apiFetch(`${API}/deliverymen/${id}`, {
    method: "PUT",
    body: formData,
  });