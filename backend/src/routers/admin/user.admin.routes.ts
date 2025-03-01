import { Router } from "express";
import { AdminUserControllerr } from "../../controllers/implements/admin/user.admin.controller";

const adminUserRoute = Router();

adminUserRoute.get(
  "/users",
  AdminUserControllerr.fetchUsers.bind(AdminUserControllerr)
);

adminUserRoute.get(
  "/providers",
  AdminUserControllerr.fetchProviders.bind(AdminUserControllerr)
);

adminUserRoute.put(
  "/updateUser",
  AdminUserControllerr.updateUser.bind(AdminUserControllerr)
);

adminUserRoute.post(
  "/logout",
  AdminUserControllerr.logout.bind(AdminUserControllerr)
);

export default adminUserRoute;
