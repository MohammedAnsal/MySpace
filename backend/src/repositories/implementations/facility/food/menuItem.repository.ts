import Container, { Service } from "typedi";
import { IMenuItemRepository } from "../../../interfaces/facility/food/menuItem.Irepository";
import MenuItem, {
  IMenuItem,
} from "../../../../models/facility/Food/menuItem.model";

@Service()
export class MenuItemRepository implements IMenuItemRepository {
  //  For create menuItem :-

  async createMenuItem(menuItemData: Partial<IMenuItem>): Promise<IMenuItem> {
    const menuItem = new MenuItem(menuItemData);
    return await menuItem.save();
  }

  //  For update menuItem :-

  async updateMenuItem(
    menuItemId: string,
    menuItemData: Partial<IMenuItem>
  ): Promise<IMenuItem | null> {
    return await MenuItem.findByIdAndUpdate(
      menuItemId,
      { $set: menuItemData },
      { new: true }
    );
  }

  //  For delete menuItem :-

  async deleteMenuItem(menuItemId: string): Promise<IMenuItem | null> {
    return await MenuItem.findByIdAndDelete(menuItemId);
  }

  //  For get single menuItem :-

  async getMenuItemById(menuItemId: string): Promise<IMenuItem | null> {
    return await MenuItem.findById(menuItemId);
  }

  //  For get all menuItem's :-

  async getAllMenuItems(): Promise<IMenuItem[]> {
    return await MenuItem.find();
  }

  //  For get menuItem's by ctagory :-

  async getMenuItemsByCategory(category: string): Promise<IMenuItem[]> {
    return await MenuItem.find({ category });
  }
}

export const menuItemRepository = Container.get(MenuItemRepository);
