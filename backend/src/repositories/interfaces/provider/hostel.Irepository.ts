import { IHostel } from "../../../models/provider/hostel.model";

export interface IHostelRepository {
  createHostel(hosetlData: Partial<IHostel>): Promise<IHostel>;
  getAllHostels(providerId:string): Promise<IHostel[]>;
  findHostelById(hostelId: string): Promise<IHostel | null>;
  findHostelByIdUnPopulated(hostelId: string): Promise<IHostel | null>
  updateHostel(hostelId: string, updateData: Partial<IHostel>): Promise<IHostel | null>;
  deleteHostel(hostelId: string): Promise<boolean>;
}
