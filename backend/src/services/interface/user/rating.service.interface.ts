import { CreateRatingDTO, RatingResponseDTO, HostelRatingsResponseDTO } from "../../../dtos/user/rating.dto";
import { IRating } from "../../../models/rating.model";

export interface IRatingService {
  createRating(userId: string, data: CreateRatingDTO): Promise<IRating>;
  getHostelRatings(hostelId: string): Promise<HostelRatingsResponseDTO>;
  getUserRating(
    userId: string,
    hostelId: string,
    bookingId: string
  ): Promise<RatingResponseDTO | null>;
}
