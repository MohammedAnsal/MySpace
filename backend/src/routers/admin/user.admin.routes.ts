import { Router } from "express";
import { AdminUserControllerr } from "../../controllers/implements/admin/user.admin.controller";
import { adminFacilityController } from "../../controllers/implements/admin/facility.controller";

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

adminUserRoute.get(
  "/unverified-hostels",
  AdminUserControllerr.getUnverifiedHostels.bind(AdminUserControllerr)
);

adminUserRoute.put(
  "/verify-hostel",
  AdminUserControllerr.verifyHostel.bind(AdminUserControllerr)
);

adminUserRoute.get(
  "/verified-hostels",
  AdminUserControllerr.getVerifiedHostels.bind(AdminUserControllerr)
);

adminUserRoute.get(
  "/hostel/:hostelId",
  AdminUserControllerr.getHostelById.bind(AdminUserControllerr)
);

adminUserRoute.post(
  "/add-facility",
  adminFacilityController.createFacility.bind(adminFacilityController)
);

adminUserRoute.get(
  "/facilities",
  adminFacilityController.findAllFacilities.bind(adminFacilityController)
);

adminUserRoute.put(
  "/facility/status",
  adminFacilityController.updateFacilityStatus.bind(adminFacilityController)
);

adminUserRoute.delete(
  "/facility/:facilityId",
  adminFacilityController.deleteFacility.bind(adminFacilityController)
);

export default adminUserRoute;
