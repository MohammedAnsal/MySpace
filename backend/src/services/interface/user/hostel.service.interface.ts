import { HostelResponseDTO, HostelFiltersDTO } from "../../../dtos/user/hostel.dto";

export type hostelResult = {
  success: boolean;
  message: string;
  data?: HostelResponseDTO | HostelResponseDTO[] | null;
};

export interface IHostelService {
  getHostelById(hostelId: string): Promise<hostelResult>;
  getVerifiedHostels(filters: HostelFiltersDTO): Promise<hostelResult>;
  getVerifiedHostelsForHome(): Promise<hostelResult>;
  getNearbyHostels(latitude: number, longitude: number, radius: number): Promise<hostelResult>;
}
