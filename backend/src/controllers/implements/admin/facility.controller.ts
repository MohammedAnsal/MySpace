import { Response } from "express";
import { IAdminFacilityService } from "../../../services/interface/admin/facility.service.interface";
import { AppError } from "../../../utils/error";
import Container, { Service } from "typedi";
import { adminFacilityService } from "../../../services/implements/admin/facility.service";
import { AuthRequset } from "../../../types/api";
import { HttpStatus } from "../../../enums/http.status";

@Service()
export class AdminFacilityController {
  private adminFacilityService: IAdminFacilityService;

  constructor() {
    this.adminFacilityService = adminFacilityService;
  }

  //  Admin create facility :-

  async createFacility(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const formData = req.body;
      const { name, price, description } = formData;

      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", HttpStatus.UNAUTHORIZED);
      }

      if (!name) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Name is required" });
      }
      if (!price) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Price is required" });
      }
      if (!description) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Description is required" });
      }

      const facility = await this.adminFacilityService.createFacility(formData);

      return res.status(HttpStatus.CREATED).json({
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
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to create facility",
      });
    }
  }

  //  Find all facility :-

  async findAllFacilities(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", HttpStatus.FORBIDDEN);
      }

      const facilities = await this.adminFacilityService.findAllFacilities();

      return res.status(HttpStatus.OK).json({
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
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch facilities",
      });
    }
  }

  //  Find single facility :-

  async getFacilityById(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", HttpStatus.FORBIDDEN);
      }

      const { facilityId } = req.params;
      const facility = await this.adminFacilityService.findFacilityById(
        facilityId
      );

      return res.status(HttpStatus.OK).json({
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
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to fetch facility",
      });
    }
  }

  //  Update facility status :-

  async updateFacilityStatus(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", HttpStatus.FORBIDDEN);
      }

      const { facilityId, status } = req.body;
      const result = await this.adminFacilityService.updateFacilityStatus({
        facilityId,
        status,
      });

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update facility status",
      });
    }
  }

  //  Update facility :-

  async updateFacility(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const adminId = req.user?.id;

      if (!adminId) {
        throw new AppError("Admin not authenticated", HttpStatus.FORBIDDEN);
      }

      const { facilityId } = req.params;
      const { name, price, description } = req.body;

      if (!name) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Name is required" });
      }
      if (!price) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Price is required" });
      }
      if (!description) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: "Description is required" });
      }

      const result = await this.adminFacilityService.updateFacility(
        facilityId,
        { name, price, description }
      );

      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to update facility",
      });
    }
  }

  //  Delete facility :-

  async deleteFacility(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const adminId = req.user?.id;
      if (!adminId) {
        throw new AppError("Admin not authenticated", HttpStatus.FORBIDDEN);
      }

      const { facilityId } = req.params;

      const result = await this.adminFacilityService.deleteFacility(facilityId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      console.error("Controller error details:", error);
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to delete facility",
      });
    }
  }
}

export const adminFacilityController = Container.get(AdminFacilityController);
