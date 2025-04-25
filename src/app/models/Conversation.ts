import { Message } from "./Message";
import { User } from "./User";

export class Conversation {
    id: number;
    title: string; // Optional
    createdAt: Date;

    senderId: number; // User who initiated the conversation
    receiverId: number; // Recipient of the conversation

    sender:User
    receiver:User
    messages: Message[];
    }
