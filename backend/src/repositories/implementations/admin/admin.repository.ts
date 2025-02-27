import { Service } from "typedi";
import { Admin, IAdmin } from "../../../models/admin/admin.model";
import { BaseRepository } from "../../base.repository";
import { IAdminRepository } from "../../interfaces/admin/admin.Irepository";

@Service()
export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    try {
      return await Admin.findOne({ email });
    } catch (error) {
      return Promise.reject(
        new Error(`Error finding admin by email: ${error}`)
      );
    }
  }
}
