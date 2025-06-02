export interface CreateRatingDTO {
  hostel_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
}

export interface RatingResponseDTO {
  _id: string;
  user_id: {
    _id: string;
    fullName?: string;
    profile_picture?: string;
  };
  hostel_id: string;
  booking_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
}

export interface HostelRatingsResponseDTO {
  ratings: RatingResponseDTO[];
  averageRating: number;
  totalRatings: number;
}
