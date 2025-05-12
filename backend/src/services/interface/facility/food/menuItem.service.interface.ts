import { IMenuItem } from "../../../../models/facility/Food/menuItem.model";

export interface IMenuItemService {
  createMenuItem(item: IMenuItem): Promise<IMenuItem>;
  getMenuItem(id: string): Promise<IMenuItem>;
  getAllMenuItems(): Promise<IMenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<IMenuItem[]>;
  updateMenuItem(id: string, item: IMenuItem): Promise<IMenuItem>;
  deleteMenuItem(id: string): Promise<void>;
}
