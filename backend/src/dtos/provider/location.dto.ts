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
