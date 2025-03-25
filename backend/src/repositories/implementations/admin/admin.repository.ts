import Container, { Service } from "typedi";
import { Admin, IAdmin } from "../../../models/admin/admin.model";
import { BaseRepository } from "../../base.repository";
import { IAdminRepository } from "../../interfaces/admin/admin.Irepository";
import { Hostel, IHostel } from "../../../models/provider/hostel.model";

@Service()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      return await Admin.findOne({ email });
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding admin by email: ${error}`)
      );
    }
  }

  async verifyHostel(
    hostelId: string,
    isVerified: boolean
  ): Promise<IHostel | null> {
    try {
      if (isVerified) {
        return await Hostel.findByIdAndUpdate(
          hostelId,
          { $set: { is_verified: true, is_rejected: false } },
          { new: true }
        ).populate(["provider_id", "location", "facilities"]);
      } else {
        return await Hostel.findByIdAndUpdate(
          hostelId,
          { $set: { is_rejected: true, is_verified: false } },
          { new: true }
        ).populate(["provider_id", "location", "facilities"]);
      }
    } catch (error) {
      console.error("Error verifying hostel:", error);
      throw new Error("Failed to verify hostel");
    }
  }

  async getUnverifiedHostels(): Promise<IHostel[]> {
    try {
      const hostels = await Hostel.find({
        is_verified: false,
        is_rejected: false,
      })
        .populate("provider_id", "fullName email phone")
        .populate("location")
        .populate("facilities")
        .sort({ createdAt: -1 });

      return hostels;
    } catch (error) {
      throw error;
    }
  }

  async getVerifiedHostels(): Promise<IHostel[]> {
    try {
      const hostels = await Hostel.find({
        is_verified: true,
        is_rejected: false
      })
        .populate("provider_id", "fullName email phone")
        .populate("location")
        .populate("facilities")
        .sort({ createdAt: -1 });
      
      return hostels;
    } catch (error) {
      throw error;
    }
  }

  async getHostelById(hostelId: string): Promise<IHostel | null> {
    try {
      const hostel = await Hostel.findOne({
        _id: hostelId,
        is_verified: true,
        is_rejected: false
      })
        .populate("provider_id", "fullName email phone")
        .populate("location")
        .populate("facilities");

      return hostel;
    } catch (error) {
      throw error;
    }
  }
}

export const adminRepository = Container.get(AdminRepository);
