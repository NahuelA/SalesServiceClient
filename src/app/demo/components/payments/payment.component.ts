import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { PaymentService } from "../../service/payment.service";
import { Payment } from "../../contracts/payment";
import { PaymentDto } from "../../contracts/Dtos/paymentDto";
import { BaseResponse } from "../../contracts/response";
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
    payment: Payment;

    submitted: boolean = false;
    dialog: boolean = false;
    deleteDialog: boolean = false;

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
        this._paymentService.get().subscribe((payments) => {
            this.payments = payments.data;
            this.loading = false;
        });

        this._routeSubscription = this._paymentService.refresh$.subscribe(
            () => {
                this._paymentService.get().subscribe((payments) => {
                    this.payments = payments.data;
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

    displayDeleteDialog(payment: Payment) {
        this.deleteDialog = true;
        this.payment = payment;
    }

    hideDeleteDialog() {
        this.deleteDialog = false;
        this.payment = {};
    }

    saveProduct() {
        this.submitted = false;
        this.dialog = false;

        this._paymentService.add(this.paymentDto).subscribe({
            next: (payment) => {
                this.messageService.add({
                    severity: "success",
                    summary: payment.message,
                    life: 3000,
                });

                console.log(payment);
            },
            error: ({ error }: any) => {
                this.messageService.add({
                    severity: "error",
                    summary: error.message,
                    life: 3000,
                });
            },
        });
    }

    remove() {
        this.deleteDialog = false;

        this._paymentService.delete(this.payment.code).subscribe({
            next: (payment) => {
                this.messageService.add({
                    severity: "success",
                    summary: payment.message,
                    life: 3000,
                });

                this._paymentService.get().subscribe((payments) => {
                    this.payments = payments.data;
                    this.loading = false;
                });
            },
            error: ({ error }: any) => {
                this.messageService.add({
                    severity: "error",
                    summary: error.message,
                    life: 3000,
                });
            },
        });

        this.payment = {};
    }
}
