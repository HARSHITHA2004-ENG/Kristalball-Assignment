export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAdmin = () => {
  return getRole() === "ADMIN";
};

export const isLogistics = () => {
  return getRole() === "LOGISTICS";
};

export const isCommander = () => {
  return getRole() === "COMMANDER";
};

export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};
