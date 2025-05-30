import { useQuery } from "@tanstack/react-query";
import { getUserWallet, getWalletTransactions } from "@/services/Api/userApi";

const fetchUserWallet = async () => {
  try {
    const response = await getUserWallet();
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching user wallet:", error);
    return null;
  }
};

const fetchWalletTransactions = async () => {
  try {
    const response = await getWalletTransactions();
    return response?.data || [];
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    return [];
  }
};

export const useUserWallet = () => {
  return useQuery({
    queryKey: ["user-wallet"],
    queryFn: fetchUserWallet,
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: fetchWalletTransactions,
  });
}; 