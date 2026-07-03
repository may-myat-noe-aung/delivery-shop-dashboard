import axios from "axios";

const API = "https://api.pwezayshops.com";

export const deleteDeliveryMan = (id) =>
  axios.delete(`${API}/deliverymen/${id}`);

export const updateDeliveryManStatus = (id, status) =>
  axios.patch(`${API}/deliverymen/status/${id}`, {
    status,
  });

export const updateDeliveryMan = (id, formData) =>
  axios.put(`${API}/deliverymen/${id}`, formData);