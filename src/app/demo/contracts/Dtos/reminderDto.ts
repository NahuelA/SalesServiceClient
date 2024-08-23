import { Customer } from "../customer";

export interface ReminderDto {
    detail?: string;
    message?: string;
    scheduled?: Date;
    customers?: Customer[];
}
