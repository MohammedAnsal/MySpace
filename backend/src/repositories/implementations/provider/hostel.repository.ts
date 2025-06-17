import Container, { Service } from "typedi";
import { Hostel, IHostel } from "../../../models/provider/hostel.model";
import { IHostelRepository } from "../../interfaces/provider/hostel.Irepository";
@Service()
class HostelRepository implements IHostelRepository {
  //  For create hostel :-

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

  //  For get all hostel's :-

  async getAllHostels(providerId: string): Promise<IHostel[]> {
    try {
      const hostels = await Hostel.find({ provider_id: providerId })
        .populate("provider_id", "fullName email")
        .populate("location")
        .populate("facilities")
        .sort({ createdAt: -1 });

      return hostels;
    } catch (error) {
      throw error;
    }
  }

  //  For get single hostel :-

  async findHostelById(hostelId: string): Promise<IHostel | null> {
    try {
      const hostel = await Hostel.findById(hostelId)
        .populate("provider_id", "fullName email")
        .populate("location")
        .populate("facilities");
      return hostel;
    } catch (error) {
      console.error("Error finding hostel:", error);
      throw new Error("Failed to find hostel");
    }
  }

  //  For find single hostel by populated :-

  async findHostelByIdUnPopulated(hostelId: string): Promise<IHostel | null> {
    try {
      const hostel = await Hostel.findById(hostelId);
      return hostel;
    } catch (error) {
      console.error("Error finding hostel:", error);
      throw new Error("Failed to find hostel");
    }
  }

  //  For update hostel :-

  async updateHostel(
    hostelId: string,
    updateData: Partial<IHostel>
  ): Promise<IHostel | null> {
    try {
      const hostel = await Hostel.findByIdAndUpdate(
        hostelId,
        { $set: updateData },
        { new: true }
      ).populate([
        { path: "provider_id", select: "-password" },
        { path: "location" },
        { path: "facilities" },
      ]);

      return hostel;
    } catch (error) {
      console.error("Error updating hostel:", error);
      throw new Error("Failed to update hostel");
    }
  }

  //  For delete hostel :-

  async deleteHostel(hostelId: string): Promise<boolean> {
    try {
      const result = await Hostel.findByIdAndDelete(hostelId);
      return !!result;
    } catch (error) {
      console.error("Error deleting hostel:", error);
      throw new Error("Failed to delete hostel");
    }
  }
}

export const hostelRepository = Container.get(HostelRepository);
