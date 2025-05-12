import Container, { Service } from "typedi";
import { IWashingService } from "../../../interface/facility/washing/washing.service.interface";
import { IWashing } from "../../../../models/facility/Washing/washing.model";
import { washingRepository } from "../../../../repositories/implementations/facility/washing/washing.repository";
import { AppError } from "../../../../utils/error";
import { HttpStatus } from "../../../../enums/http.status";

@Service()
export class WashingService implements IWashingService {
  async createWashingRequest(
    washingData: Partial<IWashing>
  ): Promise<IWashing> {
    try {
      // Validate the requested date is in the future
      const requestedDate = new Date(washingData.requestedDate as Date);
      const currentDate = new Date();

      if (requestedDate < currentDate) {
        throw new AppError(
          "Requested date must be in the future",
          HttpStatus.BAD_REQUEST
        );
      }

      // Validate items count
      if (!washingData.itemsCount || washingData.itemsCount <= 0) {
        throw new AppError(
          "Items count must be greater than zero",
          HttpStatus.BAD_REQUEST
        );
      }
      console.log(washingData);
      

      return await washingRepository.createWashingRequest(washingData);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create washing request",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserWashingRequests(userId: string): Promise<IWashing[]> {
    try {
      return await washingRepository.getUserWashingRequests(userId);
    } catch (error) {
      throw new AppError(
        "Failed to fetch washing requests",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getProviderWashingRequests(providerId: string): Promise<IWashing[]> {
    try {
      return await washingRepository.getProviderWashingRequests(providerId);
    } catch (error) {
      throw new AppError(
        "Failed to fetch provider washing requests",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getWashingRequestById(id: string): Promise<IWashing> {
    try {
      const request = await washingRepository.getWashingRequestById(id);
      if (!request) {
        throw new AppError("Washing request not found", HttpStatus.NOT_FOUND);
      }
      return request;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch washing request",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateWashingRequestStatus(
    id: string,
    status: "Pending" | "In Progress" | "Completed" | "Cancelled"
  ): Promise<IWashing> {
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

      if (request.status === "Completed" && status !== "Completed") {
        throw new AppError(
          "Cannot change status once completed",
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedRequest = await washingRepository.updateWashingRequest(id, {
        status,
      });
      if (!updatedRequest) {
        throw new AppError(
          "Failed to update washing request status",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return updatedRequest;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update washing request status",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelWashingRequest(id: string, userId: string): Promise<IWashing> {
    try {
      const request = await washingRepository.getWashingRequestById(id);
      if (!request) {
        throw new AppError("Washing request not found", HttpStatus.NOT_FOUND);
      }

      const reqUser = request.userId._id;

      // Verify this is the user's request
      if (reqUser.toString() !== userId) {
        throw new AppError(
          "Unauthorized to cancel this request",
          HttpStatus.FORBIDDEN
        );
      }

      // Check if the request can be cancelled
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

      return cancelledRequest;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to cancel washing request",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addFeedback(
    id: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<IWashing> {
    try {
      if (rating < 1 || rating > 5) {
        throw new AppError(
          "Rating must be between 1 and 5",
          HttpStatus.BAD_REQUEST
        );
      }

      const request = await washingRepository.getWashingRequestById(id);
      if (!request) {
        throw new AppError("Washing request not found", HttpStatus.NOT_FOUND);
      }

      // Verify this is the user's request
      if (request.userId.toString() !== userId) {
        throw new AppError(
          "Unauthorized to add feedback to this request",
          HttpStatus.FORBIDDEN
        );
      }

      // Check if the request is completed
      if (request.status !== "Completed") {
        throw new AppError(
          "Can only add feedback to completed requests",
          HttpStatus.BAD_REQUEST
        );
      }

      // Check if feedback already exists
      if (request.feedback && request.feedback.rating) {
        throw new AppError(
          "Feedback already exists for this request",
          HttpStatus.BAD_REQUEST
        );
      }

      const updatedRequest = await washingRepository.addFeedback(
        id,
        rating,
        comment
      );
      if (!updatedRequest) {
        throw new AppError(
          "Failed to add feedback",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return updatedRequest;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to add feedback",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const washingService = Container.get(WashingService);
