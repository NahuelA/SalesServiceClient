import { Employee } from "./employee";

export interface Payment {
    paymentId?: number;
    concept?: string;
    amount?: number;
    paymenthMethod?: string;
    receivedIn?: string;
    employee?: Employee;
    receipt?: string;
    code?: number;
    description?: string;
    date?: Date;
}
