import { Response } from "express";
import { Service } from "typedi";
import { menuItemService } from "../../../../services/implements/facility/food/menuItem.service";
import { AuthRequset } from "../../../../types/api";
import { IMenuItem } from "../../../../models/facility/Food/menuItem.model";
import { S3Service } from "../../../../services/implements/s3/s3.service";
import IS3service from "../../../../services/interface/s3/s3.service.interface";
import { IMenuItemService } from "../../../../services/interface/facility/food/menuItem.service.interface";
import { HttpStatus } from "../../../../enums/http.status";

@Service()
export class MenuItemController {
  private s3Service: IS3service;
  private menuItemService: IMenuItemService;

  constructor() {
    this.s3Service = S3Service;
    this.menuItemService = menuItemService;
  }

  //  Create menu item :-

  async createMenuItem(req: AuthRequset, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Image file is required",
        });
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
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Failed to upload image",
        });
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
      return res.status(HttpStatus.CREATED).json({
        status: "success",
        data: newMenuItem,
      });
    } catch (error) {
      console.error("Error in createMenuItem:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Get all menu item's :-

  async getAllMenuItems(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const menuItems = await this.menuItemService.getAllMenuItems();

      const menuItemsWithSignedUrls = await Promise.all(
        (menuItems.data as IMenuItem[])?.map(
          async (item: IMenuItem & { toObject: () => IMenuItem }) => {
            const signedUrl = await this.s3Service.generateSignedUrl(item.image);
            return {
              ...item.toObject(),
              image: signedUrl,
            };
          }
        )
      );

      return res.status(HttpStatus.OK).json({
        status: "success",
        data: menuItemsWithSignedUrls,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Get menuItem by category :-

  async getMenuItemsByCategory(
    req: AuthRequset,
    res: Response
  ): Promise<Response> {
    try {
      const { category } = req.params;
      const menuItems = await this.menuItemService.getMenuItemsByCategory(
        category
      );
      return res.status(HttpStatus.OK).json({
        status: "success",
        data: menuItems,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Get single menuItem :-

  async getMenuItem(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const menuItem = await this.menuItemService.getMenuItem(id);
      if (!menuItem) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "error",
          message: "Menu item not found",
        });
      }
      return res.status(HttpStatus.OK).json({
        status: "success",
        data: menuItem,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Update menuItem :-

  async updateMenuItem(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: "error",
          message: "Image file is required",
        });
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
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          status: "error",
          message: "Failed to upload image",
        });
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
        return res.status(HttpStatus.NOT_FOUND).json({
          status: "error",
          message: "Menu item not found",
        });
      }
      return res.status(HttpStatus.OK).json({
        status: "success",
        data: updatedMenuItem,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  //  Delete mneuItem :-

  async deleteMenuItem(req: AuthRequset, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      await this.menuItemService.deleteMenuItem(id);
      return res.status(HttpStatus.OK).json({
        status: "success",
        message: "Menu item deleted successfully",
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }
}

export const menuItemController = new MenuItemController();
