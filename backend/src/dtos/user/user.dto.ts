export interface UserResponseDTO {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  profile_picture: string;
  gender: "male" | "female" | "other";
  address_id?: string | null;
  role: "user" | "provider";
  is_verified: boolean;
  is_active: boolean;
  wallet: number;
}

export interface EditProfileDTO {
  fullName?: string;
  phone?: string;
  gender?: "male" | "female" | "other";
  address_id?: string;
  profile_picture?: string;
}

export interface ChangePasswordDTO {
  email: string;
  oldPassword: string;
  newPassword: string;
} 