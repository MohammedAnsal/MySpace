import Container, { Service } from "typedi";
import { cleaningService } from "../../../../services/implements/facility/cleaning/cleaning.service";
import { ICleaningService } from "../../../../services/interface/facility/cleaning/cleaning.service.interface";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../../utils/error";
import { AuthRequset } from "../../../../types/api";

@Service()
export class CleaningController {
  private cleaningService: ICleaningService;

  constructor() {
    this.cleaningService = cleaningService;
  }

  async createCleaningRequest(
    req: AuthRequset,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        providerId,
        hostelId,
        facilityId,
        requestedDate,
        preferredTimeSlot,
        specialInstructions,
      } = req.body;

      // Get userId from authenticated user
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      // Validate required fields
      if (!providerId || !hostelId || !requestedDate || !preferredTimeSlot) {
        throw new AppError("Missing required fields", 400);
      }

      const result = await this.cleaningService.createCleaningRequest(userId, {
        providerId,
        hostelId,
        facilityId,
        requestedDate,
        preferredTimeSlot,
        specialInstructions,
      });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserCleaningRequests(
    req: AuthRequset,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const result = await this.cleaningService.getUserCleaningRequests(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getCleaningRequestById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;

      const result = await this.cleaningService.getCleaningRequestById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateCleaningRequestStatus(
    req: AuthRequset,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      console.log(id);
      console.log(status);

      if (!status) {
        throw new AppError("Status is required", 400);
      }

      const result = await this.cleaningService.updateCleaningRequestStatus(
        id,
        { status }
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelCleaningRequest(
    req: AuthRequset,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }

      const result = await this.cleaningService.cancelCleaningRequest(
        id,
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProviderCleaningRequests(
    req: AuthRequset,
    res: Response,
    next: NextFunction
  ) {
    try {
      const providerId = req.user?.id;

      if (!providerId) {
        throw new AppError("Provider not authenticated", 401);
      }

      const result = await this.cleaningService.getProviderCleaningRequests(
        providerId
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async addFeedback(req: AuthRequset, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      if (!rating) {
        throw new AppError("Rating is required", 400);
      }

      const result = await this.cleaningService.addFeedback(id, {
        rating,
        comment,
      });
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const cleaningController = Container.get(CleaningController);
