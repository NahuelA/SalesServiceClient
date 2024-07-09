import { Sale } from "./sale";

export interface Product {
    productId?: string;
    productName?: string;
    barcode?: string;
    category?: string | number;
    spotPrice?: number;
    installmentPrice?: number;
    totalFees?: number;
    description?: string;
    stock?: number;
    timesSold?: number;
    sales?: Sale[];
}
