import { Customer } from "./customer";

export interface Receipt {
    receiptId?: string;
    url?: string;
    detail?: string;
    amount?: number;
    customerId?: string;
    customer?: Customer;
    code?: string;
    paymenthMethod?: string;
    date?: Date;
}
