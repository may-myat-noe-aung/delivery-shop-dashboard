
// export const getAuth = () => {
//   const shopId = localStorage.getItem("shopId");
//   const haveDelivery = localStorage.getItem("haveDelivery");

//   return {
//     shopId: shopId || null,
//     haveDelivery: haveDelivery === "1",
//     isLoggedIn: !!shopId,
//   };
// };
// utils/auth.js

export const getAuth = () => {
  const shopId = localStorage.getItem("shopId");
  const token = localStorage.getItem("shopToken");
  const haveDelivery = localStorage.getItem("haveDelivery");

  return {
    shopId,
    token,
    haveDelivery: haveDelivery === "1",
    isLoggedIn: !!token,
  };
};

// Authorization Header
export const getAuthHeaders = () => {
  const token = localStorage.getItem("shopToken");

  return {
    "Content-Type": "application/json",
    Authorization: `MSHteam ${token}`,
  };
};

// Logout
export const logout = () => {
  localStorage.removeItem("shopId");
  localStorage.removeItem("shopToken");
  localStorage.removeItem("haveDelivery");
};