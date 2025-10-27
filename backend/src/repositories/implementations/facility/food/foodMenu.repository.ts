import Container, { Service } from "typedi";
import { IFoodMenuRepository } from "../../../interfaces/facility/food/foodMenu.Irepository";
import FoodMenu, {
  IFoodMenu,
  IDayMeal,
} from "../../../../models/facility/Food/foodMenu.model";
import { Types, HydratedDocument } from "mongoose";

@Service()
export class FoodMenuRepository implements IFoodMenuRepository {
  //  For update foodMenu :-

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

  //  For delete foodMenu (single Meal) :-

  async deleteFoodMenu(
    foodMenuId: string,
    menuId: string,
    day: string,
    mealType: "morning" | "noon" | "night"
  ): Promise<IFoodMenu | null> {
    const menu = await FoodMenu.findById(foodMenuId);
    if (!menu) {
      return null;
    }

    return await FoodMenu.findOneAndUpdate(
      { _id: foodMenuId },
      {
        $pull: {
          [`menu.$[elem].meals.${mealType}.items`]: new Types.ObjectId(menuId),
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem.day": day }],
      }
    ).populate(
      "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items"
    );
  }

  //  For get single food menu :-

  async getFoodMenuById(menuId: string): Promise<IFoodMenu | null> {
    return await FoodMenu.findById(menuId)
      .populate("menu.meals.morning.items")
      .populate("menu.meals.noon.items")
      .populate("menu.meals.night.items");
  }

  //  For get foodMenu by facility :-

  async getFoodMenuByFacility(
    facilityId: string,
    hostelId: string
  ): Promise<IFoodMenu | null> {
    return await FoodMenu.findOne({ facilityId, hostelId }).populate({
      path: "menu.meals.morning.items menu.meals.noon.items menu.meals.night.items",
      select: "_id name image",
    });
  }

  //  For update dey meal :-

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

  //  For get day meal :-

  async getDayMeal(menuId: string, day: string): Promise<IDayMeal | null> {
    const menu = await FoodMenu.findOne(
      { _id: menuId },
      { menu: { $elemMatch: { day } } }
    )
      .populate("menu.meals.morning.items")
      .populate("menu.meals.noon.items")
      .populate("menu.meals.night.items");

    return menu?.menu[0] || null;
  }

  //  For available meal :-

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

  //  For add single day meal (Using the updateDayMeal fun) :-

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
        if (!newMenu?._id) {
          console.error("Food menu is still null after save attempt");
          throw new Error("Failed to create food menu");
        }

        const updateOperations = [];

        foodMenuId = String(newMenu._id);

        if (meals.morning?.length) {
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "morning", meals.morning)
          );
        }

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

        return updatedMenu;
      } else {
        if (!foodMenu?._id) {
          console.error("Food menu is still null after save attempt");
          throw new Error("Failed to create food menu");
        }

        const updateOperations = [];

        foodMenuId = String(foodMenu._id);

        if (meals.morning?.length) {
          updateOperations.push(
            this.updateDayMeal(foodMenuId, day, "morning", meals.morning)
          );
        }

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
        return updatedMenu;
      }
    } catch (error) {
      console.error("Error in addSingleDayMenu:", error);
      throw error;
    }
  }

  //  For user cancel day meal :-

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
