import { Customer } from "../customer";

export interface EmailDto {
    subject?: string;
    message?: string;
    scheduled?: Date;
    attachment?: File;
    customers?: Customer[];
}
