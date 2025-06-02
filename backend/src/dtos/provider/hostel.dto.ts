import mongoose, { ObjectId } from "mongoose";

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
    latitude: number;
    longitude: number;
    address: string;
  };
  provider_id: {
    _id: string;
    fullName: string;
    email: string;
  };
  facilities: {
    _id: string;
    name: string;
    description: string;
    status: boolean;
  }[];
  is_verified: boolean;
  is_rejected: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateHostelDTO {
  hostel_name: string;
  monthly_rent: number;
  deposit_amount: number;
  deposit_terms: string[];
  maximum_occupancy: number;
  rules: string;
  gender: string;
  total_space: number;
  photos: string[];
  amenities: string[];
  description: string;
  location: {
    _id: string;
    latitude: number;
    longitude: number;
    address: string;
  };
  provider_id: string;
  facilities: string[];
}

export interface UpdateHostelDTO {
  hostel_name?: string;
  monthly_rent?: number;
  deposit_amount?: number;
  deposit_terms?: string[];
  maximum_occupancy?: number;
  rules?: string;
  gender?: string;
  total_space?: number;
  photos?: string[];
  amenities?: string[];
  description?: string;
  location?: {
    _id : string
    latitude: number;
    longitude: number;
    address: string;
  };
  facilities?: string[];
}
