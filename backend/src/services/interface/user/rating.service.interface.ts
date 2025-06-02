import { CreateRatingDTO, RatingResponseDTO, HostelRatingsResponseDTO } from "../../../dtos/user/rating.dto";

export interface IRatingService {
  createRating(userId: string, data: CreateRatingDTO): Promise<RatingResponseDTO>;
  getHostelRatings(hostelId: string): Promise<HostelRatingsResponseDTO>;
  getUserRating(userId: string, hostelId: string, bookingId: string): Promise<RatingResponseDTO | null>;
}
