import Container, { Service } from "typedi";
import { Location, ILocation } from "../../../models/provider/location.model";
import { ILocationRepository } from "../../interfaces/provider/location.Irepository";

@Service()
class LocationRepository implements ILocationRepository {
  async createLocation(locationData: Partial<ILocation>): Promise<ILocation> {
    try {
      if (locationData.latitude && locationData.longitude) {
        locationData.location = {
          type: "Point",
          coordinates: [locationData.longitude, locationData.latitude],
        };
      }

      return await Location.create(locationData);
    } catch (error) {
      console.error("Error creating location:", error);
      throw new Error("Failed to create location");
    }
  }

  async findLocationById(locationId: string): Promise<ILocation | null> {
    try {
      return await Location.findById(locationId);
    } catch (error) {
      console.error("Error finding location:", error);
      throw new Error("Failed to find location");
    }
  }

  async updateLocation(
    locationId: string,
    locationData: Partial<ILocation>
  ): Promise<ILocation | null> {
    try {
      if (locationData.latitude && locationData.longitude) {
        locationData.location = {
          type: "Point",
          coordinates: [locationData.longitude, locationData.latitude],
        };
      }

      return await Location.findByIdAndUpdate(
        locationId,
        { $set: locationData },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating location:", error);
      throw new Error("Failed to update location");
    }
  }
}

export const locationRepository = Container.get(LocationRepository);
