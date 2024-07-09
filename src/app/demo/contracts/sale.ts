import { Customer } from "./customer";
import { Employee } from "./employee";
import { Product } from "./product";

export interface Sale {
    saleId?: number;
    productId?: number;
    clientId?: number;
    employeeId?: number;
    guarantorDni?: number;
    guarantorName?: string;
    guarantorAddress?: string;
    productDescription?: string;
    code?: string;

    // Mapped instances
    product?: Product;
    client?: Customer;
    employee?: Employee;

    // Dates
    paymentDate?: Date;
    newPaymentDate?: Date | string;
    date?: Date;

    amount?: number;
    spot?: number;
    fee?: number;
    feesCollected?: number;
    totalFees?: number;
    timesThePaymentDateWasChanged?: number;
}
