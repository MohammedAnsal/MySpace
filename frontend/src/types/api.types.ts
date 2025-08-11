export interface HostelFilters {
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  amenities?: string[];
  search?: string;
  sortBy?: "asc" | "desc";
  minRating?: number;
  sortByRating?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Hostel {
  reason: string;
  is_rejected: boolean;
  _id: string;
  hostel_name: string;
  photos: string[];
  gender: string;
  monthly_rent: number;
  property_proof: string; // NEW
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  provider_id: {
    fullName: string;
    email: string;
    phone: string;
  };
  amenities: string[];
  description: string;
  available_space: number;
  total_space: number;
  deposit_amount: number;
  is_verified: boolean;
  maximum_occupancy: number;
  facilities: Array<{
    name: string;
    price: number;
    description: string;
  }>;
}
