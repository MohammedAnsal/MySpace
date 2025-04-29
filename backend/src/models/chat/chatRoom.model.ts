import mongoose, { Types } from "mongoose";

export interface IChatRoom {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  providerId: Types.ObjectId;
  lastMessageId?: Types.ObjectId;
  userUnreadCount: number;
  providerUnreadCount: number;
  lastMessageTime: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const chatRoomSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    userUnreadCount: {
      type: Number,
      default: 0,
    },
    providerUnreadCount: {
      type: Number,
      default: 0,
    },
    lastMessageTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ChatRoom", chatRoomSchema);
