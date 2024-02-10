export interface Country {
    name?: string;
    code?: string;
}

export interface Representative {
    name?: string;
    image?: string;
}

// export interface Customer {
//     id?: number;
//     name?: string;
//     country?: Country;
//     company?: string;
//     date?: Date | string;
//     status?: string;
//     activity?: number;
//     representative?: Representative;
// }

export interface Customer {
    clientId?: number;
    dni?: number;
    name?: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
    passwordHash?: string;
    address?: string;
    country?: string;
    city?: string;
    bought?: null;
    purchasedProducts?: null;
}
