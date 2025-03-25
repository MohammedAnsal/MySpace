import Container, { Service } from "typedi";
import { Location, ILocation } from "../../../models/provider/location.model";
import { ILocationRepository } from "../../interfaces/provider/location.Irepository";
@Service()
class LocationRepository implements ILocationRepository {
  async createLocation(locationData: Partial<ILocation>): Promise<ILocation> {
    try {
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
}

export const locationRepository = Container.get(LocationRepository);
