import { StatusCodes } from "http-status-codes";
import { IRating } from "../../../models/rating.model";
import { hostelRepository } from "../../../repositories/implementations/provider/hostel.repository";
import { ratingRepository } from "../../../repositories/implementations/user/rating.repository";
import { IHostelRepository } from "../../../repositories/interfaces/provider/hostel.Irepository";
import { IRatingRepository } from "../../../repositories/interfaces/user/rating.Irepository";
import { AppError } from "../../../utils/error";
import { IRatingService } from "../../interface/user/rating.service.interface";
import Container, { Service } from "typedi";
import mongoose from "mongoose";
import { S3Service } from "../s3/s3.service";

@Service()
export class RatingService implements IRatingService {
  private hostelRepo: IHostelRepository;
  private ratingRepo: IRatingRepository;

  constructor() {
    this.hostelRepo = hostelRepository;
    this.ratingRepo = ratingRepository;
  }

  async createRating(userId: string, ratingData: any): Promise<any> {
    try {
      if (!ratingData.hostel_id || !ratingData.rating) {
        throw new AppError(
          "Hostel ID and rating are required",
          StatusCodes.BAD_REQUEST
        );
      }

      if (ratingData.rating < 1 || ratingData.rating > 5) {
        throw new AppError(
          "Rating must be between 1 and 5",
          StatusCodes.BAD_REQUEST
        );
      }

      const hostel = await this.hostelRepo.findHostelById(ratingData.hostel_id);
      if (!hostel) {
        throw new AppError("Hostel not found", StatusCodes.NOT_FOUND);
      }

      const existingRating = await this.ratingRepo.findRatingByUserAndHostel(
        userId,
        ratingData.hostel_id,
        ratingData.booking_id
      );

      if (existingRating) {
        throw new AppError(
          "You have already rated this hostel",
          StatusCodes.CONFLICT
        );
      }

      const newRatingData = {
        user_id: new mongoose.Types.ObjectId(userId),
        hostel_id: new mongoose.Types.ObjectId(ratingData.hostel_id),
        booking_id: new mongoose.Types.ObjectId(ratingData.booking_id),
        rating: ratingData.rating,
        comment: ratingData.comment || undefined,
      } as any;

      const savedRating = await this.ratingRepo.createRating(newRatingData);
      return savedRating;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error("Error in rating service:", error);
      throw new AppError(
        "Error creating rating",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getHostelRatings(hostelId: string): Promise<{
    ratings: IRating[];
    averageRating: number;
    totalRatings: number;
  }> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", StatusCodes.BAD_REQUEST);
      }

      const ratings = await this.ratingRepo.findRatingsByHostelId(hostelId);

      const processedRatings = await Promise.all(
        ratings.map(async (rating) => {
          const ratingObj = rating.toObject ? rating.toObject() : rating;

          if (ratingObj.user_id && ratingObj.user_id.profile_picture) {
            try {
              ratingObj.user_id.profile_picture =
                await S3Service.generateSignedUrl(
                  ratingObj.user_id.profile_picture
                );
            } catch (err) {
              console.error(
                "Error generating signed URL for profile image:",
                err
              );
            }
          }
          return ratingObj;
        })
      );

      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            totalRatings
          : 0;

      return {
        ratings: processedRatings,
        averageRating: Math.round(averageRating * 10) / 10,
        totalRatings,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching hostel ratings",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getUserRating(
    userId: string,
    hostelId: string,
    bookingId: string
  ): Promise<IRating | null> {
    try {
      if (!userId || !hostelId || !bookingId) {
        throw new AppError(
          "User ID and Hostel ID and Booking ID are required",
          StatusCodes.BAD_REQUEST
        );
      }

      const existingRating = await this.ratingRepo.findRatingByUserAndHostel(
        userId,
        hostelId,
        bookingId
      );
      return existingRating;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(
        "Error fetching user rating",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const ratingService = Container.get(RatingService);
