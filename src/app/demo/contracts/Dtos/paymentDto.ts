export interface PaymentDto {
    employeeDni?: number;
    concept?: string;
    amount?: number;
    paymenthMethod?: string;
    receivedIn?: string;
    description?: string;
    date?: Date;
}
