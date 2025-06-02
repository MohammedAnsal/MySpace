import Container, { Service } from "typedi";
import { IMenuItem } from "../../../../models/facility/Food/menuItem.model";
import { menuItemRepository } from "../../../../repositories/implementations/facility/food/menuItem.repository";
import { IMenuItemRepository } from "../../../../repositories/interfaces/facility/food/menuItem.Irepository";
import { IMenuItemService } from "../../../interface/facility/food/menuItem.service.interface";
import {
  CreateMenuItemDTO,
  UpdateMenuItemDTO,
  MenuItemResponseDTO,
  MenuItemDataDTO,
} from "../../../../dtos/facility/food/menuItem.dto";
import { AppError } from "../../../../utils/error";
import { HttpStatus } from "../../../../enums/http.status";

@Service()
export class MenuItemService implements IMenuItemService {
  private menuItemRepo: IMenuItemRepository;

  constructor() {
    this.menuItemRepo = menuItemRepository;
  }

  async createMenuItem(data: CreateMenuItemDTO): Promise<MenuItemResponseDTO> {
    try {
      const menuItemData: MenuItemDataDTO = {
        ...data,
      };

      const newMenuItem = await this.menuItemRepo.createMenuItem(menuItemData);
      return {
        success: true,
        message: "Menu item created successfully",
        data: newMenuItem,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to create menu item",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMenuItem(id: string): Promise<MenuItemResponseDTO> {
    try {
      const menuItem = await this.menuItemRepo.getMenuItemById(id);
      if (!menuItem) {
        throw new AppError("Menu item not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Menu item retrieved successfully",
        data: menuItem,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch menu item",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getAllMenuItems(): Promise<MenuItemResponseDTO> {
    try {
      const menuItems = await this.menuItemRepo.getAllMenuItems();
      return {
        success: true,
        message: "Menu items retrieved successfully",
        data: menuItems,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch menu items",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItemResponseDTO> {
    try {
      const menuItems = await this.menuItemRepo.getMenuItemsByCategory(
        category
      );
      return {
        success: true,
        message: "Menu items retrieved successfully",
        data: menuItems,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to fetch menu items by category",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateMenuItem(
    id: string,
    data: UpdateMenuItemDTO
  ): Promise<MenuItemResponseDTO> {
    try {
      const updatedMenuItem = await this.menuItemRepo.updateMenuItem(id, data);
      if (!updatedMenuItem) {
        throw new AppError("Menu item not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Menu item updated successfully",
        data: updatedMenuItem,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update menu item",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async deleteMenuItem(id: string): Promise<MenuItemResponseDTO> {
    try {
      const deletedMenuItem = await this.menuItemRepo.deleteMenuItem(id);
      if (!deletedMenuItem) {
        throw new AppError("Menu item not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Menu item deleted successfully",
        data: deletedMenuItem,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to delete menu item",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const menuItemService = Container.get(MenuItemService);
