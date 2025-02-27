import DataTable from "@/components/global/DataTable";
import BouncingBallsLoader from "@/components/global/Loading";
import { getAllUsers } from "@/services/Api/adminApi";
import { IUser } from "@/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getAllUsers();
        setData(response.data.data); // Assuming the structure here is response.data.data
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log(data)

  const columns = [
    {
      header: "No",
      render: (_: IUser, i: number) => `${i + 101}`,
    },
    {
      key: "fullName",
      header: "User",
      render: (user: IUser) => (
        <div className="flex justify-center gap-3 items-center gap-2">
          <Avatar className="h-8 w-8 border rounded-full">
            <AvatarImage
              src="https://e7.pngegg.com/pngimages/698/39/png-clipart-computer-icons-user-profile-info-miscellaneous-face-thumbnail.png"
              alt="d"
              className="object-cover w-8 h-8 rounded-full"
            />
            <AvatarFallback className="uppercase">
              {user.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
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
        <span
          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
            user.is_active ? "text-green-700" : "text-red-700"
          }`}
        >
          {user.is_active ? "Active" : "Blocked"}
        </span>
      ),
    },
  ];

  return (
    <div className="text-white">
      {isLoading ? (
        <BouncingBallsLoader />
      ) : (
        <DataTable data={data} columns={columns} />
      )}
    </div>
  );
};

export default Users