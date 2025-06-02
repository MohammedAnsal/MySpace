import { Request, Response } from "express";
import { Service } from "typedi";
import { washingService } from "../../../../services/implements/facility/washing/washing.service";
import { AppError } from "../../../../utils/error";
import { HttpStatus } from "../../../../enums/http.status";
import { AuthRequset } from "../../../../types/api";
import { IWashingService } from "../../../../services/interface/facility/washing/washing.service.interface";
import { Types } from "mongoose";

@Service()
export class WashingController {
  private washingService: IWashingService;

  constructor() {
    this.washingService = washingService;
  }

  async createWashingRequest(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          status: "error",
          message: "User not authenticated",
        });
        return;
      }

      const {
        providerId,
        hostelId,
        facilityId,
        requestedDate,
        preferredTimeSlot,
        itemsCount,
        specialInstructions,
      } = req.body;

      if (
        !providerId ||
        !hostelId ||
        !facilityId ||
        !requestedDate ||
        !preferredTimeSlot ||
        !itemsCount
      ) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Missing required fields",
        });
        return;
      }

      const washingData = {
        userId,
        providerId,
        hostelId,
        facilityId,
        requestedDate,
        preferredTimeSlot,
        itemsCount,
        specialInstructions,
      };

      const newRequest = await this.washingService.createWashingRequest(
        userId,
        washingData
      );

      res.status(HttpStatus.CREATED).json({
        status: "success",
        message: "Washing request created successfully",
        data: newRequest,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async getUserWashingRequests(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          status: "error",
          message: "User not authenticated",
        });
        return;
      }

      const requests = await this.washingService.getUserWashingRequests(userId);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: requests,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async getProviderWashingRequests(
    req: AuthRequset,
    res: Response
  ): Promise<void> {
    try {
      const providerId = req.user?.id;
      if (!providerId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          status: "error",
          message: "Provider not authenticated",
        });
        return;
      }

      const requests = await this.washingService.getProviderWashingRequests(
        providerId
      );

      res.status(HttpStatus.OK).json({
        status: "success",
        data: requests,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async getWashingRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Request ID is required",
        });
        return;
      }

      const request = await this.washingService.getWashingRequestById(id);

      res.status(HttpStatus.OK).json({
        status: "success",
        data: request,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async updateWashingRequestStatus(
    req: AuthRequset,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const providerId = req.user?.id;

      if (!providerId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          status: "error",
          message: "Provider not authenticated",
        });
        return;
      }

      if (!id || !status) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Request ID and status are required",
        });
        return;
      }

      // Validate status value
      const validStatuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ];
      if (!validStatuses.includes(status)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid status value",
        });
        return;
      }

      const updatedRequest =
        await this.washingService.updateWashingRequestStatus(id, status);

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Washing request status updated successfully",
        data: updatedRequest,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async cancelWashingRequest(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      console.log(id);
      console.log(userId);

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          status: "error",
          message: "User not authenticated",
        });
        return;
      }

      if (!id) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Request ID is required",
        });
        return;
      }

      const cancelledRequest = await this.washingService.cancelWashingRequest(
        id,
        userId
      );

      res.status(HttpStatus.OK).json({
        status: true,
        message: "Washing request cancelled successfully",
        data: cancelledRequest,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  async addFeedback(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({
          status: "error",
          message: "User not authenticated",
        });
        return;
      }

      if (!id || !rating) {
        res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Request ID and rating are required",
        });
        return;
      }

      const updatedRequest = await this.washingService.addFeedback(id, userId, {
        rating,
        comment,
      });

      res.status(HttpStatus.OK).json({
        status: "success",
        message: "Feedback added successfully",
        data: updatedRequest,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
}

export const washingController = new WashingController();
