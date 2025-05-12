import Container, { Service } from "typedi";
import { IWashingRepository } from "../../../interfaces/facility/washing/washing.Irepository";
import WashingRequest, {
  IWashing,
} from "../../../../models/facility/Washing/washing.model";
import { Types } from "mongoose";

@Service()
export class WashingRepository implements IWashingRepository {
  
  async createWashingRequest(
    washingRequest: Partial<IWashing>
  ): Promise<IWashing> {
    console.log(washingRequest)
    const newRequest = new WashingRequest(washingRequest);
    return await newRequest.save();
  }

  async getUserWashingRequests(userId: string): Promise<IWashing[]> {
    return await WashingRequest.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate("hostelId", "hostel_name location");
  }

  async getProviderWashingRequests(providerId: string): Promise<IWashing[]> {
    return await WashingRequest.find({
      providerId: new Types.ObjectId(providerId),
    })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location");
  }

  async getWashingRequestById(id: string): Promise<IWashing | null> {
    return await WashingRequest.findById(id)
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location");
  }

  async updateWashingRequest(
    id: string,
    update: Partial<IWashing>
  ): Promise<IWashing | null> {
    return await WashingRequest.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );
  }

  async cancelWashingRequest(id: string): Promise<IWashing | null> {
    
    return await WashingRequest.findByIdAndUpdate(
      id,
      { $set: { status: "Cancelled" } },
      { new: true }
    );
  }

  async addFeedback(
    id: string,
    rating: number,
    comment?: string
  ): Promise<IWashing | null> {
    return await WashingRequest.findByIdAndUpdate(
      id,
      {
        $set: {
          feedback: {
            rating,
            ...(comment && { comment }),
          },
        },
      },
      { new: true }
    );
  }

  async getUserRecentBookings(userId: string, days: number): Promise<IWashing[]> {
    // Calculate date range: from days ago to today
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - days);
    
    const today = new Date();
    
    return await WashingRequest.find({ 
      userId: new Types.ObjectId(userId),
      requestedDate: { 
        $gte: pastDate,
        $lte: today
      },
      status: { $ne: "Cancelled" } // Don't count cancelled bookings
    });
  }
}

export const washingRepository = Container.get(WashingRepository);
