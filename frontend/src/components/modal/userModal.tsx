import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IUser } from "@/types/types";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Calendar,
  Shield,
  User,
  Mail,
  Clock,
  ExternalLink,
} from "lucide-react";

interface ModalProps<T> {
  data: T;
  action: Function;
}

export function UserDetailsModal<T extends IUser>({
  data,
  action,
}: ModalProps<T>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-8 rounded-md border border-[#C8ED4F] bg-[#1E1F23] text-gray-200 hover:bg-[#2A2B30] px-4 text-xs font-medium shadow-lg shadow-[#C8ED4F]/10 transition-all duration-300 ease-in-out flex items-center gap-2"
        >
          <ExternalLink size={12} />
          View Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-gradient-to-br from-[#242529] to-[#1A1B1F] border border-[#C8ED4F] shadow-xl shadow-[#C8ED4F]/20 p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-r from-[#C8ED4F]/20 to-emerald-500/20 blur-xl opacity-50" />

          <DialogHeader className="p-6 pb-2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <DialogTitle className="text-gray-200 text-xl font-bold tracking-tight flex items-center gap-2">
                <User size={18} className="text-[#C8ED4F]" />
                User Details
              </DialogTitle>
              <DialogDescription className="text-gray-400 mt-1">
                Detailed information about the selected user
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <div className="px-6 py-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-5 mb-6"
            >
              <Avatar className="h-20 w-20 border-2 border-[#C8ED4F] shadow-lg shadow-[#C8ED4F]/10 ring-2 ring-[#C8ED4F]/20 ring-offset-2 ring-offset-[#242529]">
                <AvatarImage
                  src="https://e7.pngegg.com/pngimages/698/39/png-clipart-computer-icons-user-profile-info-miscellaneous-face-thumbnail.png"
                  alt={data.fullName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-[#242529] to-[#1A1B1F] text-[#C8ED4F] text-lg font-bold">
                  {data.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg text-gray-100 font-bold tracking-tight"
                >
                  {data.fullName}
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-2 mt-1"
                >
                  <Mail size={14} className="text-[#C8ED4F]" />
                  <p className="text-sm text-gray-400">{data.email}</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-2"
                >
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold items-center gap-1.5 shadow-inner ${
                      data.is_active
                        ? "bg-[#C8ED4F]/10 text-[#C8ED4F] border border-[#C8ED4F]/30"
                        : "bg-red-500/10 text-red-500 border border-red-500/30"
                    }`}
                  >
                    <Shield size={12} />
                    {data.is_active ? "Active Account" : "Blocked Account"}
                  </span>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-[#1A1B1F]/80 backdrop-blur-sm rounded-xl p-4 border border-gray-800 shadow-lg shadow-black/30 mb-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <PhoneCall size={16} className="text-[#C8ED4F]" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Phone</p>
                    <p className="text-sm text-gray-200">
                      {data.phone ? `+91 ${data.phone}` : "Not Added"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#C8ED4F]" />
                  <div>
                    <p className="text-xs font-medium text-gray-400">Joined</p>
                    <p className="text-sm text-gray-200">
                      {new Date(data.createdAt as Date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex justify-end"
            >
              <button
                onClick={() => action(data.email)}
                className={`relative group overflow-hidden rounded-lg shadow-lg ${
                  data.is_active
                    ? "border border-red-500 text-red-500 shadow-red-500/20"
                    : "border border-[#C8ED4F] text-[#C8ED4F] shadow-[#C8ED4F]/20"
                } py-2 px-4 font-medium transition-all duration-300 ease-in-out`}
              >
                <span
                  className={`absolute inset-0 w-0 group-hover:w-full transition-all duration-300 ease-in-out ${
                    data.is_active ? "bg-red-500" : "bg-[#C8ED4F]"
                  }`}
                ></span>
                <span
                  onClick={() => action(data.email)}
                  className="relative flex items-center gap-2 group-hover:text-black transition-all duration-300"
                >
                  {data.is_active ? (
                    <>
                      <Shield
                        size={16}
                        className="text-red-500 group-hover:text-black transition-all duration-300"
                      />
                      Block User
                    </>
                  ) : (
                    <>
                      <Shield
                        size={16}
                        className="text-[#C8ED4F] group-hover:text-black transition-all duration-300"
                      />
                      Activate User
                    </>
                  )}
                </span>
              </button>
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
