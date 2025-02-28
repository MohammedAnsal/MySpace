export enum Role {
  USER = "user",
  PROVIDER = "provider",
  ADMIN = "admin",
}

export interface IUser extends Document {
  _id: number;
  fullName: string;
  email: string;
  phone: number;
  gender: "Male" | "Female";
  role: string;
  createdAt?: Date;
  is_active: boolean;
  isVerified: boolean;
}
