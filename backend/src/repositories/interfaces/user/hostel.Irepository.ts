import { IHostel } from "../../../models/provider/hostel.model";
import { HostelFilters } from "../../../types/filters";

export interface IHostelRepository {
  getHostelById(hostelId: string): Promise<IHostel | null>;
  getVerifiedHostels(filters: HostelFilters): Promise<IHostel[]>;
}
