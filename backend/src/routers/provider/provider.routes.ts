import { Router } from "express";
import { providerController } from "../../controllers/implements/provider/provider.controller";
import { upload } from "../../utils/multer";
// import { facilityController } from "../../controllers/implements/provider/facility.controller";
import { hostelController } from "../../controllers/implements/provider/hostel.controller";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";

const providerRoute = Router();

providerRoute.get(
  "/profile",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  providerController.findUser.bind(providerController)
);

providerRoute.post(
  "/change-password",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  providerController.changePassword.bind(providerController)
);

providerRoute.put(
  "/edit-profile",
  upload.single("profile"),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  providerController.editProfile.bind(providerController)
);

// providerRoute.post(
//   "/add-facility",
//   facilityController.createFacility.bind(facilityController)
// );

providerRoute.get(
  "/facilities",
  providerController.findAllFacilities.bind(providerController)
);

// providerRoute.put(
//   "/facility/status",
//   facilityController.updateFacilityStatus.bind(facilityController)
// );

// providerRoute.delete(
//   "/facility/:facilityId",
//   facilityController.deleteFacility.bind(facilityController)
// );

providerRoute.post(
  "/create-hostel",
  upload.array("photos", 5),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  hostelController.createHostel.bind(hostelController)
);

providerRoute.get(
  "/all-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  hostelController.getAllHostels.bind(hostelController)
);

providerRoute.get(
  "/get-hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  hostelController.getHostelById.bind(hostelController)
);

providerRoute.put(
  "/edit-hostel/:hostelId",
  upload.array("photos", 5),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  hostelController.editHostel.bind(hostelController)
);

providerRoute.delete(
  "/delete-hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  hostelController.deleteHostel.bind(hostelController)
);

providerRoute.get(
  "/bookings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  bookingContrller.getProviderBookings.bind(bookingContrller)
);

providerRoute.get(
  "/dashboard",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  providerController.getDashboard.bind(providerController)
);

export default providerRoute;
