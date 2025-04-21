import { ILocation } from "../../../models/provider/location.model";

export interface ILocationRepository {
  createLocation(locationData: Partial<ILocation>): Promise<ILocation>;
  findLocationById(locationId: string): Promise<ILocation | null>;
  updateLocation(locationId: string, locationData: Partial<ILocation>): Promise<ILocation | null>;
}
