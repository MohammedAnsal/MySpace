import {
  UpdateFoodMenuDTO,
  AddSingleDayMenuDTO,
  CancelMealDTO,
  FoodMenuResponseDTO,
} from "../../../../dtos/facility/food/foodMenu.dto";

export interface IFoodMenuService {
  getFoodMenu(
    facilityId: string,
    hostelId: string
  ): Promise<FoodMenuResponseDTO>;
  updateFoodMenu(
    id: string,
    data: UpdateFoodMenuDTO
  ): Promise<FoodMenuResponseDTO>;
  deleteFoodMenu(
    foodMenuId: string,
    id: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<FoodMenuResponseDTO>;
  addSingleDayMenu(
    providerId: string,
    data: AddSingleDayMenuDTO
  ): Promise<FoodMenuResponseDTO>;
  cancelMeal(id: string, data: CancelMealDTO): Promise<FoodMenuResponseDTO>;
}
