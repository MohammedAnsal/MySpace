import { Response } from "express";
import { AuthRequset } from "../../../types/api";
import { AppError } from "../../../utils/error";
import { StatusCodes } from "http-status-codes";
import { HttpStatus } from "../../../enums/http.status";
import { ratingService } from "../../../services/implements/user/rating.service";
import { IRatingService } from "../../../services/interface/user/rating.service.interface";
import Container, { Service } from "typedi";

@Service()
export class RatingController {
  private ratingService: IRatingService;

  constructor() {
    this.ratingService = ratingService;
  }

  async createRating(req: AuthRequset, res: Response): Promise<any> {
    try {
      const userId = req.user?.id;
      const ratingData = req.body;

      console.log(ratingData, "dataaa");

      if (!userId) {
        throw new AppError("User not authenticated", StatusCodes.UNAUTHORIZED);
      }

      const result = await this.ratingService.createRating(userId, ratingData);
      console.log(result, "finalll");

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: "Rating submitted successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res
          .status(error.statusCode)
          .json({ message: error.message, success: false });
      }
      console.error("Error in createRating:", error);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Internal server error" });
    }
  }

  async getHostelRatings(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }
      const { hostelId } = req.params;

      if (!hostelId) {
        throw new AppError("Hostel ID is required", StatusCodes.BAD_REQUEST);
      }

      const result = await this.ratingService.getHostelRatings(hostelId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Hostel ratings fetched successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error("Error in getHostelRatings:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  }

  async getUserRating(req: AuthRequset, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError("User not authenticated", 401);
      }
      const { hostelId, bookingId } = req.params;

      if (!hostelId || !userId) {
        throw new AppError(
          "Hostel ID and User ID are required",
          StatusCodes.BAD_REQUEST
        );
      }

      const existingRating = await this.ratingService.getUserRating(
        userId,
        hostelId,
        bookingId
      );

      console.log(existingRating)

      res.status(StatusCodes.OK).json({
        success: true,
        message: existingRating ? "User rating found" : "No rating found",
        data: existingRating,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          success: false,
          message: error.message,
        });
      } else {
        console.error("Error in getUserRating:", error);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error",
        });
      }
    }
  }
}

export const ratingController = Container.get(RatingController);
