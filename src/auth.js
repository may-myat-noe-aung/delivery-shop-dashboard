

// export const getAuth = () => {
//   const cookies = Object.fromEntries(
//     document.cookie.split("; ").map((c) => c.split("="))
//   );

//   return {
//     shopId: cookies.shopId || localStorage.getItem("shopId"),
//     haveDelivery:
//       (cookies.haveDelivery ?? localStorage.getItem("haveDelivery")) === "true",
//   };
// };
export const getAuth = () => {
  const shopId = localStorage.getItem("shopId");
  const haveDelivery = localStorage.getItem("haveDelivery");

  return {
    shopId: shopId || null,
    haveDelivery: haveDelivery === "1",
    isLoggedIn: !!shopId,
  };
};