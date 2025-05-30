import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByCategory,
  updateMenuItem,
  deleteMenuItem,
  getFoodMenu,
  updateFoodMenu,
  deleteFoodMenu,
  addSingleDayMenu,
  getProviderWashingRequests,
  updateWashingRequestStatus,
  getProviderCleaningRequests,
  updateCleaningRequestStatus,
} from "@/services/Api/providerApi";

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  category: "Breakfast" | "Lunch" | "Dinner";
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMeal {
  items: string[];
  isAvailable: boolean;
}

export interface IDayMeal {
  day: string;
  meals: {
    morning: IMeal;
    noon: IMeal;
    night: IMeal;
  };
}

export interface IFoodMenu {
  _id: string;
  facilityId: string;
  providerId: string;
  menu: IDayMeal[];
  createdAt: string;
  updatedAt: string;
}

export interface WashingRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  hostelId: {
    _id: string;
    hostel_name: string;
    location: string;
  };
  requestedDate: string;
  preferredTimeSlot: string;
  itemsCount: number;
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  feedback?: {
    rating: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CleaningRequest {
  _id: string;
  userId: {
    _id: string;
    fullName: string;
    email: string;
  };
  hostelId: {
    _id: string;
    hostel_name: string;
    location: string;
  };
  requestedDate: string;
  preferredTimeSlot: string;
  specialInstructions?: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  feedback?: {
    rating: number;
    comment?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Menu Items Hooks
export const useMenuItems = () => {
  return useQuery<MenuItem[]>({
    queryKey: ["menu-items"],
    queryFn: async () => {
      const response = await getAllMenuItems();
      return response?.data || [];
    },
  });
};

export const useMenuItemsByCategory = (category: string) => {
  return useQuery<MenuItem[]>({
    queryKey: ["menu-items", category],
    queryFn: async () => {
      const response = await getMenuItemsByCategory(category);
      return response?.data || [];
    },
    enabled: !!category,
  });
};

export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => createMenuItem(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      updateMenuItem(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMenuItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-items"] });
    },
  });
};

// Food Menu Hooks
export const useFoodMenu = (facilityId: string, hostelId: string) => {
  return useQuery<IFoodMenu>({
    queryKey: ["food-menu", facilityId],
    queryFn: async () => {
      const response = await getFoodMenu(facilityId, hostelId);
      return response?.data;
    },
    enabled: !!facilityId,
    refetchOnMount: true,
    staleTime: 0,
  });
};

export const useUpdateFoodMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      menuData,
    }: {
      id: string;
      menuData: Partial<IFoodMenu>;
    }) => updateFoodMenu(id, menuData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["food-menu", variables.id],
      });
    },
  });
};

export const useDeleteFoodMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, day, mealType }: { 
      id: string; 
      day: string; 
      mealType: "morning" | "noon" | "night" 
    }) => deleteFoodMenu(id, day, mealType),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["food-menu"],
      });
    },
  });
};

export const useAddSingleDayMenu = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      facilityId,
      hostelId,
      day,
      meals,
    }: {
      facilityId: string;
      hostelId: string;
      day: string;
      meals: {
        morning?: string[];
        noon?: string[];
        night?: string[];
      };
    }) => addSingleDayMenu(facilityId, hostelId, day, meals),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["food-menu", variables.facilityId],
      });
    },
  });
};

// Washing Requests Hooks
const fetchProviderWashingRequests = async (): Promise<WashingRequest[]> => {
  try {
    const response = await getProviderWashingRequests();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching provider washing requests:", error);
    return [];
  }
};

export const useProviderWashingRequests = () => {
  return useQuery<WashingRequest[]>({
    queryKey: ["provider-washing-requests"],
    queryFn: fetchProviderWashingRequests,
  });
};

export const useUpdateWashingStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateWashingRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-washing-requests"] });
    },
  });
};

// Cleaning Requests Hooks
const fetchProviderCleaningRequests = async (): Promise<CleaningRequest[]> => {
  try {
    const response = await getProviderCleaningRequests();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching provider cleaning requests:", error);
    return [];
  }
};

export const useProviderCleaningRequests = () => {
  return useQuery<CleaningRequest[]>({
    queryKey: ["provider-cleaning-requests"],
    queryFn: fetchProviderCleaningRequests,
  });
};

export const useUpdateCleaningStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateCleaningRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-cleaning-requests"] });
    },
  });
};