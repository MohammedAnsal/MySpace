import { IMenuItem } from "../../../models/facility/Food/menuItem.model";

export interface IMenuItemRepository {
  createMenuItem(menuItemData: Partial<IMenuItem>): Promise<IMenuItem>;
  updateMenuItem(
    menuItemId: string,
    menuItemData: Partial<IMenuItem>
  ): Promise<IMenuItem | null>;
  deleteMenuItem(menuItemId: string): Promise<IMenuItem | null>;
  getMenuItemById(menuItemId: string): Promise<IMenuItem | null>;
  getAllMenuItems(): Promise<IMenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<IMenuItem[]>;
}
