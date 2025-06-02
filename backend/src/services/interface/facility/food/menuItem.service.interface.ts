import {
  CreateMenuItemDTO,
  UpdateMenuItemDTO,
  MenuItemResponseDTO,
} from "../../../../dtos/facility/food/menuItem.dto";

export interface IMenuItemService {
  createMenuItem(data: CreateMenuItemDTO): Promise<MenuItemResponseDTO>;
  getMenuItem(id: string): Promise<MenuItemResponseDTO>;
  getAllMenuItems(): Promise<MenuItemResponseDTO>;
  getMenuItemsByCategory(category: string): Promise<MenuItemResponseDTO>;
  updateMenuItem(
    id: string,
    data: UpdateMenuItemDTO
  ): Promise<MenuItemResponseDTO>;
  deleteMenuItem(id: string): Promise<MenuItemResponseDTO>;
}
