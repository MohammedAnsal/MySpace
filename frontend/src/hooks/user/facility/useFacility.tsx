import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFoodMenu,
  getUserWashingRequests,
  createWashingRequest,
  cancelWashingRequest,
  getUserCleaningRequests,
  createCleaningRequest,
  cancelCleaningRequest,
  addCleaningFeedback,
} from "@/services/Api/userApi";

export const useFoodMenu = (facilityId: string, hostelId: string) => {
  return useQuery({
    queryKey: ["food-menu", facilityId],
    queryFn: async () => {
      try {
        const response = await getFoodMenu(facilityId, hostelId);
        return response?.data;
      } catch (error: any) {
        if (error.response?.data?.message === "Food menu not found") {
          return null;
        }
        throw error;
      }
    },
    enabled: !!facilityId,
  });
};

export const useUserWashingRequests = () => {
  return useQuery({
    queryKey: ["washing-requests"],
    queryFn: () => getUserWashingRequests(),
    refetchOnWindowFocus: true,
  });
};

export const useCreateWashingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      providerId: string;
      hostelId: string;
      facilityId: string;
      requestedDate: string;
      preferredTimeSlot: string;
      itemsCount: number;
      specialInstructions?: string;
    }) => createWashingRequest(data),
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: ["washing-requests"] });
      const previousRequests = queryClient.getQueryData(["washing-requests"]);

      queryClient.setQueryData(["washing-requests"], (old: any) => {
        const newBooking = {
          _id: `temp-${Date.now()}`,
          status: "Pending",
          requestedDate: newRequest.requestedDate,
          preferredTimeSlot: newRequest.preferredTimeSlot,
          itemsCount: newRequest.itemsCount,
          specialInstructions: newRequest.specialInstructions || "",
          createdAt: new Date().toISOString(),
          providerId: newRequest.providerId,
          hostelId: newRequest.hostelId,
          facilityId: newRequest.facilityId,
        };

        // Handle case where old.data might not exist or be an array
        const existingData = Array.isArray(old?.data) ? old.data : [];
        return {
          ...old,
          data: [newBooking, ...existingData],
        };
      });

      return { previousRequests };
    },
    onError: (err, newRequest, context) => {
      console.error(err);
      console.info(newRequest);
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["washing-requests"], context?.previousRequests);
    },
    onSuccess: (response, variables) => {
      // Update the optimistic entry with real data from server
      queryClient.setQueryData(["washing-requests"], (old: any) => {
        if (!old?.data) return old;

        const updatedData = old.data.map((item: any) => {
          // Find the temporary item and replace with real data
          if (
            item._id.startsWith("temp-") &&
            item.requestedDate === variables.requestedDate &&
            item.preferredTimeSlot === variables.preferredTimeSlot
          ) {
            return {
              ...item,
              _id: response?.data?._id || item._id,
              ...response?.data,
            };
          }
          return item;
        });

        return {
          ...old,
          data: updatedData,
        };
      });
    },
  });
};

export const useCancelWashingRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelWashingRequest(id),
    onMutate: async (requestId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["washing-requests"] });

      // Snapshot the previous value
      const previousRequests = queryClient.getQueryData(["washing-requests"]);

      // Optimistically update the status to "Cancelled"
      queryClient.setQueryData(["washing-requests"], (old: any) => {
        if (!old?.data) return old;

        const updatedData = old.data.map((item: any) => {
          if (item._id === requestId) {
            return {
              ...item,
              status: "Cancelled",
            };
          }
          return item;
        });

        return {
          ...old,
          data: updatedData,
        };
      });

      // Return a context object with the snapshotted value
      return { previousRequests };
    },
    onError: (err, requestId, context) => {
      console.error(err);
      console.info(requestId);
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["washing-requests"], context?.previousRequests);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      // This is optional - you can remove this if you want to rely purely on optimistic updates
      // queryClient.invalidateQueries({ queryKey: ["washing-requests"] });
    },
  });
};

export const useUserCleaningRequests = () => {
  return useQuery({
    queryKey: ["cleaning-requests"],
    queryFn: () => getUserCleaningRequests(),
    refetchOnWindowFocus: true,
  });
};

export const useCreateCleaningRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      providerId: string;
      hostelId: string;
      facilityId: string;
      requestedDate: string;
      preferredTimeSlot: string;
      specialInstructions?: string;
    }) => createCleaningRequest(data),
    onMutate: async (newRequest) => {
      await queryClient.cancelQueries({ queryKey: ["cleaning-requests"] });

      const previousRequests = queryClient.getQueryData(["cleaning-requests"]);

      queryClient.setQueryData(["cleaning-requests"], (old: any) => {
        if (!old?.data) return old;

        const newBooking = {
          _id: `temp-${Date.now()}`,
          status: "Pending",
          requestedDate: newRequest.requestedDate,
          preferredTimeSlot: newRequest.preferredTimeSlot,
          specialInstructions: newRequest.specialInstructions || "",
          createdAt: new Date().toISOString(),
          providerId: newRequest.providerId,
          hostelId: newRequest.hostelId,
          facilityId: newRequest.facilityId,
        };

        return {
          ...old,
          data: [newBooking, ...old.data],
        };
      });

      return { previousRequests };
    },
    onError: (err, newRequest, context) => {
      console.error(err);
      console.info(newRequest);
      queryClient.setQueryData(
        ["cleaning-requests"],
        context?.previousRequests
      );
    },
    onSuccess: (response, variables) => {
      queryClient.setQueryData(["cleaning-requests"], (old: any) => {
        if (!old?.data) return old;

        const updatedData = old.data.map((item: any) => {
          if (
            item._id.startsWith("temp-") &&
            item.requestedDate === variables.requestedDate &&
            item.preferredTimeSlot === variables.preferredTimeSlot
          ) {
            return {
              ...item,
              _id: response?.data?._id || item._id,
              ...response?.data,
            };
          }
          return item;
        });

        return {
          ...old,
          data: updatedData,
        };
      });
    },
  });
};

export const useCancelCleaningRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelCleaningRequest(id),
    onMutate: async (requestId) => {
      await queryClient.cancelQueries({ queryKey: ["cleaning-requests"] });

      const previousRequests = queryClient.getQueryData(["cleaning-requests"]);

      queryClient.setQueryData(["cleaning-requests"], (old: any) => {
        if (!old?.data) return old;

        const updatedData = old.data.map((item: any) => {
          if (item._id === requestId) {
            return {
              ...item,
              status: "Cancelled",
            };
          }
          return item;
        });

        return {
          ...old,
          data: updatedData,
        };
      });

      return { previousRequests };
    },
    onError: (err, requestId, context) => {
      console.error(err);
      console.info(requestId);
      queryClient.setQueryData(
        ["cleaning-requests"],
        context?.previousRequests
      );
    },
  });
};

export const useAddCleaningFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      rating,
      comment,
    }: {
      id: string;
      rating: number;
      comment?: string;
    }) => addCleaningFeedback(id, rating, comment),
    onMutate: async ({ id, rating, comment }) => {
      await queryClient.cancelQueries({ queryKey: ["cleaning-requests"] });

      const previousRequests = queryClient.getQueryData(["cleaning-requests"]);

      queryClient.setQueryData(["cleaning-requests"], (old: any) => {
        if (!old?.data) return old;

        const updatedData = old.data.map((item: any) => {
          if (item._id === id) {
            return {
              ...item,
              feedback: {
                rating,
                comment: comment || "",
                submittedAt: new Date().toISOString(),
              },
            };
          }
          return item;
        });

        return {
          ...old,
          data: updatedData,
        };
      });

      return { previousRequests };
    },
    onError: (err, variables, context) => {
      console.error(err);
      console.info(variables);
      queryClient.setQueryData(
        ["cleaning-requests"],
        context?.previousRequests
      );
    },
  });
};
