import { IFoodMenu } from "../../../../models/facility/Food/foodMenu.model";

export interface IFoodMenuService {
  // createFoodMenu(
  //   providerId: string,
  //   facilityId: string,
  //   menu: IFoodMenu
  // ): Promise<IFoodMenu>;
  getFoodMenu(id: string, hostelId: string): Promise<IFoodMenu>;
  updateFoodMenu(id: string, menu: IFoodMenu): Promise<IFoodMenu>;
  deleteFoodMenu(
    id: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<void>;
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
  cancelMeal(
    id: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    isAvailable: boolean
  ): Promise<IFoodMenu>;
}
