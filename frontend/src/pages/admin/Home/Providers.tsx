import DataTable from "@/components/global/DataTable";
import { UserDetailsModal } from "@/components/modal/userModal";
import { getAllProviders, updateStatus } from "@/services/Api/adminApi";
import { IUser } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllProviders();
        setData(response.data.data);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const blockUser = async (email: string) => {
    const updatedUsers = data.map((user) =>
      user.email === email ? { ...user, is_active: !user.is_active } : user
    );
    setData(updatedUsers);

    try {
      const { data: responseData } = await updateStatus(email);
      if (responseData) {
        toast.success(responseData.message);
      }
    } catch (error) {
      toast.error("Failed to update user status");
      setData(data); // Roll back state on failure
    }
  };

  const columns = [
    {
      header: "No",
      render: (_: IUser, i: number) => `${i + 101}`,
    },
    {
      key: "fullName",
      header: "User",
      render: (user: IUser) => (
        <div className="flex">
          <span className="font-medium text-yellow-500">{user.fullName}</span>
        </div>
      ),
    },
    { key: "email", header: "Email" },
    { key: "role", header: "Role" },
    {
      header: "Joined",
      render: (user: IUser) =>
        user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
    },
    {
      header: "Status",
      render: (user: IUser) => (
        <AnimatePresence mode="wait">
          <motion.span
            key={`${user.email}-${user.is_active}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              user.is_active
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {user.is_active ? "Active" : "Blocked"}
          </motion.span>
        </AnimatePresence>
      ),
    },
    {
      header: "Details",
      render: (user: IUser) => (
        <UserDetailsModal data={user} action={blockUser} />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#242529]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
          <div className="text-slate-400 animate-pulse">Loading users...</div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="">
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default Users;
