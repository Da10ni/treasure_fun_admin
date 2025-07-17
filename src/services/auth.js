export const getTokenFromCookie = () => {
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "token") return value;
  }
  return null;
};
