import { useQuery } from "@tanstack/react-query";
import { getProviderWallet, getWalletTransactions } from "@/services/Api/providerApi";

const fetchProviderWallet = async () => {
  try {
    const response = await getProviderWallet();
    return response?.data || null;
  } catch (error) {
    console.error("Error fetching provider wallet:", error);
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

export const useProviderWallet = () => {
  return useQuery({
    queryKey: ["provider-wallet"],
    queryFn: fetchProviderWallet,
  });
};

export const useWalletTransactions = () => {
  return useQuery({
    queryKey: ["wallet-transactions"],
    queryFn: fetchWalletTransactions,
  });
}; 