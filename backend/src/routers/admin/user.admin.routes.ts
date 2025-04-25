import { Router } from "express";
import { adminUserControllerr } from "../../controllers/implements/admin/user.admin.controller";
import { adminFacilityController } from "../../controllers/implements/admin/facility.controller";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";

const adminUserRoute = Router();

adminUserRoute.get(
  "/users",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.fetchUsers.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/providers",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.fetchProviders.bind(adminUserControllerr)
);

adminUserRoute.put(
  "/updateUser",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.updateUser.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/unverified-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.getUnverifiedHostels.bind(adminUserControllerr)
);

adminUserRoute.put(
  "/verify-hostel",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.verifyHostel.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/verified-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.getVerifiedHostels.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.getHostelById.bind(adminUserControllerr)
);

adminUserRoute.post(
  "/add-facility",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminFacilityController.createFacility.bind(adminFacilityController)
);

adminUserRoute.get(
  "/facilities",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminFacilityController.findAllFacilities.bind(adminFacilityController)
);

adminUserRoute.put(
  "/facility/status",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminFacilityController.updateFacilityStatus.bind(adminFacilityController)
);

adminUserRoute.delete(
  "/facility/:facilityId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminFacilityController.deleteFacility.bind(adminFacilityController)
);

adminUserRoute.get(
  "/bookings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  bookingContrller.getAllBookings.bind(bookingContrller)
);

adminUserRoute.get(
  "/dashboard",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  adminUserControllerr.getDashboard.bind(adminUserControllerr)
);

export default adminUserRoute;
