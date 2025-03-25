import { IHostel } from "../../../models/provider/hostel.model";

export interface IHostelRepository {
  createHostel(hosetlData: Partial<IHostel>): Promise<IHostel>;
  // verifyHostel(hostelId: string, is_verified: boolean): Promise<IHostel | null>;
  getAllHostels(): Promise<IHostel[]>;
}
