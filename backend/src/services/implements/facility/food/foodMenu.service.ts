import Container, { Service } from "typedi";
import { foodMenuRepository } from "../../../../repositories/implementations/facility/food/foodMenu.repository";
import { IFoodMenuRepository } from "../../../../repositories/interfaces/facility/food/foodMenu.Irepository";
import { IFoodMenuService } from "../../../interface/facility/food/foodMenu.service.interface";
import { IFoodMenu } from "../../../../models/facility/Food/foodMenu.model";
import { AppError } from "../../../../utils/error";
import { HttpStatus } from "../../../../enums/http.status";
import {
  UpdateFoodMenuDTO,
  AddSingleDayMenuDTO,
  CancelMealDTO,
  FoodMenuResponseDTO,
} from "../../../../dtos/facility/food/foodMenu.dto";

@Service()
export class FoodMenuService implements IFoodMenuService {
  private foodMenuRepo: IFoodMenuRepository;

  constructor() {
    this.foodMenuRepo = foodMenuRepository;
  }

  async getFoodMenu(
    facilityId: string,
    hostelId: string
  ): Promise<FoodMenuResponseDTO> {
    try {
      const menu = await this.foodMenuRepo.getFoodMenuByFacility(
        facilityId,
        hostelId
      );
      if (!menu) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Food menu retrieved successfully",
        data: menu,
      };
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
    data: UpdateFoodMenuDTO
  ): Promise<FoodMenuResponseDTO> {
    try {
      const updatedMenu = await this.foodMenuRepo.updateFoodMenu(id, data);
      if (!updatedMenu) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Food menu updated successfully",
        data: updatedMenu,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to update food menu", HttpStatus.BAD_REQUEST);
    }
  }

  async deleteFoodMenu(
    id: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<FoodMenuResponseDTO> {
    try {
      const result = await this.foodMenuRepo.deleteFoodMenu(id, day, mealType);
      if (!result) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Food menu deleted successfully",
        data: result,
      };
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
    data: AddSingleDayMenuDTO
  ): Promise<FoodMenuResponseDTO> {
    try {
      const menu = await this.foodMenuRepo.addSingleDayMenu(
        providerId,
        data.facilityId,
        data.hostelId,
        data.day,
        data.meals
      );
      if (!menu) {
        throw new AppError("Menu not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: "Day menu updated successfully",
        data: menu,
      };
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
    data: CancelMealDTO
  ): Promise<FoodMenuResponseDTO> {
    try {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const currentDay = days[new Date().getDay()];

      if (data.day === currentDay) {
        throw new AppError(
          "Cannot cancel or restore meals for the current day",
          HttpStatus.BAD_REQUEST
        );
      }

      const result = await this.foodMenuRepo.cancelMeal(
        id,
        data.day,
        data.mealType,
        data.isAvailable
      );
      if (!result) {
        throw new AppError("Food menu not found", HttpStatus.NOT_FOUND);
      }
      return {
        success: true,
        message: `Meal ${
          data.isAvailable ? "restored" : "cancelled"
        } successfully`,
        data: result,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(
        "Failed to update meal availability",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const foodMenuService = Container.get(FoodMenuService);
