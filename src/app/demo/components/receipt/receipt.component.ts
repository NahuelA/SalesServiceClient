import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { ReceiptService } from "../../service/receipt.service";
import { Receipt } from "../../contracts/receipt";
import { ReceiptDto } from "../../contracts/Dtos/receiptDto";
import { Subscription } from "rxjs";
import { Customer } from "../../contracts/customer";
import { DropdownFilterOptions } from "primeng/dropdown";
import { CustomerService } from "../../service/customer.service";

@Component({
    templateUrl: "./receipt.component.html",
    providers: [MessageService, ConfirmationService],
})
export class ReceiptComponent implements OnInit {
    title: string = "Comprobantes";
    searchPlaceholder: string = "Buscar comprobante";

    url: string = "https://sales-service.app/";

    private _routeSubscription: Subscription;

    receipts?: Receipt[] = [];
    receiptDto: ReceiptDto;
    receipt: Receipt;
    customers: Customer[] | undefined;

    selectedCustomer: string | undefined;

    filterValue: string | undefined = "";

    submitted: boolean = false;
    dialog: boolean = false;
    deleteDialog: boolean = false;

    selectedReceipt: Receipt = {};

    idFrozen: boolean = false;

    loading: boolean = true;

    paymentMethod: any[] = [
        { label: "Digital", value: "digital" },
        { label: "Efectivo", value: "efectivo" },
        { label: "Cheque | Contrato", value: "contrato" },
    ];

    @ViewChild("filter") filter!: ElementRef;

    constructor(
        private _receiptService: ReceiptService,
        private messageService: MessageService,
        private _customerService: CustomerService
    ) {}

    ngOnInit(): void {
        this._receiptService.get().subscribe((receipts) => {
            this.receipts = receipts.data;
            this.loading = false;
        });

        this._customerService.get().subscribe({
            next: (customer) => {
                this.customers = customer.data;
            },
        });

        this._routeSubscription = this._receiptService.refresh$.subscribe(
            () => {
                this._receiptService.get().subscribe((receipts) => {
                    this.receipts = receipts.data;
                    this.loading = false;
                });
            }
        );
    }

    ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    resetFunction(options: DropdownFilterOptions) {
        options.reset();
        this.filterValue = "";
    }

    customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
        options.filter(event);
    }

    openNew() {
        this.receiptDto = {};
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

    displayDeleteDialog(receipt: Receipt) {
        this.deleteDialog = true;
        this.receipt = receipt;
    }

    hideDeleteDialog() {
        this.deleteDialog = false;
        this.receipt = {};
    }

    saveProduct() {
        this.submitted = false;
        this.dialog = false;

        this._receiptService.add(this.receiptDto).subscribe({
            next: (receipt) => {
                this.messageService.add({
                    severity: "success",
                    summary: receipt.message,
                    life: 3000,
                });
            },
            error: ({ error }: any) => {
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

    remove() {
        this.deleteDialog = false;

        this._receiptService.delete(this.receipt.code).subscribe({
            next: (receipt) => {
                this.messageService.add({
                    severity: "success",
                    summary: receipt.message,
                    life: 3000,
                });

                this._receiptService.get().subscribe((receipts) => {
                    this.receipts = receipts.data;
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

        this.receipt = {};
    }
}
