// src/app/utils/form-mappers.ts

import { User } from 'app/models/User';
import { ProfProfile } from 'app/models/ProfProfile';

export function extractUserFromForm(formValue: any): User {
    return {
        id: formValue.id,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        telephone: formValue.telephone,
        password: formValue.password,
        photo: formValue.photo,
        roleId: formValue.roleId
    };
}

export function extractProfProfileFromForm(formValue: any): ProfProfile {
    return {
        city: formValue.city,
        cv: formValue.cv,
        services: formValue.services,
        specialities: formValue.specialities,
        niveaux: formValue.niveaux,
        methodes: formValue.methodes,
        userId: formValue.id,
        user: null // à adapter si besoin
    };
}
