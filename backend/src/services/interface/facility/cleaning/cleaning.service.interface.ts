export interface ICleaningService {
  createCleaningRequest(
    userId: string,
    providerId: string,
    hostelId: string,
    facilityId: string,
    requestedDate: string,
    preferredTimeSlot: string,
    specialInstructions?: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
  getUserCleaningRequests(
    userId: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
  getCleaningRequestById(
    requestId: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
  updateCleaningRequestStatus(
    requestId: string,
    status: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
  cancelCleaningRequest(
    requestId: string,
    userId: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
  getProviderCleaningRequests(
    providerId: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
  addFeedback(
    requestId: string,
    rating: number,
    comment?: string
  ): Promise<{ success: boolean; message: string; data?: any }>;
}
