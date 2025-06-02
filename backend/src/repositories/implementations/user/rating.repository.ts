import Container, { Service } from "typedi";
import { IRating, Rating } from "../../../models/rating.model";
import { IRatingRepository } from "../../interfaces/user/rating.Irepository";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../utils/error";

@Service()
export class RatingRepository implements IRatingRepository {
  async createRating(ratingData: Partial<IRating>): Promise<IRating> {
    try {
      const newRating = new Rating(ratingData);
      const savedRating = await newRating.save();

      return savedRating;
    } catch (error) {
      console.error("Error creating rating:", error);
      throw new AppError(
        "Failed to create rating record",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findRatingsByHostelId(hostelId: string): Promise<IRating[]> {
    try {
      const ratings = await Rating.find({ hostel_id: hostelId })
        .populate("user_id", "fullName profile_picture")
        .sort({ created_at: -1 });

      return ratings;
    } catch (error) {
      console.error("Error finding ratings:", error);
      throw new AppError(
        "Failed to fetch hostel ratings",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findRatingByUserAndHostel(
    userId: string,
    hostelId: string,
    bookingId: string
  ): Promise<IRating | null> {
    try {
      const existingRating = await Rating.findOne({
        user_id: userId,
        hostel_id: hostelId,
        booking_id: bookingId,
      }).populate("user_id", "fullName profile_picture");

      return existingRating;
    } catch (error) {
      console.error("Error finding rating:", error);
      throw new AppError(
        "Failed to check existing rating",
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const ratingRepository = Container.get(RatingRepository);
