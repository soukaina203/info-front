import { Message } from "./Message";
import { User } from "./User";

export class Conversation {
    id: number;
    title: string;
    createdAt: Date;

    senderId: number;
    receiverId: number;

    sender:User
    receiver:User
    messages: Message[];
    }
