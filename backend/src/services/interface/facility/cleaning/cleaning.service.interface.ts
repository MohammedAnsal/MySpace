import {
  CreateCleaningRequestDTO,
  UpdateCleaningStatusDTO,
  AddFeedbackDTO,
  CleaningResponseDTO,
} from "../../../../dtos/facility/cleaning/cleaning.dto";

export interface ICleaningService {
  createCleaningRequest(
    userId: string,
    data: CreateCleaningRequestDTO
  ): Promise<CleaningResponseDTO>;

  getUserCleaningRequests(userId: string): Promise<CleaningResponseDTO>;

  getCleaningRequestById(requestId: string): Promise<CleaningResponseDTO>;

  updateCleaningRequestStatus(
    requestId: string,
    data: UpdateCleaningStatusDTO
  ): Promise<CleaningResponseDTO>;

  cancelCleaningRequest(
    requestId: string,
    userId: string
  ): Promise<CleaningResponseDTO>;

  getProviderCleaningRequests(providerId: string): Promise<CleaningResponseDTO>;

  addFeedback(
    requestId: string,
    data: AddFeedbackDTO
  ): Promise<CleaningResponseDTO>;
}
