import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getNotificationsByRecipient,
} from "@/services/Api/notificationApi";
import {
  INotification,
  CreateNotificationDTO,
  UpdateNotificationDTO,
} from "@/types/notification";

export const useNotification = (recipientId?: string) => {
  const queryClient = useQueryClient();

  // ✅ Fetch all notifications for a recipient
  const {
    data: notifications,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<INotification[], Error>({
    queryKey: ["notifications", recipientId],
    queryFn: () => {
      if (!recipientId) return Promise.resolve([]);
      return getNotificationsByRecipient(recipientId);
    },
    enabled: !!recipientId, // Only run if recipientId is defined
    refetchOnWindowFocus: true, // Auto refetch on tab focus
    staleTime: 1000 * 60, // 1 minute freshness
  });

  // ✅ Create a new notification
  const createMutation = useMutation({
    mutationFn: (data: CreateNotificationDTO) => createNotification(data),
    onSuccess: () => {
      if (recipientId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", recipientId],
        });
      }
    },
  });

  // ✅ Update a notification
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationDTO }) =>
      updateNotification(id, data),
    onSuccess: () => {
      if (recipientId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", recipientId],
        });
      }
    },
  });

  // ✅ Delete a notification
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      if (recipientId) {
        queryClient.invalidateQueries({
          queryKey: ["notifications", recipientId],
        });
      }
    },
  });

  // ✅ Get a single notification by ID (on-demand)
  const getById = (id: string) => getNotificationById(id);

  return {
    notifications,
    isLoading,
    isError,
    errorMessage: error?.message ?? null,
    refetchNotifications: refetch,

    createNotification: createMutation.mutateAsync,
    updateNotification: updateMutation.mutateAsync,
    deleteNotification: deleteMutation.mutateAsync,
    getNotificationById: getById,
  };
};
