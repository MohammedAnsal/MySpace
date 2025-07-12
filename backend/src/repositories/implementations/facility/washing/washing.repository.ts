import Container, { Service } from "typedi";
import { IWashingRepository } from "../../../interfaces/facility/washing/washing.Irepository";
import WashingRequest, {
  IWashing,
} from "../../../../models/facility/Washing/washing.model";
import { Types } from "mongoose";

@Service()
export class WashingRepository implements IWashingRepository {
  //  For create washing req :-

  async createWashingRequest(
    washingRequest: Partial<IWashing>
  ): Promise<IWashing> {
    const newRequest = new WashingRequest(washingRequest);
    return await newRequest.save();
  }

  //  For get user washing req :-

  async getUserWashingRequests(userId: string): Promise<IWashing[]> {
    return await WashingRequest.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate("hostelId", "hostel_name location");
  }

  //  For get provider wahsing req :-

  async getProviderWashingRequests(providerId: string): Promise<IWashing[]> {
    return await WashingRequest.find({
      providerId: new Types.ObjectId(providerId),
    })
      .sort({ createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location");
  }

  //  For get wahsing req byId :-

  async getWashingRequestById(id: string): Promise<IWashing | null> {
    return await WashingRequest.findById(id)
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location");
  }

  //  Update wahsing req :-

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

  //  Cancel washing req :-

  async cancelWashingRequest(id: string): Promise<IWashing | null> {
    return await WashingRequest.findByIdAndUpdate(
      id,
      { $set: { status: "Cancelled" } },
      { new: true }
    );
  }
}

export const washingRepository = Container.get(WashingRepository);
