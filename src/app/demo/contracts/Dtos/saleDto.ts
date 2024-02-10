export interface SaleDto {
    saleId?: number;
    employeeDni?: number;
    clientDni?: number;
    guarantorDni?: number;
    guarantorAddress?: string;
    guarantorName?: string;
    productDescription?: string;
    amount?: number;

    paymentDate?: Date | string;
    date?: Date | string;

    fee?: number;
    installment?: number;
    feesCollected?: number;
    totalFees?: number;
}

export interface PaymentDate {
    saleId?: number;
    date?: Date | string;
}

export interface MarkAsPaid {
    saleId: number;
    isPaid?: boolean;
    fee: number;
}
