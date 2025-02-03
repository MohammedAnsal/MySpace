export enum TOPIC_TYPE {
  USER_CREATED = "user.created",
}

export enum EventType {
  USER_CREATED = "USER_CREATED",
}

export interface MessageType {
  userId: string;
  email: string;
  fullName: string;
}
