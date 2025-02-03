import { EventType, MessageType, TOPIC_TYPE } from "../kafkaTypes";

export interface IKafka {
  publish(topic: TOPIC_TYPE, message: MessageType, event: EventType): Promise<void>;
  subscribe(
    topic: TOPIC_TYPE,
    groupId: string,
    messageHandler: Function
  ): Promise<void>;
}
