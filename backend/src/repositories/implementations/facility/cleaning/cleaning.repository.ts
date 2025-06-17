import Container, { Service } from "typedi";
import {
  ICleaningRepository,
  ICleaningInput,
} from "../../../interfaces/facility/cleaning/cleaning.Irepository";
import CleaningModel, {
  ICleaning,
} from "../../../../models/facility/Cleaning/cleaning.model";
import { Types } from "mongoose";

@Service()
export class CleaningRepository implements ICleaningRepository {
  //  For create cleaning req :-

  async createCleaningRequest(requestData: ICleaningInput): Promise<ICleaning> {
    const cleaningRequest = new CleaningModel({
      ...requestData,
      status: "Pending",
    });
    return await cleaningRequest.save();
  }

  //  For get user cleaning req :-

  async getUserCleaningRequests(userId: string): Promise<ICleaning[]> {
    return await CleaningModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate("hostelId", "hostel_name location")
      .populate("providerId", "fullName email");
  }

  //  For get cleaning req byId :-

  async getCleaningRequestById(requestId: string): Promise<ICleaning | null> {
    return await CleaningModel.findById(requestId)
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location")
      .populate("providerId", "fullName email");
  }

  //  For update cleaning req :-

  async updateCleaningRequestStatus(
    requestId: string,
    status: string
  ): Promise<ICleaning | null> {
    return await CleaningModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );
  }

  //  For cancel cleaning req :-

  async cancelCleaningRequest(requestId: string): Promise<ICleaning | null> {
    return await CleaningModel.findByIdAndUpdate(
      requestId,
      { status: "Cancelled" },
      { new: true }
    );
  }

  //  For get provider cleaning req :-

  async getProviderCleaningRequests(providerId: string): Promise<ICleaning[]> {
    return await CleaningModel.find({
      providerId: new Types.ObjectId(providerId),
    })
      .sort({ requestedDate: 1, createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location");
  }

}

export const cleaningRepository = Container.get(CleaningRepository);
