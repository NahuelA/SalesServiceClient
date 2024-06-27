import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { CustomerService } from "../../service/customer.service";
import { Customer } from "../../contracts/customer";
import { Subscription } from "rxjs";
import { CustomResponse } from "../../contracts/response";
import { cu } from "@fullcalendar/core/internal-common";

@Component({
    templateUrl: "./client.component.html",
    providers: [MessageService, ConfirmationService],
})
export class ClientComponent implements OnInit {
    title: string = "Clientes";
    searchPlaceholder: string = "Buscar cliente";
    private _routeSubscription: Subscription;

    customers?: Customer[] = [];

    customer: Customer = {};
    submitted: boolean = false;
    dialog: boolean = false;
    updateDialog: boolean = false;
    deleteDialog: boolean = false;

    selectedCustomer: Customer = {};

    idFrozen: boolean = false;

    loading: boolean = true;

    sector: any[] = [];

    @ViewChild("filter") filter!: ElementRef;

    constructor(
        private _customerService: CustomerService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this._customerService.get().subscribe((customers) => {
            this.customers = customers.result as Customer[];
            this.loading = false;
        });

        this._routeSubscription = this._customerService.refresh$.subscribe(
            () => {
                this._customerService
                    .get()
                    .subscribe((customers: CustomResponse) => {
                        this.customers = customers.result as Customer[];
                        this.loading = false;
                    });
            }
        );
    }

    openNew() {
        this.customer = {};
        this.submitted = false;
        this.dialog = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            "startsWith"
        );
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = "";
    }

    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    openDeleteDialog(customer: Customer) {
        this.deleteDialog = true;
        this.customer = customer;
    }

    hideDeleteDialog() {
        this.deleteDialog = false;
        this.submitted = false;
    }

    openUpdateDialog(customer: Customer) {
        this.updateDialog = true;
        this.customer = customer;
    }

    hideUpdateDialog() {
        this.updateDialog = false;
        this.submitted = false;
    }

    update() {
        this.updateDialog = false;

        this.customer.phoneNumber = this.customer.phoneNumber?.toString();

        this._customerService.update(this.customer).subscribe({
            next: (customer) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro actualizado con éxito",
                    detail: customer.result?.toString(),
                    life: 3000,
                });

                this.customer = {};
            },
            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al actualizar al cliente, inténtalo de nuevo.",
                    detail: error?.error?.result?.toString(),
                    life: 3000,
                });
            },
        });
    }

    remove() {
        this.deleteDialog = false;

        this._customerService.delete(this.customer.clientId).subscribe({
            next: (customer) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro eliminado con éxito",
                    detail: customer.result?.toString(),
                    life: 3000,
                });

                this._customerService.get().subscribe((customers) => {
                    this.customers = customers.result as Customer[];
                    this.loading = false;
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al eliminar al cliente, inténtalo de nuevo.",
                    detail: error?.error?.result?.toString(),
                    life: 3000,
                });
            },
        });

        this.customer = {};
    }

    saveProduct() {
        this.submitted = true;
        this.dialog = false;

        this.customer.phoneNumber = this.customer.phoneNumber?.toString();

        this._customerService.add(this.customer).subscribe({
            next: (customer) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro creado con éxito",
                    detail: customer.result?.toString(),
                    life: 3000,
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al registrar al cliente, inténtalo de nuevo.",
                    detail: error?.error?.result?.toString(),
                    life: 3000,
                });
            },
        });
    }
}
