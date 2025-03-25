import Container, { Service } from "typedi";
import { Hostel, IHostel } from "../../../models/provider/hostel.model";
import { IHostelRepository } from "../../interfaces/provider/hostel.Irepository";
@Service()
class HostelRepository implements IHostelRepository {
  async createHostel(hostelData: Partial<IHostel>): Promise<IHostel> {
    try {
      const hostel = await Hostel.create(hostelData);

      return await hostel.populate([
        { path: "provider_id", select: "-password" },
        { path: "location" },
        { path: "facilities" },
      ]);
    } catch (error) {
      console.error("Error creating hostel:", error);
      throw new Error("Failed to create hostel");
    }
  }

  // async verifyHostel(
  //   hostelId: string,
  //   isVerified: boolean
  // ): Promise<IHostel | null> {
  //   try {
  //     if (isVerified == true) {
  //       return await Hostel.findByIdAndUpdate(hostelId, {
  //         $set: { is_verified: isVerified },
  //       });
  //     } else {
  //       return await Hostel.findByIdAndUpdate(hostelId, {
  //         $set: { is_rejected: true },
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error verifying hostel:", error);
  //     throw new Error("Failed to verfying hostel");
  //   }
  // }

  async getAllHostels(): Promise<IHostel[]> {
    try {
      console.log("alala");
      const hostels = await Hostel.find()
        .populate("provider_id", "fullName email")
        .populate("location")
        .populate("facilities")
        .sort({ createdAt: -1 });

      return hostels;
    } catch (error) {
      throw error;
    }
  }

  // async findHostelById(hostelId: string): Promise<IHostel | null> {
  //   try {
  //     return await Hostel.findById(hostelId).populate(
  //       "provider_id facilities location"
  //     );
  //   } catch (error) {
  //     console.error("Error finding hostel:", error);
  //     throw new Error("Failed to find hostel");
  //   }
  // }
}

export const hostelRepository = Container.get(HostelRepository);
