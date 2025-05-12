import Container, { Service } from "typedi";
import { IMenuItem } from "../../../../models/facility/Food/menuItem.model";
import { menuItemRepository } from "../../../../repositories/implementations/facility/food/menuItem.repository";
import { IMenuItemRepository } from "../../../../repositories/interfaces/facility/food/menuItem.Irepository";
import { IMenuItemService } from "../../../interface/facility/food/menuItem.service.interface";

@Service()
export class MenuItemService implements IMenuItemService {
  private menuItemRepo: IMenuItemRepository;

  constructor() {
    this.menuItemRepo = menuItemRepository;
  }

  async createMenuItem(item: IMenuItem): Promise<IMenuItem> {
    return await this.menuItemRepo.createMenuItem(item);
  }

  async getMenuItem(id: string): Promise<IMenuItem> {
    const menuItem = await this.menuItemRepo.getMenuItemById(id);
    if (!menuItem) {
      throw new Error("Menu item not found");
    }
    return menuItem;
  }

  async getAllMenuItems(): Promise<IMenuItem[]> {
    return await this.menuItemRepo.getAllMenuItems();
  }

  async getMenuItemsByCategory(category: string): Promise<IMenuItem[]> {
    return await this.menuItemRepo.getMenuItemsByCategory(category);
  }

  async updateMenuItem(id: string, item: IMenuItem): Promise<IMenuItem> {
    const updatedMenuItem = await this.menuItemRepo.updateMenuItem(id, item);
    if (!updatedMenuItem) {
      throw new Error("Menu item not found");
    }
    return updatedMenuItem;
  }

  async deleteMenuItem(id: string): Promise<void> {
    const result = await this.menuItemRepo.deleteMenuItem(id);
    if (!result) {
      throw new Error("Menu item not found");
    }
  }
}

export const menuItemService = Container.get(MenuItemService);
