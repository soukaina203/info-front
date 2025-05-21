import { Role } from "./Role";

export class User {
    id: number=0;
    firstName: string="";
    lastName: string="";
    telephone: string="";
    email: string="";
    password: string="";
    photo?:string | null;

    roleId: number;


}

