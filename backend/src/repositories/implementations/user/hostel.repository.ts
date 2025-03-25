import Container, { Service } from "typedi";
import { Hostel, IHostel } from "../../../models/provider/hostel.model";
import { IHostelRepository } from "../../interfaces/user/hostel.Irepository";
import { FilterQuery } from "mongoose";

@Service()
export class HostelRepository implements IHostelRepository {

  async getVerifiedHostels(filters: {
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    amenities?: string[];
    search?: string;
    sortBy?: 'asc' | 'desc';
  }): Promise<IHostel[]> {
    try {
      let query: FilterQuery<IHostel> = {
        is_verified: true,
        is_rejected: false,
      };

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query = {
          ...query,
          monthly_rent: {
            ...(filters.minPrice && { $gte: filters.minPrice }),
            ...(filters.maxPrice && { $lte: filters.maxPrice }),
          },
        };
      }

      if (filters.gender) {
        query = {
          ...query,
          gender: filters.gender,
        };
      }

      if (filters.amenities && filters.amenities.length > 0) {
        query = {
          ...query,
          amenities: { $all: filters.amenities },
        };
      }

      if (filters.search) {
        query = {
          ...query,
          $or: [
            { hostel_name: { $regex: filters.search, $options: 'i' } },
            // { 'location.address': { $regex: filters.search, $options: 'i' } },
          ],
        };
      }

      let hostelsQuery = Hostel.find(query)
        .populate("provider_id", "fullName email phone")
        .populate("location")
        .populate("facilities");

      if (filters.sortBy) {
        hostelsQuery = hostelsQuery.sort({ monthly_rent: filters.sortBy === 'asc' ? 1 : -1 });
      } else {
        hostelsQuery = hostelsQuery.sort({ createdAt: -1 });
      }

      const hostels = await hostelsQuery;
      return hostels;
    } catch (error) {
      throw error;
    }
  }

  async getHostelById(hostelId: string): Promise<IHostel | null> {
    try {
      const query: FilterQuery<IHostel> = {
        _id: hostelId,
        is_verified: true,
        is_rejected: false,
      };

      const hostel = await Hostel.findOne(query)
        .populate("provider_id", "fullName email phone")
        .populate("location")
        .populate("facilities");

      return hostel;
    } catch (error) {
      throw error;
    }
  }
}

export const hostelRepository = Container.get(HostelRepository);
