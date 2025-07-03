import { useState } from "react";
import DataTable from "@/components/global/dataTable";
import Loading from "@/components/global/loading";
import { useUsers } from "@/hooks/admin/useAdminQueries";
import { updateStatus } from "@/services/Api/admin/adminApi";
import { IUser } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

const Users = () => {
  const limit = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000); // 500ms delay
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUsers(debouncedSearchQuery, page, limit);
  const queryClient = useQueryClient();

  const toggleUserStatus = useMutation({
    mutationFn: (email: string) => updateStatus(email),
    onSuccess: (responseData, email) => {
      queryClient.setQueryData(
        ["admin-users", debouncedSearchQuery, page, limit],
        (oldData: any) => {
          if (!oldData) return oldData;
          const updatedUsers = oldData.data.map((user: any) =>
            user.email === email
              ? { ...user, is_active: !user.is_active }
              : user
          );
          return { ...oldData, data: updatedUsers };
        }
      );
      toast.success(responseData.data.message, {
        style: {
          background: "rgb(220 255 228)",
          color: "#15803d",
          border: "1px solid #334155",
        },
      });
    },
    onError: () => {
      toast.error("Failed to update user status", {
        style: {
          background: "#1e293b",
          color: "#e2e8f0",
          border: "1px solid #334155",
        },
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex bg-[#242529] justify-center items-center min-h-screen">
        <Loading
          text="Loading users..."
          color="#6366f1"
          className="text-white"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 mt-10">
        Failed to load users!
      </div>
    );
  }

  if (!data || data.data.length === 0) {
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
          <span className="text-yellow-500 font-medium">{user.fullName}</span>
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
          onClick={() => toggleUserStatus.mutate(user.email)}
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
      <div className="flex justify-end mb-4">
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg bg-[#242529] text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <DataTable
        data={data?.data || []}
        columns={columns}
        total={data?.total ?? 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Users;
