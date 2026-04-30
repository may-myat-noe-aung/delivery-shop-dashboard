export const getAuth = () => {
  const cookies = Object.fromEntries(
    document.cookie.split("; ").map((c) => c.split("="))
  );

  return {
    shopId: cookies.shopId || localStorage.getItem("shopId"),
    haveDelivery:
      (cookies.haveDelivery ?? localStorage.getItem("haveDelivery")) === "true",
  };
};