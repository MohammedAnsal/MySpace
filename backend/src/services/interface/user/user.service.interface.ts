import { UserResponseDTO, EditProfileDTO, ChangePasswordDTO } from "../../../dtos/user/user.dto";

export interface IUserService {
  findUser(userId: string): Promise<{
    success: boolean;
    message?: string;
    data?: UserResponseDTO;
  }>;
  changePassword(
    data: ChangePasswordDTO
  ): Promise<{ success: boolean; message: string }>;
  editProfile(
    data: EditProfileDTO,
    userId: string,
    image?: Express.Multer.File
  ): Promise<{ success: boolean; message: string; data: UserResponseDTO }>;
}
