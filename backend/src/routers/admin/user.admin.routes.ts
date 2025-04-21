import { Router } from "express";
import { adminUserControllerr } from "../../controllers/implements/admin/user.admin.controller";
import { adminFacilityController } from "../../controllers/implements/admin/facility.controller";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";

const adminUserRoute = Router();

adminUserRoute.get(
  "/users",
  adminUserControllerr.fetchUsers.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/providers",
  adminUserControllerr.fetchProviders.bind(adminUserControllerr)
);

adminUserRoute.put(
  "/updateUser",
  adminUserControllerr.updateUser.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/unverified-hostels",
  adminUserControllerr.getUnverifiedHostels.bind(adminUserControllerr)
);

adminUserRoute.put(
  "/verify-hostel",
  adminUserControllerr.verifyHostel.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/verified-hostels",
  adminUserControllerr.getVerifiedHostels.bind(adminUserControllerr)
);

adminUserRoute.get(
  "/hostel/:hostelId",
  adminUserControllerr.getHostelById.bind(adminUserControllerr)
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

adminUserRoute.get(
  "/bookings",
  bookingContrller.getAllBookings.bind(bookingContrller)
);

adminUserRoute.get(
  "/dashboard",
  adminUserControllerr.getDashboard.bind(adminUserControllerr)
);

export default adminUserRoute;
