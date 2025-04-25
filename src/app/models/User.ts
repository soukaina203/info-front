import { Role } from "./Role";

export class User {
    id: number=0;
    firstName: string="";
    lastName: string="";
    telephone: string="";
    email: string="";
    password: string="";

    isAdmin:boolean;
    idRole: number;
    role?: Role | null;

    city?: string | null;
    cv?: string | null;

    photo?:string | null;
    services?: number[] | null;
    specialities?: number[] | null;
    niveaux?: number[] | null;
    methodes?: number[] | null;
}


