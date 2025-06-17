import Container, { Service } from "typedi";
import { Hostel, IHostel } from "../../../models/provider/hostel.model";
import { IHostelRepository } from "../../interfaces/user/hostel.Irepository";
import { FilterQuery, ObjectId } from "mongoose";
import { Rating } from "../../../models/rating.model";
import mongoose from "mongoose";
import { Location } from "../../../models/provider/location.model";

@Service()
export class HostelRepository implements IHostelRepository {
  //  For get all verified hostel's :-

  async getVerifiedHostels(filters: {
    minPrice?: number;
    maxPrice?: number;
    gender?: string;
    amenities?: string[];
    search?: string;
    sortBy?: "asc" | "desc";
    minRating?: number;
    sortByRating?: boolean;
  }): Promise<IHostel[]> {
    try {
      let query: FilterQuery<IHostel> = {
        is_verified: true,
        is_rejected: false,
      };

      //  Price Filter :-

      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query = {
          ...query,
          monthly_rent: {
            ...(filters.minPrice && { $gte: filters.minPrice }),
            ...(filters.maxPrice && { $lte: filters.maxPrice }),
          },
        };
      }

      //  Gender Filter :-

      if (filters.gender) {
        query = {
          ...query,
          gender: filters.gender,
        };
      }

      //  Amenities Filter :-

      if (filters.amenities && filters.amenities.length > 0) {
        query = {
          ...query,
          amenities: { $all: filters.amenities },
        };
      }

      //  Search Filter :-

      if (filters.search) {
        const searchLocations = await this.findLocationsBySearch(
          filters.search
        );
        query = {
          ...query,
          $or: [
            { hostel_name: { $regex: filters.search, $options: "i" } },
            {
              location: {
                $in: searchLocations,
              },
            },
          ],
        };
      }

      let hostelsQuery = Hostel.find(query)
        .populate({
          path: "location",
          select: "address latitude longitude",
        })
        .populate("provider_id", "fullName email phone")
        .populate("facilities");

      //  Price , Rating Sorting :-

      if (filters.sortBy && !filters.sortByRating) {
        hostelsQuery = hostelsQuery.sort({
          monthly_rent: filters.sortBy === "asc" ? 1 : -1,
        });
      } else if (!filters.sortByRating) {
        hostelsQuery = hostelsQuery.sort({ createdAt: -1 });
      }

      const hostels = await hostelsQuery;

      // Get all hostel IDs :-

      const hostelIds = hostels.map((hostel) => hostel._id);

      // Fetch ratings for all hostels :-

      const ratingsAggregation = await Rating.aggregate([
        { $match: { hostel_id: { $in: hostelIds } } },
        {
          $group: {
            _id: "$hostel_id",
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      // Create a map for easy lookup :- (Rating Filter)

      const ratingsMap = new Map<
        string,
        { averageRating: number; count: number }
      >();
      ratingsAggregation.forEach((item) => {
        ratingsMap.set(item._id.toString(), {
          averageRating: item.averageRating,
          count: item.count,
        });
      });

      let hostelsWithRatings: IHostel[] = hostels.map((hostel) => {
        const hostelObj =
          typeof hostel.toObject === "function"
            ? hostel.toObject()
            : { ...hostel };

        const hostelId = (hostel._id as mongoose.Types.ObjectId).toString();
        const ratingInfo = ratingsMap.get(hostelId);

        return {
          ...hostelObj,
          averageRating: ratingInfo ? ratingInfo.averageRating : 0,
          ratingCount: ratingInfo ? ratingInfo.count : 0,
        } as unknown as IHostel;
      });

      if (filters.minRating !== undefined) {
        hostelsWithRatings = hostelsWithRatings.filter((hostel) => {
          const rating = (hostel as any).averageRating || 0;
          return rating >= (filters.minRating || 0);
        });
      }

      if (filters.sortByRating) {
        hostelsWithRatings.sort((a, b) => {
          const aRating = (a as any).averageRating || 0;
          const bRating = (b as any).averageRating || 0;

          return filters.sortBy === "desc"
            ? bRating - aRating
            : aRating - bRating;
        });
      }

      return hostelsWithRatings;
    } catch (error) {
      throw error;
    }
  }

  //  For all verified hostel's :- (For home)

  async getVerifiedHostelsForHome(): Promise<IHostel[]> {
    try {
      const hostels = await Hostel.find({ is_verified: true })
        .populate("provider_id", "fullName email phone")
        .populate("location")
        .populate("facilities");

      const hostelIds = hostels.map((hostel) => hostel._id);

      const ratingsAggregation = await Rating.aggregate([
        { $match: { hostel_id: { $in: hostelIds } } },
        {
          $group: {
            _id: "$hostel_id",
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      const ratingsMap = new Map<
        string,
        { averageRating: number; count: number }
      >();
      ratingsAggregation.forEach((item) => {
        ratingsMap.set(item._id.toString(), {
          averageRating: item.averageRating,
          count: item.count,
        });
      });

      const hostelsWithRatings: IHostel[] = hostels.map((hostel) => {
        const hostelObj =
          typeof hostel.toObject === "function"
            ? hostel.toObject()
            : { ...hostel };

        const hostelId = (hostel._id as mongoose.Types.ObjectId).toString();
        const ratingInfo = ratingsMap.get(hostelId);

        return {
          ...hostelObj,
          averageRating: ratingInfo ? ratingInfo.averageRating : 0,
          ratingCount: ratingInfo ? ratingInfo.count : 0,
        } as unknown as IHostel;
      });

      return hostelsWithRatings;
    } catch (error) {
      throw error;
    }
  }

  //  For single hostel :-

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

  //  For single hostel :- (Un populated)

  async findHostelByIdUnPopulated(hostelId: string): Promise<IHostel | null> {
    try {
      const hostel = await Hostel.findById(hostelId);
      return hostel;
    } catch (error) {
      console.error("Error finding hostel:", error);
      throw new Error("Failed to find hostel");
    }
  }

  //  For handling the available hostel bed-space :-

  async updateHostelAvailableSpace(hostelId: string): Promise<IHostel | null> {
    return await Hostel.findByIdAndUpdate(
      hostelId,
      { $inc: { available_space: -1 } },
      { new: true }
    );
  }

  //  For find all near-by hostel's :-

  async getNearbyHostels(
    latitude: number,
    longitude: number,
    maxDistance: number = 100000
  ): Promise<IHostel[]> {
    try {
      const hostels = await Hostel.find({
        is_verified: true,
        is_rejected: false,
      })
        .populate({
          path: "location",
          match: {
            location: {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude], // MongoDB uses [lng, lat] order
                },
                $maxDistance: maxDistance, // in meters
              },
            },
          },
        })
        .populate("provider_id", "fullName email phone")
        .populate("facilities");

      // Filter out hostels whose location didn't match (will be null)
      const filteredHostels = hostels.filter((hostel) => hostel.location);

      const hostelIds = filteredHostels.map((hostel) => hostel._id);

      const ratingsAggregation = await Rating.aggregate([
        { $match: { hostel_id: { $in: hostelIds } } },
        {
          $group: {
            _id: "$hostel_id",
            averageRating: { $avg: "$rating" },
            count: { $sum: 1 },
          },
        },
      ]);

      const ratingsMap = new Map<
        string,
        { averageRating: number; count: number }
      >();
      ratingsAggregation.forEach((item) => {
        ratingsMap.set(item._id.toString(), {
          averageRating: item.averageRating,
          count: item.count,
        });
      });

      const hostelsWithRatings: IHostel[] = filteredHostels.map((hostel) => {
        const hostelObj =
          typeof hostel.toObject === "function"
            ? hostel.toObject()
            : { ...hostel };

        const hostelId = (hostel._id as mongoose.Types.ObjectId).toString();
        const ratingInfo = ratingsMap.get(hostelId);

        return {
          ...hostelObj,
          averageRating: ratingInfo ? ratingInfo.averageRating : 0,
          ratingCount: ratingInfo ? ratingInfo.count : 0,
        } as unknown as IHostel;
      });

      return hostelsWithRatings;
    } catch (error) {
      throw error;
    }
  }

  //  For search hostel :-

  private async findLocationsBySearch(searchTerm: string): Promise<ObjectId[]> {
    const locations = await Location.find({
      address: { $regex: searchTerm, $options: "i" },
    }).select("_id");

    return locations.map((loc) => loc._id);
  }
}

export const hostelRepository = Container.get(HostelRepository);
