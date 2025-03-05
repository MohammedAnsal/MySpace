import { useQuery } from "@tanstack/react-query";
import { getAllProviders, getAllUsers } from "@/services/Api/adminApi";

const fetchUsers = async () => {
  const { data } = await getAllUsers();
  return data;
};

const fetchProviders = async () => {
  const { data } = await getAllProviders();
  return data;
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
