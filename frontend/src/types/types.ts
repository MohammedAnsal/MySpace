export enum Role {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profile_picture: string;
  gender: "male" | "female" | "other";
  role: "user" | "provider";
  is_verified: boolean;
  is_active: boolean;
  createdAt: Date;
  // Add document verification fields
  documentType?: "aadhar" | "pan" | "passport" | "driving_license";
  documentImage?: string;
  isDocumentVerified?: boolean;
}
