import { Request, Response } from "express";
import { Service } from "typedi";
import { foodMenuService } from "../../../../services/implements/facility/food/foodMenu.service";
import { AppError } from "../../../../utils/error";
import { AuthRequset } from "../../../../types/api";
import { S3Service } from "../../../../services/implements/s3/s3.service";
import IS3service from "../../../../services/interface/s3/s3.service.interface";
import { IFoodMenuService } from "../../../../services/interface/facility/food/foodMenu.service.interface";
import { HttpStatus } from "../../../../enums/http.status";

interface FoodMenuItem {
  _id: string;
  name: string;
  image?: string;
}

interface Meal {
  isAvailable: boolean;
  items: FoodMenuItem[];
}

interface DayMenu {
  day: string;
  meals: {
    morning: Meal;
    noon: Meal;
    night: Meal;
  };
}

interface PlainFoodMenu {
  menu: DayMenu[];
  // add other properties if needed
}

@Service()
export class FoodMenuController {
  private s3Service: IS3service;
  private foodMenuService: IFoodMenuService;

  constructor() {
    this.s3Service = S3Service;
    this.foodMenuService = foodMenuService;
  }

  //  Get food menu :-

  async getFoodMenu(req: Request, res: Response): Promise<Response> {
    try {
      const { facilityId, hostelId } = req.params;

      if (!facilityId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid facility ID",
        });
      }

      const foodMenuDoc = await this.foodMenuService.getFoodMenu(
        facilityId,
        hostelId
      );
      const plainFoodMenu = foodMenuDoc.data?.toObject() as PlainFoodMenu;

      //  Taking all day and meals :-

      const foodMenu = {
        ...plainFoodMenu,
        menu: await Promise.all(
          plainFoodMenu.menu.map(async (day) => ({
            day: day.day,
            meals: {
              morning: {
                isAvailable: day.meals.morning.isAvailable,
                items: await Promise.all(
                  (day.meals.morning.items || []).map(async (item) => ({
                    _id: item._id,
                    name: item.name,
                    image: item.image
                      ? await this.s3Service.generateSignedUrl(item.image)
                      : null,
                  }))
                ),
              },
              noon: {
                isAvailable: day.meals.noon.isAvailable,
                items: await Promise.all(
                  (day.meals.noon.items || []).map(async (item) => ({
                    _id: item._id,
                    name: item.name,
                    image: item.image
                      ? await this.s3Service.generateSignedUrl(item.image)
                      : null,
                  }))
                ),
              },
              night: {
                isAvailable: day.meals.night.isAvailable,
                items: await Promise.all(
                  (day.meals.night.items || []).map(async (item) => ({
                    _id: item._id,
                    name: item.name,
                    image: item.image
                      ? await this.s3Service.generateSignedUrl(item.image)
                      : null,
                  }))
                ),
              },
            },
          }))
        ),
      };

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: foodMenu,
      });
    } catch (error) {
      if (
        error instanceof AppError &&
        error.message === "Food menu not found"
      ) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "error",
          message: "Food menu not found",
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Update food menu :-

  async updateFoodMenu(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const menuData = req.body;

      if (!id) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid menu ID",
        });
      }

      const updatedMenu = await this.foodMenuService.updateFoodMenu(
        id,
        menuData
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Food menu updated successfully",
        data: updatedMenu,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Delete food menu :-

  async deleteFoodMenu(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { foodMenuId, day, mealType } = req.body;

      if (!id || !foodMenuId || !day || !mealType) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Missing required parameters",
        });
      }

      const result = await this.foodMenuService.deleteFoodMenu(
        foodMenuId,
        id,
        day,
        mealType
      );

      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "error",
          message: "Food menu not found",
        });
      }

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Food menu item deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Delete food menu error:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Add single day menu meal :-

  async addSingleDayMenu(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const { facilityId, hostelId, day, meals } = req.body;
      const providerId = req.user?.id;

      if (!providerId || !facilityId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid provider or facility ID",
        });
      }

      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];

      if (!validDays.includes(day)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid day provided",
        });
      }

      if (!meals || Object.keys(meals).length === 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Meals data is required",
        });
      }

      const updatedMenu = await this.foodMenuService.addSingleDayMenu(
        providerId,
        { facilityId, hostelId, day, meals }
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Day menu updated successfully",
        data: updatedMenu,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Cancel meal by user :-

  async cancelMeal(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { day, mealType, isAvailable } = req.body;

      if (!id || !day || !mealType || isAvailable === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Missing required parameters",
        });
      }

      if (!["morning", "noon", "night"].includes(mealType)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid meal type. Must be morning, noon, or night.",
        });
      }

      const validDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ];
      if (!validDays.includes(day)) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Invalid day provided",
        });
      }

      await this.foodMenuService.cancelMeal(id, {
        day,
        mealType: mealType as "morning" | "noon" | "night",
        isAvailable,
      });

      return res.status(HttpStatus.OK).json({
        status: "success",
        message: `Meal ${isAvailable ? "restored" : "cancelled"} successfully`,
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
}

export const foodMenuController = new FoodMenuController();
