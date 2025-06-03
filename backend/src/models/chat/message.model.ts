import mongoose, { Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;
  chatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderType: "user" | "provider";
  content?: string;
  image?: string;
  handleSendMessage?: string;
  replyToMessageId?: Types.ObjectId;
  isSeen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema = new mongoose.Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderType: {
      type: String,
      enu: ["user", "provider"],
      required: true,
    },
    content: {
      type: String,
      required: false,
      // trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    replyToMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
