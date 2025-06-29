import { ILocation } from "../../models/provider/location.model";

export interface LocationResponseDTO {
  _id: string;
  latitude: number;
  longitude: number;
  address: string;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  created_at: Date;
  updated_at: Date;
}

export interface CreateLocationDTO {
  latitude: number;
  longitude: number;
  address: string;
}

export interface UpdateLocationDTO {
  latitude?: number;
  longitude?: number;
  address?: string;
}

export function mapToLocationDTO(location: ILocation): LocationResponseDTO {
  return {
    _id: location._id.toString(),
    latitude: location.latitude,
    longitude: location.longitude,
    address: location.address,
    location: location.location,
    created_at: location.created_at,
    updated_at: location.updated_at,
  };
}
