import { Customer } from "./customer";
import { Employee } from "./employee";
import { Product } from "./product";

export interface Sale {
    saleId?: string;
    productId?: string;
    customerId?: string;
    employeeId?: string;
    guarantorDni?: number;
    guarantorName?: string;
    guarantorAddress?: string;
    detail?: string;
    code?: string;

    // Mapped instances
    product?: Product;
    customer?: Customer;
    employee?: Employee;

    // Dates
    paymentDate?: Date;
    newPaymentDate?: Date | string;
    date?: Date;

    amount?: number;
    price?: number;
    feesCollected?: number;
    totalFees?: number;
}
