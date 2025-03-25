import { IHostel } from "../../../models/provider/hostel.model";

export type hostelResult = {
  hostelData?: IHostel | IHostel[] | null;
  success: boolean;
  message: string;
};

export interface IHostelService {
  createHostel(hostelData: Partial<IHostel>): Promise<hostelResult>;
  getAllHostels(): Promise<hostelResult>;
}
