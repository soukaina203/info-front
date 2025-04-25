import { User } from "./User";

export class Reunion {
    id:number=0;
    title :string
    date:Date;
    link:string;
    duree:string;
    description:string;
    picture:string | null;
    userId:number;
    user:User|null;
}
