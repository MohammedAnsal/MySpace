import { IAdmin } from "../../../models/admin/admin.model";
import { IRepository } from "../base.Irepository";

export interface IAdminRepository extends IRepository<IAdmin> {
  findByEmail(email: string): Promise<IAdmin | null>;
}
