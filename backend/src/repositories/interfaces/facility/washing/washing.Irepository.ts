import { IWashing } from "../../../../models/facility/Washing/washing.model";

export interface IWashingRepository {
  createWashingRequest(washingRequest: Partial<IWashing>): Promise<IWashing>;
  getUserWashingRequests(userId: string): Promise<IWashing[]>;
  getProviderWashingRequests(providerId: string): Promise<IWashing[]>;
  getWashingRequestById(id: string): Promise<IWashing | null>;
  updateWashingRequest(
    id: string,
    update: Partial<IWashing>
  ): Promise<IWashing | null>;
  cancelWashingRequest(id: string): Promise<IWashing | null>;
}
