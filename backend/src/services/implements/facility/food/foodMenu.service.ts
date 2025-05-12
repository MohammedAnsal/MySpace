import Container, { Service } from "typedi";
import { foodMenuRepository } from "../../../../repositories/implementations/facility/food/foodMenu.repository";
import { IFoodMenuRepository } from "../../../../repositories/interfaces/facility/food/foodMenu.Irepository";
import { IFoodMenuService } from "../../../interface/facility/food/foodMenu.service.interface";
import { IFoodMenu } from "../../../../models/facility/Food/foodMenu.model";
import { AppError } from "../../../../utils/error";
import { HttpStatus } from "../../../../enums/http.status";

@Service()
export class FoodMenuService implements IFoodMenuService {
  private foodMenuRepo: IFoodMenuRepository;

  constructor() {
    this.foodMenuRepo = foodMenuRepository;
  }

  // async createFoodMenu(
  //   providerId: string,
  //   facilityId: string
  // ): Promise<IFoodMenu> {
  //   try {
  //     return await this.foodMenuRepo.createFoodMenu(providerId, facilityId);
  //   } catch (error) {
  //     throw new AppError("Failed to create food menu", HttpStatus.BAD_REQUEST);
  //   }
  // }

  async getFoodMenu(facilityId: string, hostelId: string): Promise<IFoodMenu> {
    try {
      const menu = await this.foodMenuRepo.getFoodMenuByFacility(
        facilityId,
        hostelId
      );
      if (!menu) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return menu;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to get food menu",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateFoodMenu(
    id: string,
    menu: Partial<IFoodMenu>
  ): Promise<IFoodMenu> {
    try {
      const updatedMenu = await this.foodMenuRepo.updateFoodMenu(id, menu);
      if (!updatedMenu) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return updatedMenu;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update food menu", HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFoodMenu(
    id: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<void> {
    try {
      const result = await this.foodMenuRepo.deleteFoodMenu(id, day, mealType);
      if (!result) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to delete food menu",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async addSingleDayMenu(
    providerId: string,
    facilityId: string,
    hostelId: string,
    day: string,
    meals: {
      morning?: string[];
      noon?: string[];
      night?: string[];
    }
  ): Promise<IFoodMenu> {
    try {
      const menu = await this.foodMenuRepo.addSingleDayMenu(
        providerId,
        facilityId,
        hostelId,
        day,
        meals
      );
      if (!menu) {
        throw new AppError("Menu not found", HttpStatus.NOT_FOUND);
      }
      return menu;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to add single day menu",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async cancelMeal(
    id: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    isAvailable: boolean
  ): Promise<IFoodMenu> {
    try {
      // Get the current day of the week
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = days[new Date().getDay()];
      
      // Check if trying to cancel today's meal
      if (day === currentDay) {
        throw new AppError("Cannot cancel or restore meals for the current day", HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.foodMenuRepo.cancelMeal(id, day, mealType, isAvailable);
      if (!result) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update meal availability", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

export const foodMenuService = Container.get(FoodMenuService);
