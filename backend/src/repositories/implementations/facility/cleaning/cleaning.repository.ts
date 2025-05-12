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
  async createCleaningRequest(requestData: ICleaningInput): Promise<ICleaning> {
    const cleaningRequest = new CleaningModel({
      ...requestData,
      status: "Pending",
    });
    return await cleaningRequest.save();
  }

  async getUserCleaningRequests(userId: string): Promise<ICleaning[]> {
    return await CleaningModel.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .populate("hostelId", "hostel_name location")
      .populate("providerId", "fullName email");
  }

  async getCleaningRequestById(requestId: string): Promise<ICleaning | null> {
    return await CleaningModel.findById(requestId)
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location")
      .populate("providerId", "fullName email");
  }

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

  async cancelCleaningRequest(requestId: string): Promise<ICleaning | null> {
    return await CleaningModel.findByIdAndUpdate(
      requestId,
      { status: "Cancelled" },
      { new: true }
    );
  }

  async getProviderCleaningRequests(providerId: string): Promise<ICleaning[]> {
    return await CleaningModel.find({
      providerId: new Types.ObjectId(providerId),
    })
      .sort({ requestedDate: 1, createdAt: -1 })
      .populate("userId", "fullName email")
      .populate("hostelId", "hostel_name location");
  }

  async addFeedback(
    requestId: string,
    rating: number,
    comment?: string
  ): Promise<ICleaning | null> {
    return await CleaningModel.findByIdAndUpdate(
      requestId,
      {
        feedback: {
          rating,
          comment,
        },
      },
      { new: true }
    );
  }

  async getUserRecentBookings(
    userId: string,
    days: number
  ): Promise<ICleaning[]> {
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - days);

    return await CleaningModel.find({
      userId: new Types.ObjectId(userId),
      status: { $ne: "Cancelled" },
      createdAt: { $gte: dateThreshold },
    });
  }
}

export const cleaningRepository = Container.get(CleaningRepository);
