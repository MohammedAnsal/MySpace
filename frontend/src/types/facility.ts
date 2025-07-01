export type CleaningRequest = {
  _id: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  requestedDate: string;
  preferredTimeSlot: string;
  specialInstructions?: string;
  createdAt: string;
  providerId: string;
  hostelId: string;
  facilityId: string;
  feedback?: {
    rating: number;
    comment?: string;
    submittedAt?: string;
  };
};

export type WashingRequest = {
  _id: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  requestedDate: string;
  preferredTimeSlot: string;
  itemsCount: number;
  specialInstructions?: string;
  createdAt: string;
  providerId: string;
  hostelId: string;
  facilityId: string;
  feedback?: {
    rating: number;
    comment?: string;
    submittedAt?: string;
  };
};
