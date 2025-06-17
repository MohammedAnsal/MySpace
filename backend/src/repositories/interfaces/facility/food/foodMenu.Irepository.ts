import { IFoodMenu } from "../../../../models/facility/Food/foodMenu.model";
import { IDayMeal } from "../../../../models/facility/Food/foodMenu.model";

export interface IFoodMenuRepository {
  updateFoodMenu(
    menuId: string,
    menuData: Partial<IFoodMenu>
  ): Promise<IFoodMenu | null>;
  deleteFoodMenu(
    foodMenuId: string,
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<IFoodMenu | null>;
  getFoodMenuById(menuId: string): Promise<IFoodMenu | null>;
  getFoodMenuByFacility(
    facilityId: string,
    hostelId: string
  ): Promise<IFoodMenu | null>;
  updateDayMeal(
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    menuItems: string[]
  ): Promise<IFoodMenu | null>;
  getDayMeal(menuId: string, day: string): Promise<IDayMeal | null>;
  toggleMealAvailability(
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    isAvailable: boolean
  ): Promise<IFoodMenu | null>;
  cancelMeal(
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    isAvailable: boolean
  ): Promise<IFoodMenu | null>;
  addSingleDayMenu(
    providerId: string,
    facilityId: string,
    hostelId: string,
    day: string,
    meals: {
      morning?: string[];
      noon?: string[];
      night?: string[];
    }
  ): Promise<IFoodMenu>;
}
