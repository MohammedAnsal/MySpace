import { useQuery } from "@tanstack/react-query";
import { getAllProviders, getAllUsers, getUnverifiedHostels, getHostelById, getVerifiedHostels } from "@/services/Api/admin/adminApi";

const fetchUsers = async () => {
  const { data } = await getAllUsers();
  return data;
};

const fetchProviders = async () => {
  const { data } = await getAllProviders();
  return data;
};

const fetchUnverifiedHostels = async () => {
  const response = await getUnverifiedHostels();
  return response;
};

const fetchHostelById = async (id: string) => {
  const response = await getHostelById(id);
  return response;
};

const fetchVerifiedHostels = async () => {
  const response = await getVerifiedHostels();
  return response;
};

export const useUsers = () => {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });
};

export const useProviders = () => {
  return useQuery({
    queryKey: ["admin-providers"],
    queryFn: fetchProviders,
  });
};

export const useUnverifiedHostels = () => {
  return useQuery({
    queryKey: ["unverified-hostels"],
    queryFn: fetchUnverifiedHostels,
  });
};

export const useHostelDetails = (id: string) => {
  return useQuery({
    queryKey: ["hostel", id],
    queryFn: () => fetchHostelById(id),
    enabled: !!id,
  });
};

export const useVerifiedHostels = () => {
  return useQuery({
    queryKey: ["verified-hostels"],
    queryFn: fetchVerifiedHostels,
  });
};
