import { ILocation } from "../../../models/provider/location.model";

export type locationResult = {
  locationData?: ILocation | ILocation[] | null;
  success: boolean;
  message: string;
};

export interface ILocationService {
  createLocation(locationData: Partial<ILocation>): Promise<locationResult>;
}
