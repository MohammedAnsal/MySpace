import { IHostel } from "../../../models/provider/hostel.model";
import { HostelFilters } from "../../../types/filters";

export type hostelResult = {
  success: boolean;
  message: string;
  data?: IHostel | IHostel[] | null;
};

export interface IHostelService {
  getHostelById(hostelId: string): Promise<hostelResult>;
  getVerifiedHostels(filters: HostelFilters): Promise<hostelResult>;
  getVerifiedHostelsForHome(): Promise<hostelResult>;
  getNearbyHostels(latitude: number, longitude: number, radius: number): Promise<hostelResult>
}
