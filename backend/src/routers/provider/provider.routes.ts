import { Router } from "express";
import { providerController } from "../../controllers/implements/provider/provider.controller";
import { upload } from "../../utils/multer";
import { hostelController } from "../../controllers/implements/provider/hostel.controller";
import { bookingContrller } from "../../controllers/implements/user/booking.controller";
import { authMiddleWare } from "../../middlewares/auth/auth.middleware";
import { autherization } from "../../middlewares/auth/autherization.middlware";
import { authorizeRoles } from "../../middlewares/auth/role.middleware";
import Roles from "../../enums/roles";
import { asyncHandler } from "../../utils/asyncHandler";

const providerRoute = Router();

providerRoute.get(
  "/profile",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(providerController.findUser.bind(providerController))
);

providerRoute.patch(
  "/change-password",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(providerController.changePassword.bind(providerController))
);

providerRoute.patch(
  "/edit-profile",
  upload.single("profile"),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(providerController.editProfile.bind(providerController))
);

providerRoute.get(
  "/facilities",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(providerController.findAllFacilities.bind(providerController))
);

providerRoute.post(
  "/create-hostel",
  upload.fields([
    { name: "photos", maxCount: 5 },
    { name: "property_proof", maxCount: 1 },
  ]),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(hostelController.createHostel.bind(hostelController))
);

providerRoute.get(
  "/all-hostels",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(hostelController.getAllHostels.bind(hostelController))
);

providerRoute.get(
  "/get-hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(hostelController.getHostelById.bind(hostelController))
);

providerRoute.patch(
  "/edit-hostel/:hostelId",
  upload.array("photos", 5),
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(hostelController.editHostel.bind(hostelController))
);

providerRoute.delete(
  "/delete-hostel/:hostelId",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(hostelController.deleteHostel.bind(hostelController))
);

providerRoute.get(
  "/bookings",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(bookingContrller.getProviderBookings.bind(bookingContrller))
);

providerRoute.get(
  "/dashboard",
  authMiddleWare,
  autherization,
  authorizeRoles(Roles.PROVIDER),
  asyncHandler(providerController.getDashboard.bind(providerController))
);

export default providerRoute;
