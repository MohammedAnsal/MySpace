import { Router } from "express";
import { providerController } from "../../controllers/implements/provider/provider.controller";
import { upload } from "../../utils/multer";
import { facilityController } from "../../controllers/implements/provider/facility.controller";
import { hostelController } from "../../controllers/implements/provider/hostel.controller";

const providerRoute = Router();

providerRoute.get(
  "/profile",
  providerController.findUser.bind(providerController)
);

providerRoute.post(
  "/change-password",
  providerController.changePassword.bind(providerController)
);

providerRoute.put(
  "/edit-profile",
  upload.single("profile"),
  providerController.editProfile.bind(providerController)
);

providerRoute.post(
  "/add-facility",
  facilityController.createFacility.bind(facilityController)
);

providerRoute.get(
  "/facilities",
  facilityController.findAllFacilities.bind(facilityController)
);

providerRoute.put(
  "/facility/status",
  facilityController.updateFacilityStatus.bind(facilityController)
);

providerRoute.delete(
  "/facility/:facilityId",
  facilityController.deleteFacility.bind(facilityController)
);

providerRoute.post(
  "/create-hostel",
  upload.array("photos", 5),
  hostelController.createHostel.bind(hostelController)
);

providerRoute.get(
  "/all-hostels",
  hostelController.getAllHostels.bind(hostelController)
);

export default providerRoute;
