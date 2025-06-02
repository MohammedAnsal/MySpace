export interface HostelResponseDTO {
  _id: string;
  hostel_name: string;
  monthly_rent: number;
  deposit_amount: number;
  deposit_terms: string[];
  maximum_occupancy: number;
  rules: string;
  gender: string;
  available_space: number;
  total_space: number;
  status: boolean;
  photos: string[];
  amenities: string[];
  description: string;
  location: {
    _id: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    latitude: number;
    longitude: number;
  };
  provider_id: {
    _id: string;
    fullName: string;
    email: string;
  };
  facilities: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  is_verified: boolean;
  is_rejected: boolean;
  reason: string;
  created_at: Date;
  updated_at: Date;
  averageRating: number;
  ratingCount: number;
}

export interface HostelFiltersDTO {
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  amenities?: string[];
  search?: string;
  sortBy?: "asc" | "desc";
  minRating?: number;
  sortByRating?: boolean;
}
