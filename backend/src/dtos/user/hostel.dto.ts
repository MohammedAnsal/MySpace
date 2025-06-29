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

export function mapToHostelDTO(hostel: any): HostelResponseDTO {
  return {
    _id: hostel._id.toString(),
    hostel_name: hostel.hostel_name,
    monthly_rent: hostel.monthly_rent,
    deposit_amount: hostel.deposit_amount,
    deposit_terms: hostel.deposit_terms,
    maximum_occupancy: hostel.maximum_occupancy,
    rules: hostel.rules,
    gender: hostel.gender,
    available_space: hostel.available_space,
    total_space: hostel.total_space,
    status: hostel.status,
    photos: hostel.photos,
    amenities: hostel.amenities,
    description: hostel.description,
    location: hostel.location,
    provider_id: hostel.provider_id,
    facilities: hostel.facilities,
    is_verified: hostel.is_verified,
    is_rejected: hostel.is_rejected,
    reason: hostel.reason,
    created_at: hostel.createdAt,
    updated_at: hostel.updatedAt,
    averageRating: hostel.averageRating || 0,
    ratingCount: hostel.ratingCount || 0,
  };
}
