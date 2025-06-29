import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createFacility,
  findAllFacilities,
  updateFacilityStatus,
  deleteFacility,
  updateFacility
} from '@/services/Api/admin/adminApi';

export const useAdminFacilities = () => {
  const queryClient = useQueryClient();

  // Query for fetching all facilities
  const {
    data: facilities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['admin-facilities'],
    queryFn: findAllFacilities,
  });

  // Mutation for creating a facility
  const { mutate: addFacility, isPending: isCreating } = useMutation({
    mutationFn: createFacility,
    onSuccess: () => {
      // Invalidate and refetch facilities after successful creation
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
    },
  });

  // Mutation for updating facility status
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ facilityId, status }: { facilityId: string; status: boolean }) =>
      updateFacilityStatus(facilityId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
    },
  });

  // Mutation for updating a facility
  const { mutate: updateFacilityData, isPending: isUpdatingFacility } = useMutation({
    mutationFn: ({ facilityId, facilityData }: { facilityId: string; facilityData: any }) =>
      updateFacility(facilityId, facilityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
    },
  });

  // Mutation for deleting a facility
  const { mutate: removeFacility, isPending: isDeleting } = useMutation({
    mutationFn: deleteFacility,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-facilities'] });
    },
  });

  return {
    facilities: facilities?.data?.facilityData || [],
    isLoading,
    error,
    addFacility,
    isCreating,
    updateStatus,
    isUpdating,
    updateFacilityData,
    isUpdatingFacility,
    removeFacility,
    isDeleting,
  };
};