import { Country } from "./customer";

// export interface Country {
//     name?: string;
//     code?: string;
// }

// export interface Representative {
//     name?: string;
//     image?: string;
// }

export interface Employee {
    employeeId?: number;
    dni?: number;
    cuil?: number;
    name?: string;
    surname?: string;
    sector?: string | number;
    email?: string;
    phoneNumber?: string;
    passwordHash?: string;
    address?: string;
    country?: string;
    city?: string;
    payments?: null;
    sales?: null;
}
