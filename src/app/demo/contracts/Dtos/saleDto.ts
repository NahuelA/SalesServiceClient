export interface SaleDto {
    saleId?: string;
    employeeDni?: number;
    customerDni?: number;
    guarantorDni?: number;
    guarantorAddress?: string;
    guarantorName?: string;
    detail?: string;
    code?: string;
    amount?: number;

    paymentDate?: Date | string;
    date?: Date | string;

    price?: number;
    feesCollected?: number;
    totalFees?: number;
}

export interface PaymentDate {
    saleId?: string;
    date?: Date | string;
}

export interface MarkAsPaid {
    saleId: string;
    isPaid?: boolean;
    fee: number;
}
