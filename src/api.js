
// export const apiFetch = async (url, options = {}) => {
//   const token = localStorage.getItem("shopToken");

//   const isFormData = options.body instanceof FormData;

//   const response = await fetch(url, {
//     ...options,

//     headers: {
//       ...options.headers,

//       ...(isFormData
//         ? {}
//         : {
//             "Content-Type": "application/json",
//           }),

//       ...(token && {
//         Authorization: `MSHteam ${token}`,
//       }),
//     },
//   });


//   if (response.status === 401 || response.status === 403) {

//     localStorage.removeItem("shopId");
//     localStorage.removeItem("shopToken");
//     localStorage.removeItem("haveDelivery");

//     window.location.replace("/login");

//     return null;
//   }


//   return response;
// };


// export const apiFetch = async (url, options = {}) => {
//   const token = localStorage.getItem("shopToken");

//   const headers = {
//     ...(options.headers || {}),
//     ...(token && {
//       Authorization: `MSHteam ${token}`,
//     }),
//   };

//   const isFormData = options.body instanceof FormData;

//   if (!isFormData) {
//     headers["Content-Type"] = "application/json";
//   }

//   console.log("HEADERS:", headers);
//   console.log("IS FORM DATA:", isFormData);

//   const response = await fetch(url, {
//     ...options,
//     headers,
//   });

//   if (response.status === 401 || response.status === 403) {
//     localStorage.removeItem("shopId");
//     localStorage.removeItem("shopToken");
//     localStorage.removeItem("haveDelivery");

//     window.location.replace("/login");

//     return null;
//   }

//   return response;
// };

import { logout } from "./auth"; // path ကိုလိုသလိုပြင်ပါ

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("shopToken");

  const headers = {
    ...(options.headers || {}),
    ...(token && {
      Authorization: `MSHteam ${token}`,
    }),
  };

  const isFormData = options.body instanceof FormData;

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Check unauthorized response
  if (response.status === 401 || response.status === 403) {
    let data = {};

    try {
      data = await response.clone().json();
    } catch {
      // Response is not JSON
    }

    if (
      data.message === "Invalid or expired token" ||
      response.status === 401 ||
      response.status === 403
    ) {
      logout();
      window.location.replace("/login");
      return null;
    }
  }

  return response;
};