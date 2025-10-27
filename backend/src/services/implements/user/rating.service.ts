import { StatusCodes } from "http-status-codes";
import { hostelRepository } from "../../../repositories/implementations/provider/hostel.repository";
import { ratingRepository } from "../../../repositories/implementations/user/rating.repository";
import { IHostelRepository } from "../../../repositories/interfaces/provider/hostel.Irepository";
import { IRatingRepository } from "../../../repositories/interfaces/user/rating.Irepository";
import { AppError } from "../../../utils/error";
import { IRatingService } from "../../interface/user/rating.service.interface";
import Container, { Service } from "typedi";
import mongoose, { Types } from "mongoose";
import { S3Service } from "../s3/s3.service";
import {
  HostelRatingsResponseDTO,
  RatingResponseDTO,
  CreateRatingDTO,
} from "../../../dtos/user/rating.dto";
import { IRating } from "../../../models/rating.model";

interface PopulatedUser {
  _id: Types.ObjectId;
  fullName: string;
  profile_picture?: string;
}

interface CreateRatingData {
  user_id: Types.ObjectId;
  hostel_id: Types.ObjectId;
  booking_id: Types.ObjectId;
  rating: number;
  comment?: string;
}

@Service()
export class RatingService implements IRatingService {
  private hostelRepo: IHostelRepository;
  private ratingRepo: IRatingRepository;

  constructor() {
    this.hostelRepo = hostelRepository;
    this.ratingRepo = ratingRepository;
  }

  //  Create rating :-

  async createRating(
    userId: string,
    ratingData: CreateRatingDTO
  ): Promise<IRating> {
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

      console.log(existingRating);

      const newRatingData: CreateRatingData = {
        user_id: new mongoose.Types.ObjectId(userId),
        hostel_id: new mongoose.Types.ObjectId(ratingData.hostel_id),
        booking_id: new mongoose.Types.ObjectId(ratingData.booking_id),
        rating: ratingData.rating,
        comment: ratingData.comment,
      };

      const savedRating = await this.ratingRepo.createRating(
        newRatingData as IRating
      );
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

  //  Get hostel's rating's :-

  async getHostelRatings(hostelId: string): Promise<HostelRatingsResponseDTO> {
    try {
      if (!hostelId) {
        throw new AppError("Hostel ID is required", StatusCodes.BAD_REQUEST);
      }

      const ratings = await this.ratingRepo.findRatingsByHostelId(hostelId);

      const processedRatings = await Promise.all(
        ratings.map(async (rating) => {
          const ratingObj = rating.toObject ? rating.toObject() : rating;

          if (
            ratingObj.user_id &&
            (ratingObj.user_id as PopulatedUser).profile_picture
          ) {
            try {
              (ratingObj.user_id as PopulatedUser).profile_picture =
                await S3Service.generateSignedUrl(
                  (ratingObj.user_id as PopulatedUser).profile_picture!
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
        ratings: processedRatings as RatingResponseDTO[],
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

  //  Get user rating's :-

  async getUserRating(
    userId: string,
    hostelId: string,
    bookingId: string
  ): Promise<RatingResponseDTO | null> {
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

      if (!existingRating) {
        return null;
      }

      // Transform IRating to RatingResponseDTO
      return {
        _id: (existingRating._id as Types.ObjectId).toString(),
        user_id: {
          _id: userId.toString(),
        },
        hostel_id: existingRating.hostel_id.toString(),
        booking_id: existingRating.booking_id.toString(),
        rating: existingRating.rating,
        comment: existingRating.comment,
        created_at: existingRating.created_at,
      };
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
