import Container, { Service } from "typedi";
import { ICleaningService } from "../../../interface/facility/cleaning/cleaning.service.interface";
import {
  CreateCleaningRequestDTO,
  UpdateCleaningStatusDTO,
  CleaningResponseDTO,
  CleaningRequestDataDTO,
} from "../../../../dtos/facility/cleaning/cleaning.dto";
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

  //  Create Cleaning :-

  async createCleaningRequest(
    userId: string,
    data: CreateCleaningRequestDTO
  ): Promise<CleaningResponseDTO> {
    try {
      const requestData: CleaningRequestDataDTO = {
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(data.providerId),
        hostelId: new Types.ObjectId(data.hostelId),
        facilityId: new Types.ObjectId(data.facilityId),
        requestedDate: new Date(data.requestedDate),
        preferredTimeSlot: data.preferredTimeSlot,
        specialInstructions: data.specialInstructions,
        status: "Pending",
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
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while creating the cleaning request",
        500
      );
    }
  }

  //  Get user cleaning req :-

  async getUserCleaningRequests(userId: string): Promise<CleaningResponseDTO> {
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

  //  Get single cleaning req :-

  async getCleaningRequestById(
    requestId: string
  ): Promise<CleaningResponseDTO> {
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
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while retrieving the cleaning request",
        500
      );
    }
  }

  //  Update cleaning req :-

  async updateCleaningRequestStatus(
    requestId: string,
    data: UpdateCleaningStatusDTO
  ): Promise<CleaningResponseDTO> {
    try {
      const validStatuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Cancelled",
      ];
      if (!validStatuses.includes(data.status)) {
        throw new AppError("Invalid status", 400);
      }

      const cleaningRequest =
        await this.cleaningRepo.updateCleaningRequestStatus(
          requestId,
          data.status
        );

      if (!cleaningRequest) {
        throw new AppError("Cleaning request not found", 404);
      }

      return {
        success: true,
        message: "Cleaning request status updated successfully",
        data: cleaningRequest,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while updating the cleaning request status",
        500
      );
    }
  }

  //  Cancel cleaning req :-

  async cancelCleaningRequest(
    requestId: string,
    userId: string
  ): Promise<CleaningResponseDTO> {
    try {
      const cleaningRequest = await this.cleaningRepo.getCleaningRequestById(
        requestId
      );
      if (!cleaningRequest) {
        throw new AppError("Cleaning request not found", 404);
      }

      if (cleaningRequest.userId._id.toString() !== userId) {
        throw new AppError("Unauthorized to cancel this request", 403);
      }

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
      if (error instanceof AppError) throw error;
      throw new AppError(
        "An error occurred while cancelling the cleaning request",
        500
      );
    }
  }

  //  Get provider cleaning req :-

  async getProviderCleaningRequests(
    providerId: string
  ): Promise<CleaningResponseDTO> {
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
}

export const cleaningService = Container.get(CleaningService);
