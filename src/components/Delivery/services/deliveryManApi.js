import axios from "axios";

const API = "http://38.60.244.137:3000";

export const deleteDeliveryMan = (id) =>
  axios.delete(`${API}/deliverymen/${id}`);

export const updateDeliveryManStatus = (id, status) =>
  axios.patch(`${API}/deliverymen/status/${id}`, {
    status,
  });

export const updateDeliveryMan = (id, formData) =>
  axios.put(`${API}/deliverymen/${id}`, formData);