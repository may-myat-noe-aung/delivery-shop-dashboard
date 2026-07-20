// import axios from "axios";

// const API = "https://api.pwezayshops.com";

// export const deleteDeliveryMan = (id) =>
//   axios.delete(`${API}/deliverymen/${id}`);

// export const updateDeliveryManStatus = (id, status) =>
//   axios.patch(`${API}/deliverymen/status/${id}`, {
//     status,
//   });

// export const updateDeliveryMan = (id, formData) =>
//   axios.put(`${API}/deliverymen/${id}`, formData);import axios from "axios";
import axios from "axios";
const API = "https://api.pwezayshops.com";

const token = localStorage.getItem("shopToken");

export const deleteDeliveryMan = (id) =>
  axios.delete(`${API}/deliverymen/${id}`, {
    headers: {
      Authorization: `MSHteam ${token}`,
    },
  });

export const updateDeliveryManStatus = (id, status) =>
  axios.patch(
    `${API}/deliverymen/status/${id}`,
    { status },
    {
      headers: {
        Authorization: `MSHteam ${token}`,
      },
    }
  );

export const updateDeliveryMan = (id, formData) =>
  axios.put(
    `${API}/deliverymen/${id}`,
    formData,
    {
      headers: {
        Authorization: `MSHteam ${token}`,
      },
    }
  );