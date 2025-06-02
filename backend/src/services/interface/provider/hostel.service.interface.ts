import { HostelResponseDTO, CreateHostelDTO, UpdateHostelDTO } from "../../../dtos/provider/hostel.dto";

export type HostelResult = {
  hostelData?: HostelResponseDTO | HostelResponseDTO[] | null;
  success: boolean;
  message: string;
};

export interface IHostelService {
  createHostel(hostelData: CreateHostelDTO): Promise<HostelResult>;
  getAllHostels(providerId: string): Promise<HostelResult>;
  getHostelById(hostelId: string): Promise<HostelResult>;
  editHostelById(hostelId: string, updateData: UpdateHostelDTO): Promise<HostelResult>;
  deleteHostelById(hostelId: string): Promise<HostelResult>;
}
