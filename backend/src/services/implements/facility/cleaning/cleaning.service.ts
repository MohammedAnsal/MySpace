import Container, { Service } from "typedi";
import { ICleaningService } from "../../../interface/facility/cleaning/cleaning.service.interface";
import { ICleaningRepository } from "../../../../repositories/interfaces/facility/cleaning/cleaning.Irepository";
import { cleaningRepository } from "../../../../repositories/implementations/facility/cleaning/cleaning.repository";
import { AppError } from "../../../../utils/error";
import { Types } from "mongoose";

@Service()
export class CleaningService implements ICleaningService {
  private cleaningRepo: ICleaningRepository;

  constructor() {
    this.cleaningRepo = cleaningRepository;
  }

  async createCleaningRequest(
    userId: string,
    providerId: string,
    hostelId: string,
    facilityId: string,
    requestedDate: string,
    preferredTimeSlot: string,
    specialInstructions?: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const requestData = {
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(providerId),
        hostelId: new Types.ObjectId(hostelId),
        facilityId: new Types.ObjectId(facilityId),
        requestedDate: new Date(requestedDate),
        preferredTimeSlot,
        specialInstructions,
      };

      const cleaningRequest = await this.cleaningRepo.createCleaningRequest(
        requestData
      );

      return {
        success: true,
        message: "Cleaning request created successfully",
        data: cleaningRequest,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while creating the cleaning request",
        500
      );
    }
  }

  async getUserCleaningRequests(
    userId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const cleaningRequests = await this.cleaningRepo.getUserCleaningRequests(
        userId
      );

      return {
        success: true,
        message: "Cleaning requests retrieved successfully",
        data: cleaningRequests,
      };
    } catch (error) {
      throw new AppError(
        "An error occurred while retrieving cleaning requests",
        500
      );
    }
  }

  async getCleaningRequestById(
    requestId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const cleaningRequest = await this.cleaningRepo.getCleaningRequestById(
        requestId
      );

      if (!cleaningRequest) {
        throw new AppError("Cleaning request not found", 404);
      }

      return {
        success: true,
        message: "Cleaning request retrieved successfully",
        data: cleaningRequest,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while retrieving the cleaning request",
        500
      );
    }
  }

  async updateCleaningRequestStatus(
    requestId: string,
    status: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const validStatuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ];

      if (!validStatuses.includes(status)) {
        throw new AppError("Invalid status", 400);
      }

      const cleaningRequest =
        await this.cleaningRepo.updateCleaningRequestStatus(requestId, status);

      if (!cleaningRequest) {
        throw new AppError("Cleaning request not found", 404);
      }

      return {
        success: true,
        message: "Cleaning request status updated successfully",
        data: cleaningRequest,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while updating the cleaning request status",
        500
      );
    }
  }

  async cancelCleaningRequest(
    requestId: string,
    userId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Get the request to verify ownership
      const cleaningRequest = await this.cleaningRepo.getCleaningRequestById(
        requestId
      );

      if (!cleaningRequest) {
        throw new AppError("Cleaning request not found", 404);
      }

      const reqUser = cleaningRequest.userId._id;

      // Check if the user owns this request
      if (reqUser.toString() !== userId) {
        throw new AppError("Unauthorized to cancel this request", 403);
      }

      // Check if the request is already completed or cancelled
      if (
        cleaningRequest.status === "Completed" ||
        cleaningRequest.status === "Cancelled"
      ) {
        throw new AppError(
          "Cannot cancel a completed or already cancelled request",
          400
        );
      }

      const cancelledRequest = await this.cleaningRepo.cancelCleaningRequest(
        requestId
      );

      return {
        success: true,
        message: "Cleaning request cancelled successfully",
        data: cancelledRequest,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "An error occurred while cancelling the cleaning request",
        500
      );
    }
  }

  async getProviderCleaningRequests(
    providerId: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const cleaningRequests =
        await this.cleaningRepo.getProviderCleaningRequests(providerId);

      return {
        success: true,
        message: "Provider cleaning requests retrieved successfully",
        data: cleaningRequests,
      };
    } catch (error) {
      throw new AppError(
        "An error occurred while retrieving provider cleaning requests",
        500
      );
    }
  }

  async addFeedback(
    requestId: string,
    rating: number,
    comment?: string
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new AppError("Rating must be between 1 and 5", 400);
      }

      // Check if request exists and is completed
      const cleaningRequest = await this.cleaningRepo.getCleaningRequestById(
        requestId
      );

      if (!cleaningRequest) {
        throw new AppError("Cleaning request not found", 404);
      }

      if (cleaningRequest.status !== "Completed") {
        throw new AppError(
          "Feedback can only be added for completed cleaning requests",
          400
        );
      }

      const updatedRequest = await this.cleaningRepo.addFeedback(
        requestId,
        rating,
        comment
      );

      return {
        success: true,
        message: "Feedback added successfully",
        data: updatedRequest,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("An error occurred while adding feedback", 500);
    }
  }
}

export const cleaningService = Container.get(CleaningService);
