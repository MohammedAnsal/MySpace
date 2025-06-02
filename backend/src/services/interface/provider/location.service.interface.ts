import { LocationResponseDTO, CreateLocationDTO, UpdateLocationDTO } from "../../../dtos/provider/location.dto";

export type LocationResult = {
  locationData?: LocationResponseDTO | LocationResponseDTO[] | null;
  success: boolean;
  message: string;
};

export interface ILocationService {
  createLocation(locationData: CreateLocationDTO): Promise<LocationResult>;
  updateLocation(locationId: string, locationData: UpdateLocationDTO): Promise<LocationResult>;
}
