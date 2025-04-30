import { IRating } from "../../../models/rating.model";

export interface IRatingService {
  createRating(userId: string, ratingData: any): Promise<IRating>;
  getHostelRatings(hostelId: string): Promise<{
    ratings: IRating[];
    averageRating: number;
    totalRatings: number;
  }>;
  getUserRating(
    userId: string,
    hostelId: string,
    bookingId: string
  ): Promise<IRating | null>;
}
