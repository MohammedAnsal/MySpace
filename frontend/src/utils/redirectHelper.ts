export const getRedirectPath = (role: string | null) => {
  switch (role) {
    case "provider":
      return "/provider/dashboard";
    case "user":
      return "/";
    case "admin":
      return "/admin/dashboard";
    default:
      return "/";
  }
};
