import { Response } from "express";
import { IAdminFacilityService } from "../../../services/interface/admin/facility.service.interface";
import { AppError } from "../../../utils/error";
import Container, { Service } from "typedi";
import { adminFacilityService } from "../../../services/implements/admin/facility.service";
import { AuthRequset } from "../../../types/api";

@Service()
export class AdminFacilityController {
  private adminFacilityService: IAdminFacilityService;

  constructor() {
    this.adminFacilityService = adminFacilityService;
  }

  async createFacility(req: AuthRequset, res: Response): Promise<any> {
    try {
      const formData = req.body;
      const { name, price, description } = formData;

      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", 401);
      }

      if (!name) {
        return res
          .status(400)
          .json({ success: false, message: "Name is required" });
      }
      if (!price) {
        return res
          .status(400)
          .json({ success: false, message: "Price is required" });
      }
      if (!description) {
        return res
          .status(400)
          .json({ success: false, message: "Description is required" });
      }

      const facility = await this.adminFacilityService.createFacility(formData);

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
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", 401);
      }

      const facilities = await this.adminFacilityService.findAllFacilities();

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

  async getFacilityById(req: AuthRequset, res: Response): Promise<any> {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", 401);
      }

      const { facilityId } = req.params;
      const facility = await this.adminFacilityService.findFacilityById(
        facilityId
      );

      return res.status(200).json({
        success: true,
        message: "Facility fetched successfully",
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
        message: "Failed to fetch facility",
      });
    }
  }

  async updateFacilityStatus(req: AuthRequset, res: Response): Promise<any> {
    try {
      const { facilityId, status } = req.body;
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", 401);
      }
      const result = await this.adminFacilityService.updateFacilityStatus({
        facilityId,
        status,
      });
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

      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", 401);
      }

      const result = await this.adminFacilityService.deleteFacility(facilityId);
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
  }
}

export const adminFacilityController = Container.get(AdminFacilityController);
