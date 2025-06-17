import { Request, Response } from "express";
import { Service } from "typedi";
import { foodMenuService } from "../../../../services/implements/facility/food/foodMenu.service";
import { AppError } from "../../../../utils/error";
import { AuthRequset } from "../../../../types/api";
import { S3Service } from "../../../../services/implements/s3/s3.service";
import IS3service from "../../../../services/interface/s3/s3.service.interface";
import { IFoodMenuService } from "../../../../services/interface/facility/food/foodMenu.service.interface";

@Service()
export class FoodMenuController {
  private s3Service: IS3service;
  private foodMenuService: IFoodMenuService;

  constructor() {
    this.s3Service = S3Service;
    this.foodMenuService = foodMenuService;
  }

  //  Get food menu :-

  async getFoodMenu(req: Request, res: Response): Promise<void> {
    try {
      const { facilityId, hostelId } = req.params;

      if (!facilityId) {
        res.status(400).json({
          status: "error",
          message: "Invalid facility ID",
        });
        return;
      }

      const foodMenuDoc = await this.foodMenuService.getFoodMenu(
        facilityId,
        hostelId
      );
      const plainFoodMenu = foodMenuDoc.data?.toObject() as {
        menu: Array<{ day: string; meals: any }>;
      };

      //  Taking all day and meals :-

      const foodMenu = {
        ...(plainFoodMenu as Record<string, any>),
        menu: await Promise.all(
          plainFoodMenu.menu.map(async (day: any) => ({
            day: day.day,
            meals: {
              morning: {
                isAvailable: day.meals.morning.isAvailable,
                items: await Promise.all(
                  (day.meals.morning.items || []).map(async (item: any) => ({
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
                  (day.meals.noon.items || []).map(async (item: any) => ({
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
                  (day.meals.night.items || []).map(async (item: any) => ({
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

      res.status(200).json({
        status: "success",
        data: foodMenu,
      });
    } catch (error) {
      if (
        error instanceof AppError &&
        error.message === "Food menu not found"
      ) {
        res.status(404).json({
          status: "error",
          message: "Food menu not found",
        });
        return;
      }
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Update food menu :-

  async updateFoodMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const menuData = req.body;

      if (!id) {
        res.status(400).json({
          status: "error",
          message: "Invalid menu ID",
        });
        return;
      }

      const updatedMenu = await this.foodMenuService.updateFoodMenu(
        id,
        menuData
      );

      res.status(200).json({
        status: "success",
        message: "Food menu updated successfully",
        data: updatedMenu,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Delete food menu :-

  async deleteFoodMenu(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { foodMenuId, day, mealType } = req.body;

      if (!id || !foodMenuId || !day || !mealType) {
        res.status(400).json({
          status: "error",
          message: "Missing required parameters",
        });
        return;
      }

      const result = await this.foodMenuService.deleteFoodMenu(
        foodMenuId,
        id,
        day,
        mealType
      );

      if (!result) {
        res.status(404).json({
          status: "error",
          message: "Food menu not found",
        });
        return;
      }

      res.status(200).json({
        status: "success",
        message: "Food menu item deleted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Delete food menu error:", error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Add single day menu meal :-

  async addSingleDayMenu(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { facilityId, hostelId, day, meals } = req.body;
      const providerId = req.user?.id;

      if (!providerId || !facilityId) {
        res.status(400).json({
          status: "error",
          message: "Invalid provider or facility ID",
        });
        return;
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
        res.status(400).json({
          status: "error",
          message: "Invalid day provided",
        });
        return;
      }

      if (!meals || Object.keys(meals).length === 0) {
        res.status(400).json({
          status: "error",
          message: "Meals data is required",
        });
        return;
      }

      const updatedMenu = await this.foodMenuService.addSingleDayMenu(
        providerId,
        { facilityId, hostelId, day, meals }
      );

      res.status(200).json({
        status: "success",
        message: "Day menu updated successfully",
        data: updatedMenu,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Cancel meal by user :-

  async cancelMeal(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { day, mealType, isAvailable } = req.body;

      if (!id || !day || !mealType || isAvailable === undefined) {
        res.status(400).json({
          status: "error",
          message: "Missing required parameters",
        });
        return;
      }

      if (!["morning", "noon", "night"].includes(mealType)) {
        res.status(400).json({
          status: "error",
          message: "Invalid meal type. Must be morning, noon, or night.",
        });
        return;
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
        res.status(400).json({
          status: "error",
          message: "Invalid day provided",
        });
        return;
      }

      await this.foodMenuService.cancelMeal(id, {
        day,
        mealType: mealType as "morning" | "noon" | "night",
        isAvailable,
      });

      res.status(200).json({
        status: "success",
        message: `Meal ${isAvailable ? "restored" : "cancelled"} successfully`,
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
}

export const foodMenuController = new FoodMenuController();
