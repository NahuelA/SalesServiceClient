import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { CustomerService } from "../../service/customer.service";
import { Customer } from "../../contracts/customer";
import { Subscription } from "rxjs";
import { CustomResponse } from "../../contracts/response";

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

    selectedEmployee: Customer = {};

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

    saveProduct() {
        this.submitted = true;
        this.dialog = false;

        this.customer.phoneNumber = this.customer.phoneNumber?.toString();
        this.customer.country = "";
        this.customer.city = "";

        this._customerService.add(this.customer).subscribe(
            (customer) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro creado con éxito",
                    detail: customer.result.toString(),
                    life: 3000,
                });
            },
            (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al registrar al cliente, inténtalo de nuevo.",
                    detail: error?.error?.result.toString(),
                    life: 3000,
                });
            }
        );
        // if (this.employee.username) {
        //     if (this.product.id) {
        //         // @ts-ignore
        //         this.product.inventoryStatus = this.product.inventoryStatus
        //             .value
        //             ? this.product.inventoryStatus.value
        //             : this.product.inventoryStatus;
        //         this.products[this.findIndexById(this.product.id)] =
        //             this.product;
        //         this.messageService.add({
        //             severity: "success",
        //             summary: "Successful",
        //             detail: "Product Updated",
        //             life: 3000,
        //         });
        //     } else {
        //         this.product.id = this.createId();
        //         this.product.code = this.createId();
        //         this.product.image = "product-placeholder.svg";
        //         // @ts-ignore
        //         this.product.inventoryStatus = this.product.inventoryStatus
        //             ? this.product.inventoryStatus.value
        //             : "INSTOCK";
        //         this.products.push(this.product);
        //         this.messageService.add({
        //             severity: "success",
        //             summary: "Successful",
        //             detail: "Product Created",
        //             life: 3000,
        //         });
        //     }

        //     this.products = [...this.products];
        //     this.productDialog = false;
        //     this.product = {};
        // }
    }
}
