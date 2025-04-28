import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { findAllFacilities } from '@/services/Api/providerApi';

export const useFacilities = () => {
  const queryClient = useQueryClient();

  // Query for fetching all facilities
  const {
    data: facilities,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['facilities'],
    queryFn: findAllFacilities,
  });
  // Mutation for creating a facility
  // const { mutate: addFacility, isPending: isCreating } = useMutation({
  //   mutationFn: createFacility,
  //   onSuccess: () => {
  //     // Invalidate and refetch facilities after successful creation
  //     queryClient.invalidateQueries({ queryKey: ['facilities'] });
  //   },
  // });

  // const { mutate: updateStatus, isPending: isUpdating } = useMutation({
  //   mutationFn: ({ facilityId, status }: { facilityId: string; status: boolean }) =>
  //     updateFacilityStatus(facilityId, status),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['facilities'] });
  //   },
  // });

  // const { mutate: removeFacility, isPending: isDeleting } = useMutation({
  //   mutationFn: deleteFacility,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ['facilities'] });
  //   },
  // });

  return {
    facilities: facilities?.data?.facilityData || [],
    isLoading,
    error,
    // addFacility,
    // isCreating,
    // updateStatus,
    // isUpdating,
    // removeFacility,
    // isDeleting,
  };
}; 