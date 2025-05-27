import { ProfProfile } from './../models/ProfProfile';
import { User } from "app/models/User";

export interface inscriptionProfInterface{
    user:User,
    profProfile:ProfProfile
}
