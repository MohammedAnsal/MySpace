import { IHostel } from "../../../models/provider/hostel.model";
import { HostelFilters } from "../../../types/filters";

export interface IHostelRepository {
  getHostelById(hostelId: string): Promise<IHostel | null>;
  findHostelByIdUnPopulated(hostelId: string): Promise<IHostel | null>
  getVerifiedHostelsForHome(): Promise<IHostel[]>;
  getVerifiedHostels(filters: HostelFilters): Promise<IHostel[]>;
  updateHostelAvailableSpace(hostelId: string): Promise<IHostel | null>
  getNearbyHostels(latitude: number, longitude: number, maxDistance: number): Promise<IHostel[]>;
}
