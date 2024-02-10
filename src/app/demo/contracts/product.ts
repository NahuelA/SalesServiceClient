import { Sale } from "./sale";

interface InventoryStatus {
    label: string;
    value: string;
}

export interface Product {
    id?: string;
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
    sales?: Sale[] | Sale;
    // Remove all below
    code?: string;
    name?: string;
    price?: number;
    inventoryStatus?: InventoryStatus;
    image?: string;
    rating?: number;
}
