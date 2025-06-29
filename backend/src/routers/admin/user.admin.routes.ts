import { Router } from "express";
import { adminUserControllerr } from "../../controllers/implements/admin/user.admin.controller";
import { adminFacilityController } from "../../controllers/implements/admin/facility.controller";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { asyncHandler } from "../../utils/asyncHandler";

const adminUserRoute = Router();

adminUserRoute.post(
  "/create-wallet",
  asyncHandler(adminUserControllerr.createWallet.bind(adminUserControllerr))
);
adminUserRoute.get(
  "/users",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(adminUserControllerr.fetchUsers.bind(adminUserControllerr))
);

adminUserRoute.get(
  "/providers",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(adminUserControllerr.fetchProviders.bind(adminUserControllerr))
);

adminUserRoute.put(
  "/updateUser",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(adminUserControllerr.updateUser.bind(adminUserControllerr))
);

adminUserRoute.get(
  "/unverified-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(
    adminUserControllerr.getUnverifiedHostels.bind(adminUserControllerr)
  )
);

adminUserRoute.put(
  "/verify-hostel",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(adminUserControllerr.verifyHostel.bind(adminUserControllerr))
);

adminUserRoute.get(
  "/verified-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(
    adminUserControllerr.getVerifiedHostels.bind(adminUserControllerr)
  )
);

adminUserRoute.get(
  "/hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(adminUserControllerr.getHostelById.bind(adminUserControllerr))
);

adminUserRoute.post(
  "/add-facility",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(
    adminFacilityController.createFacility.bind(adminFacilityController)
  )
);

adminUserRoute.get(
  "/facilities",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(
    adminFacilityController.findAllFacilities.bind(adminFacilityController)
  )
);

adminUserRoute.put(
  "/facility/status",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(
    adminFacilityController.updateFacilityStatus.bind(adminFacilityController)
  )
);

adminUserRoute.delete(
  "/facility/:facilityId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(
    adminFacilityController.deleteFacility.bind(adminFacilityController)
  )
);

adminUserRoute.get(
  "/bookings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(bookingContrller.getAllBookings.bind(bookingContrller))
);

adminUserRoute.get(
  "/dashboard",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.ADMIN),
  asyncHandler(adminUserControllerr.getDashboard.bind(adminUserControllerr))
);

export default adminUserRoute;
