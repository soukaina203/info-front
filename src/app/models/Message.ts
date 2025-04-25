import { Conversation } from "./Conversation";

export class Message {
    id: number;
    senderId: number;
    receiverId: number;
    messageText: string;
    createdAt: Date;

    idConversation: number;
    conversation: Conversation|null;
    }
