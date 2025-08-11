import mongoose from "mongoose";
import { IHostel } from "../../models/provider/hostel.model";

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
  property_proof: string; // NEW
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
  property_proof?: string; // NEW (optional on create)
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
    _id: string;
    latitude: number;
    longitude: number;
    address: string;
  };
  facilities?: string[];
}

interface PopulatedLocation {
  _id: mongoose.Types.ObjectId | string;
  latitude: number;
  longitude: number;
  address: string;
}

interface PopulatedProvider {
  _id: mongoose.Types.ObjectId | string;
  fullName: string;
  email: string;
}

interface PopulatedFacility {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  description: string;
  status: boolean;
}

/**
 * Maps an IHostel document to a HostelResponseDTO.
 */
export function mapToHostelDTO(hostel: IHostel): HostelResponseDTO {
  
  function isPopulatedLocation(obj: unknown): obj is PopulatedLocation {
    return (
      !!obj &&
      typeof (obj as PopulatedLocation).latitude === "number" &&
      typeof (obj as PopulatedLocation).longitude === "number" &&
      typeof (obj as PopulatedLocation).address === "string"
    );
  }
  function isPopulatedProvider(obj: unknown): obj is PopulatedProvider {
    return (
      !!obj &&
      typeof (obj as PopulatedProvider).fullName === "string" &&
      typeof (obj as PopulatedProvider).email === "string"
    );
  }
  function isPopulatedFacility(obj: unknown): obj is PopulatedFacility {
    return (
      !!obj &&
      typeof (obj as PopulatedFacility).name === "string" &&
      typeof (obj as PopulatedFacility).description === "string" &&
      typeof (obj as PopulatedFacility).status === "boolean"
    );
  }

  return {
    _id: (hostel._id as mongoose.Types.ObjectId).toString(),
    hostel_name: hostel.hostel_name || "",
    monthly_rent: hostel.monthly_rent || 0,
    deposit_amount: hostel.deposit_amount || 0,
    deposit_terms: hostel.deposit_terms || [],
    maximum_occupancy: hostel.maximum_occupancy || 0,
    rules: hostel.rules || "",
    gender: hostel.gender || "",
    available_space: hostel.available_space || 0,
    total_space: hostel.total_space || 0,
    status: hostel.status || false,
    photos: hostel.photos || [],
    amenities: hostel.amenities || [],
    description: hostel.description || "",
    property_proof: hostel.property_proof || "", // NEW
    location: isPopulatedLocation(hostel.location)
      ? {
          _id: hostel.location._id.toString(),
          latitude: hostel.location.latitude,
          longitude: hostel.location.longitude,
          address: hostel.location.address,
        }
      : {
          _id: "",
          latitude: 0,
          longitude: 0,
          address: "",
        },
    provider_id: isPopulatedProvider(hostel.provider_id)
      ? {
          _id: hostel.provider_id._id.toString(),
          fullName: hostel.provider_id.fullName,
          email: hostel.provider_id.email,
        }
      : {
          _id: "",
          fullName: "",
          email: "",
        },
    facilities: (hostel.facilities || []).map((facility) =>
      isPopulatedFacility(facility)
        ? {
            _id: facility._id.toString(),
            name: facility.name,
            description: facility.description,
            status: facility.status,
          }
        : {
            _id: "",
            name: "",
            description: "",
            status: false,
          }
    ),
    is_verified: hostel.is_verified,
    is_rejected: hostel.is_rejected,
    created_at: hostel.created_at || new Date(),
    updated_at: hostel.updated_at || new Date(),
  };
}
