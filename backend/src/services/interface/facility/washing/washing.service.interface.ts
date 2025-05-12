import { IWashing } from "../../../../models/facility/Washing/washing.model";

export interface IWashingService {
  createWashingRequest(washingData: Partial<IWashing>): Promise<IWashing>;
  getUserWashingRequests(userId: string): Promise<IWashing[]>;
  getProviderWashingRequests(providerId: string): Promise<IWashing[]>;
  getWashingRequestById(id: string): Promise<IWashing>;
  updateWashingRequestStatus(
    id: string,
    status: "Pending" | "In Progress" | "Completed" | "Cancelled"
  ): Promise<IWashing>;
  cancelWashingRequest(id: string, userId: string): Promise<IWashing>;
  addFeedback(
    id: string,
    userId: string,
    rating: number,
    comment?: string
  ): Promise<IWashing>;
}
