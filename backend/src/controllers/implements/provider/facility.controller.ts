import { Request, Response } from "express";
import { IFacilityService } from "../../../services/interface/provider/facility.service.interface";
import { facilityResultController } from "../../interface/provider/facility.controller.interface";
import { HttpStatus } from "../../../enums/http.status";
import { AppError } from "../../../utils/error";
import Container, { Service } from "typedi";
import { facilityService } from "../../../services/implements/provider/facility.service";
import { AuthRequset } from "../../../types/api";

@Service()
export class FacilityController {
  private facilityService: IFacilityService;

  constructor() {
    this.facilityService = facilityService;
  }

  async createFacility(req: AuthRequset, res: Response): Promise<any> {
    try {
      const formData = req.body;
      const { name, price, description } = formData;

      // Get provider ID from authenticated user
      const provider_id = req?.user;

      if (!provider_id) {
        return res
          .status(401)
          .json({ success: false, message: "Provider not authenticated" });
      }

      if (!name) {
        console.log("Name missing in request");
        return res
          .status(400)
          .json({ success: false, message: "Name required!" });
      }
      if (!price) {
        console.log("Price missing in request");
        return res
          .status(400)
          .json({ success: false, message: "Price required!" });
      }
      if (!description) {
        console.log("Description missing in request");
        return res
          .status(400)
          .json({ success: false, message: "Description required!" });
      }

      // Add provider ID to the facility data
      const facilityDataWithProvider = {
        ...formData,
        provider_id: provider_id,
      };

      console.log("alalalla");

      console.log(
        "Calling facility service with data:",
        facilityDataWithProvider
      );
      const facility = await this.facilityService.createFacility(
        facilityDataWithProvider
      );
      console.log("Service response:", facility);

      return res.status(201).json({
        success: true,
        message: "Facility Created Successfully",
        data: facility,
      });
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to create facility",
      });
    }
  }

  async findAllFacilities(req: AuthRequset, res: Response): Promise<any> {
    try {
      const provider_id = req?.user;

      if (!provider_id) {
        return res.status(401).json({
          success: false,
          message: "Provider not authenticated",
        });
      }

      const facilities = await this.facilityService.findAllFacilities(
        provider_id
      );

      return res.status(200).json({
        success: true,
        message: "Facilities fetched successfully",
        data: facilities,
      });
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to fetch facilities",
      });
    }
  }

  async updateFacilityStatus(req: AuthRequset, res: Response): Promise<any> {
    try {
      const { facilityId, status } = req.body;
      const provider_id = req?.user;

      if (!provider_id) {
        return res.status(401).json({
          success: false,
          message: "Provider not authenticated",
        });
      }

      const result = await this.facilityService.updateFacilityStatus(
        facilityId,
        status
      );
      return res.status(200).json(result);
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to update facility status",
      });
    }
  }

  async deleteFacility(req: AuthRequset, res: Response): Promise<any> {
    try {
      const { facilityId } = req.params;
      const provider_id = req?.user;

      if (!provider_id) {
        return res.status(401).json({
          success: false,
          message: "Provider not authenticated",
        });
      }

      const result = await this.facilityService.deleteFacility(facilityId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(500).json({
        success: false,
        message: "Failed to delete facility",
      });
    }

    //   async getFacilityById(req: Request, res: Response) {
    //     try {
    //       const facility = await this.facilityService.getFacilityById(
    //         req.params.id
    //       );
    //       if (!facility) {
    //         return res
    //           .status(404)
    //           .json({ success: false, message: "Facility not found" });
    //       }
    //       return res.status(200).json({ success: true, data: facility });
    //     } catch (error) {
    //       return res
    //         .status(500)
    //         .json({ success: false, message: "Error fetching facility" });
    //     }
    //   }

    //   async getFacilitiesByHostel(req: Request, res: Response) {
    //     try {
    //       const facilities = await this.facilityService.getFacilitiesByHostel(
    //         req.params.hostelId
    //       );
    //       return res.status(200).json({ success: true, data: facilities });
    //     } catch (error) {
    //       return res
    //         .status(500)
    //         .json({ success: false, message: "Error fetching facilities" });
    //     }
    //   }

    //   async getFacilitiesByProvider(req: Request, res: Response) {
    //     try {
    //       const facilities = await this.facilityService.getFacilitiesByProvider(
    //         req.params.providerId
    //       );
    //       return res.status(200).json({ success: true, data: facilities });
    //     } catch (error) {
    //       return res
    //         .status(500)
    //         .json({ success: false, message: "Error fetching facilities" });
    //     }
    //   }
  }
}

// Create and export a singleton instance
export const facilityController = Container.get(FacilityController);
