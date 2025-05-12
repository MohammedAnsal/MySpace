import Container, { Service } from "typedi";
import { IFoodMenuRepository } from "../../../interfaces/facility/food/foodMenu.Irepository";
import FoodMenu, { IFoodMenu } from "../../../../models/facility/Food/foodMenu.model";
import { Types, HydratedDocument } from "mongoose";

@Service()
export class FoodMenuRepository implements IFoodMenuRepository {
  // async createFoodMenu(
  //   providerId: string,
  //   facilityId: string
  // ): Promise<IFoodMenu> {
  //   const foodMenu = new FoodMenu({
  //     providerId,
  //     facilityId,
  //     menu: [
  //       {
  //         day: "Monday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //       {
  //         day: "Tuesday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //       {
  //         day: "Wednesday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //       {
  //         day: "Thursday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //       {
  //         day: "Friday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //       {
  //         day: "Saturday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //       {
  //         day: "Sunday",
  //         meals: {
  //           morning: { items: [], isAvailable: true },
  //           noon: { items: [], isAvailable: true },
  //           night: { items: [], isAvailable: true },
  //         },
  //       },
  //     ],
  //   });
  //   return await foodMenu.save();
  // }

  async updateFoodMenu(
    menuId: string,
    menuData: Partial<IFoodMenu>
  ): Promise<IFoodMenu | null> {
    return await FoodMenu.findByIdAndUpdate(
      menuId,
      { $set: menuData },
      { new: true }
    );
  }

  async deleteFoodMenu(
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<IFoodMenu | null> {
    const updatePath = `menu.$.meals.${mealType}.items`;

    return await FoodMenu.findOneAndUpdate(
      { "menu.day": day },
      { $pull: { [updatePath]: new Types.ObjectId(menuId) } },
      { new: true }
    ).populate(
      "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items"
    );
  }

  async getFoodMenuById(menuId: string): Promise<IFoodMenu | null> {
    return await FoodMenu.findById(menuId)
      .populate("menu.meals.morning.items")
      .populate("menu.meals.noon.items")
      .populate("menu.meals.night.items");
  }

  async getFoodMenuByFacility(
    facilityId: string,
    hostelId: string
  ): Promise<IFoodMenu | null> {
    return await FoodMenu.findOne({ facilityId, hostelId }).populate({
      path: "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items",
      select: "_id name image", // Only select the fields we need
    });
  }

  async getFoodMenuByProvider(providerId: string): Promise<IFoodMenu[]> {
    return await FoodMenu.find({ providerId })
      .populate("menu.meals.morning.items")
      .populate("menu.meals.noon.items")
      .populate("menu.meals.night.items");
  }

  async updateDayMeal(
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    menuItems: string[]
  ): Promise<IFoodMenu | null> {
    const updatePath = `menu.$.meals.${mealType}.items`;
    return await FoodMenu.findOneAndUpdate(
      { _id: menuId, "menu.day": day },
      { $set: { [updatePath]: menuItems.map((id) => new Types.ObjectId(id)) } },
      { new: true }
    ).populate(
      "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items"
    );
  }

  async getDayMeal(menuId: string, day: string): Promise<any | null> {
    const menu = await FoodMenu.findOne(
      { _id: menuId },
      { menu: { $elemMatch: { day } } }
    )
      .populate("menu.meals.morning.items")
      .populate("menu.meals.noon.items")
      .populate("menu.meals.night.items");

    return menu?.menu[0] || null;
  }

  async toggleMealAvailability(
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night",
    isAvailable: boolean
  ): Promise<IFoodMenu | null> {
    const updatePath = `menu.$.meals.${mealType}.isAvailable`;
    return await FoodMenu.findOneAndUpdate(
      { _id: menuId, "menu.day": day },
      { $set: { [updatePath]: isAvailable } },
      { new: true }
    ).populate(
      "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items"
    );
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
      let newMenu;
      let foodMenuId;
      let foodMenu = (await FoodMenu.findOne({
        facilityId,
        hostelId,
      })) as HydratedDocument<IFoodMenu>;

      if (!foodMenu) {
        const newFoodMenu = new FoodMenu({
          providerId: new Types.ObjectId(providerId),
          facilityId: new Types.ObjectId(facilityId),
          hostelId: new Types.ObjectId(hostelId),
          menu: [
            {
              day: "Monday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
            {
              day: "Tuesday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
            {
              day: "Wednesday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
            {
              day: "Thursday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
            {
              day: "Friday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
            {
              day: "Saturday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
            {
              day: "Sunday",
              meals: {
                morning: { items: [], isAvailable: true },
                noon: { items: [], isAvailable: true },
                night: { items: [], isAvailable: true },
              },
            },
          ],
        });

        try {
          newMenu = await newFoodMenu.save();
        } catch (saveError) {
          console.error("Save error:", saveError);
          throw saveError;
        }
      }

      if (!foodMenu) {
        console.log("keriii - 1");

        if (!newMenu?._id) {
          console.error("Food menu is still null after save attempt");
          throw new Error("Failed to create food menu");
        }

        const updateOperations = [];

        foodMenuId = String(newMenu._id);

        if (meals.morning?.length) {
          console.log("o");
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "morning", meals.morning)
          );
        }

        console.log("uuu");

        if (meals.noon?.length) {
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "noon", meals.noon)
          );
        }

        if (meals.night?.length) {
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "night", meals.night)
          );
        }

        await Promise.all(updateOperations);

        const updatedMenu = await FoodMenu.findById(foodMenuId)
          .populate("menu.meals.morning.items")
          .populate("menu.meals.noon.items")
          .populate("menu.meals.night.items");

        if (!updatedMenu) {
          throw new Error("Failed to retrieve updated menu");
        }

        console.log("good");
        return updatedMenu;
      } else {
        console.log("keriii - 2");
        if (!foodMenu?._id) {
          console.error("Food menu is still null after save attempt");
          throw new Error("Failed to create food menu");
        }

        const updateOperations = [];

        foodMenuId = String(foodMenu._id);

        if (meals.morning?.length) {
          console.log("o");
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "morning", meals.morning)
          );
        }

        console.log("uuu");

        if (meals.noon?.length) {
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "noon", meals.noon)
          );
        }

        if (meals.night?.length) {
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "night", meals.night)
          );
        }

        await Promise.all(updateOperations);

        const updatedMenu = await FoodMenu.findById(foodMenuId)
          .populate("menu.meals.morning.items")
          .populate("menu.meals.noon.items")
          .populate("menu.meals.night.items");

        if (!updatedMenu) {
          throw new Error("Failed to retrieve updated menu");
        }

        console.log("good");
        return updatedMenu;
      }
    } catch (error) {
      console.error("Error in addSingleDayMenu:", error);
      throw error;
    }
  }

  async cancelMeal(
    menuId: string, 
    day: string, 
    mealType: "morning" | "noon" | "night", 
    isAvailable: boolean
  ): Promise<IFoodMenu | null> {
    const updatePath = `menu.$.meals.${mealType}.isAvailable`;
    
    return await FoodMenu.findOneAndUpdate(
      { _id: menuId, "menu.day": day },
      { $set: { [updatePath]: isAvailable } },
      { new: true }
    ).populate(
      "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items"
    );
  }
}

export const foodMenuRepository = Container.get(FoodMenuRepository);
