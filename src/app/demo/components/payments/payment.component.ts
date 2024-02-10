import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { PaymentService } from "../../service/payment.service";
import { Payment } from "../../contracts/payment";
import { PaymentDto } from "../../contracts/Dtos/paymentDto";
import { CustomResponse } from "../../contracts/response";
import { Subscription } from "rxjs";

@Component({
    templateUrl: "./payment.component.html",
    providers: [MessageService, ConfirmationService],
})
export class PaymentComponent implements OnInit {
    title: string = "Pagos";
    searchPlaceholder: string = "Buscar pago";
    private _routeSubscription: Subscription;

    payments?: Payment[] = [];
    paymentDto: PaymentDto;

    submitted: boolean = false;
    dialog: boolean = false;

    selectedPayment: Payment = {};

    idFrozen: boolean = false;

    loading: boolean = true;

    paymentMethod: any[] = [
        { label: "Digital", value: "digital" },
        { label: "Efectivo", value: "efectivo" },
        { label: "Cheque | Contrato", value: "contrato" },
    ];

    receivedIn: any[] = [
        { label: "Cuenta bancaria", value: "cuentaBancaria" },
        { label: "Mercado pago", value: "mercadoPago" },
        { label: "Ualá", value: "uala" },
        { label: "Brubank", value: "brubank" },
        { label: "Efectivo", value: "efectivo" },
        { label: "Otro", value: "otro" },
    ];

    concept: any[] = [
        { label: "Sueldo", value: "sueldo" },
        { label: "Préstamo", value: "prestamo" },
    ];

    @ViewChild("filter") filter!: ElementRef;

    constructor(
        private _paymentService: PaymentService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this._paymentService.get().subscribe((payments: CustomResponse) => {
            this.payments = payments.result as Payment[];
            this.loading = false;
        });

        this._routeSubscription = this._paymentService.refresh$.subscribe(
            () => {
                this._paymentService
                    .get()
                    .subscribe((payments: CustomResponse) => {
                        this.payments = payments.result as Payment[];
                        this.loading = false;
                    });
            }
        );
    }

    ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    openNew() {
        this.paymentDto = {};
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
        this.submitted = false;
        this.dialog = false;

        this._paymentService
            .add(this.paymentDto)
            .subscribe((payment: CustomResponse) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro creado con éxito",
                    detail: payment.result.toString(),
                    life: 3000,
                });

                if (payment.statusCode === 400)
                    this.messageService.add({
                        severity: "error",
                        summary:
                            "Hubo un error al registrar el pago, inténtalo de nuevo.",
                        detail: payment.result.toString(),
                        life: 3000,
                    });
            });

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
