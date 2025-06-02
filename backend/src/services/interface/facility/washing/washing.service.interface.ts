import {
  CreateWashingRequestDTO,
  UpdateWashingStatusDTO,
  AddFeedbackDTO,
  WashingResponseDTO,
} from "../../../../dtos/facility/washing/washing.dto";

export interface IWashingService {
  createWashingRequest(
    userId: string,
    data: CreateWashingRequestDTO
  ): Promise<WashingResponseDTO>;

  getUserWashingRequests(userId: string): Promise<WashingResponseDTO>;

  getProviderWashingRequests(providerId: string): Promise<WashingResponseDTO>;

  getWashingRequestById(id: string): Promise<WashingResponseDTO>;

  updateWashingRequestStatus(
    id: string,
    data: UpdateWashingStatusDTO
  ): Promise<WashingResponseDTO>;

  cancelWashingRequest(id: string, userId: string): Promise<WashingResponseDTO>;

  addFeedback(
    id: string,
    userId: string,
    data: AddFeedbackDTO
  ): Promise<WashingResponseDTO>;
}
