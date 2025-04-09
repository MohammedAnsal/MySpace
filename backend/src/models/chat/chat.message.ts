import mongoose, { Types } from "mongoose";

export interface IMessage {
  _id?: Types.ObjectId;
  chatRoomId: Types.ObjectId;
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  text?: string;
  image?: string;
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
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    image: {
      type: String,
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
