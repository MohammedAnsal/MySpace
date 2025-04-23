import { IRating } from "../../../models/rating.model";

export interface IRatingRepository {
  createRating(ratingData: Partial<IRating>): Promise<IRating>;
  findRatingsByHostelId(hostelId: string): Promise<IRating[]>;
  findRatingByUserAndHostel(
    userId: string,
    hostelId: string
  ): Promise<IRating | null>;
}
