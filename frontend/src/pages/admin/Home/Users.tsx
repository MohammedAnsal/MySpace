import DataTable from "@/components/global/DataTable";
import { useUsers } from "@/hooks/admin/useAdminQueries";
import { updateStatus } from "@/services/Api/adminApi";
import { IUser } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const Users = () => {
  const { data, isLoading, isError } = useUsers();
  const queryClient = useQueryClient();

  const toggleUserStatus = async (email: string) => {
    try {
      const { data: responseData } = await updateStatus(email);
      if (responseData) {
        toast.success(responseData.message);
        queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      }
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

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

  if (isError) {
    return (
      <div className="text-red-500 text-center mt-10">
        Failed to load users!
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-slate-400 mt-10">No users found.</div>
    );
  }

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
        <button
          onClick={() => toggleUserStatus(user.email)}
          className={`px-4 py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
            user.is_active
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {user.is_active ? "Block" : "Unblock"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <DataTable data={data?.data} columns={columns} />
    </div>
  );
};

export default Users;
