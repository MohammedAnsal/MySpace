import { Service } from "typedi";
import { ILocation } from "../../../models/provider/location.model";
import { locationRepository } from "../../../repositories/implementations/provider/location.repository";
import { ILocationRepository } from "../../../repositories/interfaces/provider/location.Irepository";
import { locationResult, ILocationService } from "../../interface/provider/location.service.interface";
import { AppError } from "../../../utils/error";
import { HttpStatus } from "../../../enums/http.status";
import { Container } from "typedi";

@Service()
class LocationService implements ILocationService {
    private locationRepositoryy: ILocationRepository;

    constructor(locationRepositoryy: ILocationRepository) {
        this.locationRepositoryy = locationRepository;
    }
    
    async createLocation(locationData: Partial<ILocation>): Promise<locationResult> {
        try {
            const { latitude, longitude, address } = locationData;

            if (!latitude || !longitude || !address) {
                throw new AppError("Missing location details", HttpStatus.BAD_REQUEST);
            }

            const location = await this.locationRepositoryy.createLocation(locationData);

            return {
                success: true,
                message: "Location created successfully",
                locationData: location
            };
            
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to create location",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async updateLocation(locationId: string, locationData: Partial<ILocation>): Promise<locationResult> {
        try {
            if (!locationId) {
                throw new AppError("Location ID is required", HttpStatus.BAD_REQUEST);
            }

            const { latitude, longitude, address } = locationData;

            if (!latitude || !longitude || !address) {
                throw new AppError("Missing location details", HttpStatus.BAD_REQUEST);
            }

            const location = await this.locationRepositoryy.updateLocation(locationId, locationData);

            if (!location) {
                throw new AppError("Location not found", HttpStatus.NOT_FOUND);
            }

            return {
                success: true,
                message: "Location updated successfully",
                locationData: location
            };
            
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(
                "Failed to update location",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}

export const locationService = Container.get(LocationService);
