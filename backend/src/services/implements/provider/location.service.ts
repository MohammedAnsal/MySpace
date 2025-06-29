import { Service } from "typedi";
import { locationRepository } from "../../../repositories/implementations/provider/location.repository";
import { ILocationRepository } from "../../../repositories/interfaces/provider/location.Irepository";
import {
  LocationResult,
  ILocationService,
} from "../../interface/provider/location.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { Container } from "typedi";
import {
  CreateLocationDTO,
  UpdateLocationDTO,
  mapToLocationDTO,
} from "../../../dtos/provider/location.dto";

@Service()
class LocationService implements ILocationService {
  private locationRepositoryy: ILocationRepository;

  constructor() {
    this.locationRepositoryy = locationRepository;
  }

  //  Create location :-

  async createLocation(
    locationData: CreateLocationDTO
  ): Promise<LocationResult> {
    try {
      const { latitude, longitude, address } = locationData;

      if (!latitude || !longitude || !address) {
        throw new AppError("Missing location details", HttpStatus.BAD_REQUEST);
      }

      const location = await this.locationRepositoryy.createLocation(
        locationData
      );
      return {
        success: true,
        message: "Location created successfully",
        locationData: mapToLocationDTO(location),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create location",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  //  Update location :-

  async updateLocation(
    locationId: string,
    locationData: UpdateLocationDTO
  ): Promise<LocationResult> {
    try {
      if (!locationId) {
        throw new AppError("Location ID is required", HttpStatus.BAD_REQUEST);
      }

      const { latitude, longitude, address } = locationData;
      if (!latitude || !longitude || !address) {
        throw new AppError("Missing location details", HttpStatus.BAD_REQUEST);
      }

      const location = await this.locationRepositoryy.updateLocation(
        locationId,
        locationData
      );
      if (!location) {
        throw new AppError("Location not found", HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: "Location updated successfully",
        locationData: mapToLocationDTO(location),
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update location",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const locationService = Container.get(LocationService);
