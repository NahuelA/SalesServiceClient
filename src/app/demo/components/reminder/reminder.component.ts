import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Customer } from "../../contracts/customer";
import { CustomerService } from "../../service/customer.service";
import { MessageService } from "primeng/api";
import { ReminderDto } from "../../contracts/Dtos/reminderDto";
import { Table } from "primeng/table";
import { ReminderService } from "../../service/reminder.service";

@Component({
    templateUrl: "./reminder.component.html",
    styleUrl: "../../../../assets/demo/styles/reminder.scss",
})
export class ReminderComponent implements OnInit {
    reminder: ReminderDto;
    reminders: ReminderDto[];
    customersDialog: boolean = false;
    title: string = "Recordatorios";
    searchPlaceholder: string = "Buscar recordatorios";
    attachment: File;
    destinations: Customer[];
    customers: Customer[];
    reminderDialog: boolean = false;
    idFrozen: boolean = false;
    @ViewChild("filter") filter!: ElementRef;

    loading: boolean = true;

    constructor(
        private customerService: CustomerService,
        private messageService: MessageService,
        private reminderService: ReminderService
    ) {}

    ngOnInit(): void {
        this.customerService.get().subscribe({
            next: (customers) => {
                this.customers = customers.data;
            },
        });

        this.reminderService.get().subscribe({
            next: (reminder) => {
                this.reminders = reminder.data;
                this.loading = false;
            },
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table?.filterGlobal(
            (event.target as HTMLInputElement).value,
            "startsWith"
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = "";
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        this.attachment = input.files[0];
    }

    showReminderDialog() {
        this.reminder = {};
        this.reminderDialog = true;
    }

    closeReminderDialog() {
        this.reminderDialog = false;
    }

    openForSeeCustomers(customers: Customer[]) {
        this.customersDialog = true;
        this.destinations = customers;
    }

    closeForSeeCustomers() {
        this.customersDialog = false;
        this.destinations = [];
    }

    sendReminder() {
        this.reminderService.sendReminder(this.reminder).subscribe({
            next: (reminder) => {
                this.messageService.add({
                    severity: "success",
                    summary: reminder.message,
                    life: 3000,
                });
            },
            error: ({ error }) => {
                if (error.errors !== null)
                    error?.errors?.map((x) => {
                        this.messageService.add({
                            severity: "error",
                            summary: x.errorMessage,
                            life: 4000,
                        });
                    });
                else
                    this.messageService.add({
                        severity: "error",
                        summary: error.message,
                        life: 3000,
                    });
            },
        });
    }
}
