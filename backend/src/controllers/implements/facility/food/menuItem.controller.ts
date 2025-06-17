import { Response } from "express";
import { Service } from "typedi";
import { menuItemService } from "../../../../services/implements/facility/food/menuItem.service";
import { AuthRequset } from "../../../../types/api";
import { IMenuItem } from "../../../../models/facility/Food/menuItem.model";
import { S3Service } from "../../../../services/implements/s3/s3.service";
import IS3service from "../../../../services/interface/s3/s3.service.interface";
import { IMenuItemService } from "../../../../services/interface/facility/food/menuItem.service.interface";

@Service()
export class MenuItemController {
  private s3Service: IS3service;
  private menuItemService: IMenuItemService;

  constructor() {
    this.s3Service = S3Service;
    this.menuItemService = menuItemService;
  }

  //  Create menu item :-

  async createMenuItem(req: AuthRequset, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          status: "error",
          message: "Image file is required",
        });
        return;
      }

      const uploadResult = await this.s3Service.uploadFile(
        req.file,
        "menuImage"
      );

      if (
        !uploadResult ||
        !("Location" in uploadResult) ||
        Array.isArray(uploadResult)
      ) {
        res.status(500).json({
          status: "error",
          message: "Failed to upload image",
        });
        return;
      }

      const menuItemData: Partial<IMenuItem> = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: uploadResult.Location,
      };

      const newMenuItem = await this.menuItemService.createMenuItem(
        menuItemData as IMenuItem
      );
      res.status(201).json({
        status: "success",
        data: newMenuItem,
      });
    } catch (error) {
      console.error("Error in createMenuItem:", error);
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Get all menu item's :-

  async getAllMenuItems(req: AuthRequset, res: Response): Promise<void> {
    try {
      const menuItems = await this.menuItemService.getAllMenuItems();

      const menuItemsWithSignedUrls = await Promise.all(
        (menuItems.data as IMenuItem[])?.map(
          async (item: { image: string; toObject: () => any }) => {
            const signedUrl = await this.s3Service.generateSignedUrl(
              item.image
            );
            return {
              ...item.toObject(),
              image: signedUrl,
            };
          }
        )
      );

      res.status(200).json({
        status: "success",
        data: menuItemsWithSignedUrls,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Get menuItem by category :-

  async getMenuItemsByCategory(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const menuItems = await this.menuItemService.getMenuItemsByCategory(
        category
      );
      res.status(200).json({
        status: "success",
        data: menuItems,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Get single menuItem :-

  async getMenuItem(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const menuItem = await this.menuItemService.getMenuItem(id);
      if (!menuItem) {
        res.status(404).json({
          status: "error",
          message: "Menu item not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: menuItem,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Update menuItem :-

  async updateMenuItem(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!req.file) {
        res.status(400).json({
          status: "error",
          message: "Image file is required",
        });
        return;
      }

      const uploadResult = await this.s3Service.uploadFile(
        req.file,
        "menuImage"
      );

      if (
        !uploadResult ||
        !("Location" in uploadResult) ||
        Array.isArray(uploadResult)
      ) {
        res.status(500).json({
          status: "error",
          message: "Failed to upload image",
        });
        return;
      }

      const menuItemData: Partial<IMenuItem> = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        image: uploadResult.Location,
      };
      const updatedMenuItem = await this.menuItemService.updateMenuItem(
        id,
        menuItemData as IMenuItem
      );
      if (!updatedMenuItem) {
        res.status(404).json({
          status: "error",
          message: "Menu item not found",
        });
      }
      res.status(200).json({
        status: "success",
        data: updatedMenuItem,
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Delete mneuItem :-

  async deleteMenuItem(req: AuthRequset, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.menuItemService.deleteMenuItem(id);
      res.status(200).json({
        status: "success",
        message: "Menu item deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
}

export const menuItemController = new MenuItemController();
