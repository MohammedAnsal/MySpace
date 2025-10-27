import Container, { Service } from "typedi";
import { IWashingService } from "../../../interface/facility/washing/washing.service.interface";
import {
  CreateWashingRequestDTO,
  UpdateWashingStatusDTO,
  WashingResponseDTO,
  WashingRequestDataDTO,
} from "../../../../dtos/facility/washing/washing.dto";
import { washingRepository } from "../../../../repositories/implementations/facility/washing/washing.repository";
import { AppError } from "../../../../utils/error";
import { HttpStatus } from "../../../../enums/http.status";
import { Types } from "mongoose";

@Service()
export class WashingService implements IWashingService {
  //  Create washing req :-

  async createWashingRequest(
    userId: string,
    data: CreateWashingRequestDTO
  ): Promise<WashingResponseDTO> {
    try {
      const requestedDate = new Date(data.requestedDate);
      const currentDate = new Date();

      if (requestedDate < currentDate) {
        throw new AppError(
          "Requested date must be in the future",
          HttpStatus.BAD_REQUEST
        );
      }

      if (!data.itemsCount || data.itemsCount <= 0) {
        throw new AppError(
          "Items count must be greater than zero",
          HttpStatus.BAD_REQUEST
        );
      }

      const requestData: WashingRequestDataDTO = {
        userId: new Types.ObjectId(userId),
        providerId: new Types.ObjectId(data.providerId),
        hostelId: new Types.ObjectId(data.hostelId),
        facilityId: new Types.ObjectId(data.facilityId),
        requestedDate,
        preferredTimeSlot: data.preferredTimeSlot,
        itemsCount: data.itemsCount,
        specialInstructions: data.specialInstructions,
        status: "Pending",
      };

      const newRequest = await washingRepository.createWashingRequest(
        requestData
      );
      return {
        success: true,
        message: "Washing request created successfully",
        data: newRequest,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create washing request",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get user washing req :-

  async getUserWashingRequests(userId: string): Promise<WashingResponseDTO> {
    try {
      const requests = await washingRepository.getUserWashingRequests(userId);
      return {
        success: true,
        message: "Washing requests retrieved successfully",
        data: requests,
      };
    } catch (error) {
      console.log(error)
      throw new AppError(
        "Failed to fetch washing requests",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get provider washing req :-

  async getProviderWashingRequests(
    providerId: string
  ): Promise<WashingResponseDTO> {
    try {
      const requests = await washingRepository.getProviderWashingRequests(
        providerId
      );
      return {
        success: true,
        message: "Provider washing requests retrieved successfully",
        data: requests,
      };
    } catch (error) {
      console.log(error)
      throw new AppError(
        "Failed to fetch provider washing requests",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Get wahsing req byId :-

  async getWashingRequestById(id: string): Promise<WashingResponseDTO> {
    try {
      const request = await washingRepository.getWashingRequestById(id);
      if (!request) {
        throw new AppError("Washing request not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Washing request retrieved successfully",
        data: request,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch washing request",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Update washing req status :-

  async updateWashingRequestStatus(
    id: string,
    data: UpdateWashingStatusDTO
  ): Promise<WashingResponseDTO> {
    try {
      const request = await washingRepository.getWashingRequestById(id);
      if (!request) {
        throw new AppError("Washing request not found", HttpStatus.NOT_FOUND);
      }

      if (request.status === "Cancelled") {
        throw new AppError(
          "Cannot update a cancelled request",
          HttpStatus.BAD_REQUEST
        );
      }

      if (request.status === "Completed" && data.status !== "Completed") {
        throw new AppError(
          "Cannot change status once completed",
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedRequest = await washingRepository.updateWashingRequest(id, {
        status: data.status,
      });

      if (!updatedRequest) {
        throw new AppError(
          "Failed to update washing request status",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        success: true,
        message: "Washing request status updated successfully",
        data: updatedRequest,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update washing request status",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Cancel washing req :-

  async cancelWashingRequest(
    id: string,
    userId: string
  ): Promise<WashingResponseDTO> {
    try {
      const request = await washingRepository.getWashingRequestById(id);
      if (!request) {
        throw new AppError("Washing request not found", HttpStatus.NOT_FOUND);
      }

      if (request.userId._id.toString() !== userId) {
        throw new AppError(
          "Unauthorized to cancel this request",
          HttpStatus.FORBIDDEN
        );
      }

      if (request.status === "Completed") {
        throw new AppError(
          "Cannot cancel a completed request",
          HttpStatus.BAD_REQUEST
        );
      }

      if (request.status === "Cancelled") {
        throw new AppError(
          "Request is already cancelled",
          HttpStatus.BAD_REQUEST
        );
      }

      const cancelledRequest = await washingRepository.cancelWashingRequest(id);
      if (!cancelledRequest) {
        throw new AppError(
          "Failed to cancel washing request",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return {
        success: true,
        message: "Washing request cancelled successfully",
        data: cancelledRequest,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to cancel washing request",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const washingService = Container.get(WashingService);
