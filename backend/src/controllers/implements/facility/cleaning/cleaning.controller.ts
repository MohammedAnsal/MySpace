import Container, { Service } from "typedi";
import { cleaningService } from "../../../../services/implements/facility/cleaning/cleaning.service";
import { ICleaningService } from "../../../../services/interface/facility/cleaning/cleaning.service.interface";
import { Request, Response } from "express";
import { AppError } from "../../../../utils/error";
import { AuthRequset } from "../../../../types/api";
import { HttpStatus } from "../../../../enums/http.status";

@Service()
export class CleaningController {
  private cleaningService: ICleaningService;

  constructor() {
    this.cleaningService = cleaningService;
  }

  //  Create Cleaning :-

  async createCleaningRequest(req: AuthRequset, res: Response) {
    try {
      const {
        providerId,
        hostelId,
        facilityId,
        requestedDate,
        preferredTimeSlot,
        specialInstructions,
      } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      if (!providerId || !hostelId || !requestedDate || !preferredTimeSlot) {
        throw new AppError("Missing required fields", HttpStatus.BAD_REQUEST);
      }

      const result = await this.cleaningService.createCleaningRequest(userId, {
        providerId,
        hostelId,
        facilityId,
        requestedDate,
        preferredTimeSlot,
        specialInstructions,
      });

      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get user cleaning req :-

  async getUserCleaningRequests(req: AuthRequset, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      const result = await this.cleaningService.getUserCleaningRequests(userId);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get single cleaning req :-

  async getCleaningRequestById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await this.cleaningService.getCleaningRequestById(id);
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Update cleaning req :-

  async updateCleaningRequestStatus(req: AuthRequset, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new AppError("Status is required", HttpStatus.BAD_REQUEST);
      }

      const result = await this.cleaningService.updateCleaningRequestStatus(
        id,
        { status }
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Cancel cleaning req :-

  async cancelCleaningRequest(req: AuthRequset, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", HttpStatus.UNAUTHORIZED);
      }

      const result = await this.cleaningService.cancelCleaningRequest(
        id,
        userId
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }

  //  Get provider cleaning req :-

  async getProviderCleaningRequests(req: AuthRequset, res: Response) {
    try {
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError("Provider not authenticated", HttpStatus.UNAUTHORIZED);
      }

      const result = await this.cleaningService.getProviderCleaningRequests(
        providerId
      );
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      } else {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Internal server error",
        });
      }
    }
  }
}

export const cleaningController = Container.get(CleaningController);
