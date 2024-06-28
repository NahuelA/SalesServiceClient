import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
    Input,
} from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { SaleService } from "../../service/sale.service";
import { Sale } from "../../contracts/sale";
import { PaymentDate, SaleDto } from "../../contracts/Dtos/saleDto";
import { Customer } from "../../contracts/customer";
import { Product } from "../../contracts/product";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription, debounceTime } from "rxjs";
import { CustomResponse } from "../../contracts/response";
import { CustomerService } from "../../service/customer.service";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { ProfitService } from "../../service/profit.service";
import { EmployeeService } from "../../service/employee.service";
import { Employee } from "../../contracts/employee";

@Component({
    templateUrl: "./sale.component.html",
    providers: [MessageService, ConfirmationService],
})
export class SaleComponent implements OnInit, OnDestroy {
    title: string = "Ventas";
    searchPlaceholder: string = "Buscar venta";
    dni: number = 0;
    private _routeSubscription: Subscription;

    sales?: Sale[];
    sale?: Sale;
    saleDto: SaleDto;
    newPaymentDate: PaymentDate = {};
    nextPaymentDate: PaymentDate = {};
    existCustomerMsg: string = "";

    customer: Customer = {};
    employee: Employee = {};
    addCustomer: Customer = {};
    product: Product = {};

    submitted: boolean = false;
    existCustomerBool: boolean = true;
    dialog: boolean = false;
    dialogForChangePaymentDate: boolean = false;
    dialogForPaymentDate: boolean = false;
    dialogForSeeClient: boolean = false;
    dialogForSeeSale: boolean = false;
    dialogForSeeProduct: boolean = false;
    dialogForSeeGuarantor: boolean = false;
    dialogForSaveCustomer: boolean = false;
    dialogForSeePaymentDateChanged: boolean = false;
    updateDialog: boolean = false;
    deleteDialog: boolean = false;
    isOpenForEdit: boolean = false;
    paymentDateChanged: any[] = [];

    loading: boolean = true;

    employeeCollection: any;
    employeeCollectionR: [] = [];
    subscription!: Subscription;

    months: any = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    chartOptions: any;
    chartTitle: string;
    labelChart: string;

    @ViewChild("filter") filter!: ElementRef;

    constructor(
        private _salesService: SaleService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private _customerService: CustomerService,
        private _employeeService: EmployeeService,
        private _route: ActivatedRoute,
        private profitService: ProfitService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {
                this.initChart();
            });
    }

    ngOnInit(): void {
        this._routeSubscription = this._route.params.subscribe(
            (params: Params) => {
                this.dni = Number.parseInt(params["dni"]);

                console.log(this.dni);

                this.loadSalesAndProfit();
            }
        );

        this._salesService.refresh$.subscribe(() => {
            this._salesService
                .getBySeller(1000, this.dni)
                .subscribe((data: CustomResponse) => {
                    this.sales = data.result as Sale[];
                    this.title =
                        this.employee?.name ||
                        `${this.employee?.name} no tiene ventas`;
                    this.loading = false;
                });
        });
    }

    loadSalesAndProfit() {
        this._employeeService.getEmployeeByDni(this.dni).subscribe({
            next: (employee) => {
                this.employee = employee.result as Employee;
            },
        });

        if (!isNaN(this.dni)) {
            this._salesService
                .getBySeller(1000, this.dni)
                .subscribe((data: CustomResponse) => {
                    this.sales = data.result as Sale[];
                    this.title =
                        this.sales.at(0)?.employee?.name || this.employee?.name;
                    this.loading = false;
                });

            this.profitService
                .getEmployeeOverview(this.dni, 2024)
                .subscribe((data: any) => {
                    this.employeeCollectionR = data.result.profit;
                    this.chartTitle = `Cobranza mensual de ${
                        this.sales.at(0)?.employee?.name || this.employee?.name
                    }`;

                    this.labelChart = `Dinero cobrado por ${
                        this.sales.at(0)?.employee?.name || this.employee?.name
                    }`;

                    this.initChart();
                });
        } else {
            this._salesService.get(1000).subscribe((data: CustomResponse) => {
                this.sales = data.result as Sale[];
                this.loading = false;
            });

            this.profitService.get(2024).subscribe((data: any) => {
                this.employeeCollectionR = data.result.collect;
                this.chartTitle = "Cobranza mensual general";
                this.labelChart = "Dinero cobrado";

                this.initChart();
            });
        }
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue(
            "--text-color-secondary"
        );
        const surfaceBorder =
            documentStyle.getPropertyValue("--surface-border");

        this.employeeCollection = {
            labels: this.months,
            datasets: [
                {
                    label: this.labelChart,
                    data: this.employeeCollectionR,
                    fill: true,
                    backgroundColor:
                        documentStyle.getPropertyValue("--green-800"),
                    borderColor: documentStyle.getPropertyValue("--green-400"),
                    tension: 0.4,
                },
            ],
        };

        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: textColor,
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        color: textColorSecondary,
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    ngOnDestroy(): void {
        this._routeSubscription.unsubscribe();
    }

    changePaymentDate(event: Event) {
        this.confirmationService.confirm({
            key: "changePaymentDate",
            target: event.target || new EventTarget(),
            message: "Deseas cambiar la fecha de esta ficha?",
            icon: "pi pi-exclamation-circle",
            accept: () => {
                this._salesService
                    .changePaymentDate(
                        this.newPaymentDate?.saleId,
                        this.newPaymentDate?.date
                    )
                    .subscribe({
                        next: (changePaymentDate) => {
                            this.messageService.add({
                                severity: "success",
                                summary: "Confirmado",
                                detail: `La nueva fecha de cobro es: ${this.newPaymentDate?.date?.toLocaleString(
                                    "es-ES"
                                )}`,
                                life: 3000,
                            });
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Hubo un error",
                                detail: `${error?.error?.result}`,
                                life: 3000,
                            });
                        },
                    });
                this.dialogForChangePaymentDate = false;
            },
            reject: () => {
                this.messageService.add({
                    severity: "error",
                    summary: "Cancelado",
                    detail: "Cambio de fecha denegado correctamente!",
                    life: 3000,
                });
                this.dialogForChangePaymentDate = false;
            },
        });
    }

    makeAsPaid(event: Event) {
        this.confirmationService.confirm({
            key: "makeAsPaid",
            target: event.target || new EventTarget(),
            message: "Deseas marcar esta cuota como pagada?",
            icon: "pi pi-exclamation-circle",
            accept: () => {
                this._salesService
                    .markAsPaid(
                        this.nextPaymentDate.saleId,
                        this.nextPaymentDate.date
                    )
                    .subscribe({
                        next: () => {
                            this.messageService.add({
                                severity: "success",
                                summary: "Confirmado",
                                detail: `Has aceptado el pago de cuota del cliente ${this.customer.name}`,
                                life: 3000,
                            });

                            this.loadSalesAndProfit();
                        },
                        error: (error) => {
                            this.messageService.add({
                                severity: "error",
                                summary: "Hubo un error",
                                detail: `${error?.error?.result}`,
                                life: 3000,
                            });
                        },
                    });

                this.dialogForPaymentDate = false;
            },
            reject: () => {
                this.messageService.add({
                    severity: "error",
                    summary: "Cancelado",
                    detail: "Pago denegado correctamente!",
                    life: 3000,
                });
            },
        });
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

    // Open dialogs
    openForSeeClient(customer: Customer) {
        this.customer = customer;
        this.dialogForSeeClient = true;
    }

    // Open dialogs
    openForAddCustomer() {
        this.addCustomer = {};
        this.dialogForSaveCustomer = true;
    }

    openForSeePaymentDateChanged(date: []) {
        this.dialogForSeePaymentDateChanged = true;
        this.paymentDateChanged = date;
    }

    openUpdateDialog(sale: Sale) {
        this.dialog = true;
        this.isOpenForEdit = true;
        this.sale = sale;
        this.saleDto = {
            saleId: sale.saleId,
            employeeDni: sale.employee?.dni,
            clientDni: sale.client?.dni,
            guarantorDni: sale.guarantorDni,
            guarantorName: sale.guarantorName,
            guarantorAddress: sale.guarantorAddress,
            productDescription: sale.productDescription,
            amount: sale.amount,
            paymentDate: sale.paymentDate,
            date: sale.date,
            fee: sale.fee,
            feesCollected: sale.feesCollected,
            totalFees: sale.totalFees,
        };
    }

    openRemoveDialog(sale: Sale) {
        this.deleteDialog = true;
        this.sale = sale;
    }

    hideDeleteDialog(id) {
        this.deleteDialog = false;
    }

    hideDialogForAddCustomer() {
        this.dialogForSaveCustomer = false;
    }

    existCustomer(dni: number) {
        this._customerService.getByDni(dni).subscribe({
            next: (data) => {
                this.existCustomerBool = true;
            },
            error: (error) => {
                if (error?.error?.statusCode === 404) {
                    this.existCustomerBool = false;
                    this.existCustomerMsg = error.error.result;
                }
            },
        });
    }

    saveCustomer() {
        this.dialogForSaveCustomer = false;
        this.addCustomer.phoneNumber = this.addCustomer.phoneNumber?.toString();

        this._customerService.add(this.addCustomer).subscribe({
            next: (customer) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro creado con éxito",
                    detail: customer?.result?.toString(),
                    life: 3000,
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al registrar al cliente, inténtalo de nuevo.",
                    detail: error?.error?.result.toString(),
                    life: 3000,
                });
            },
        });
    }

    // openForSeeProduct(product: Product) {
    //     this.product = product;
    //     this.dialogForSeeProduct = true;
    // }

    openForSeeGuarantor(
        guarantorName: string,
        guarantorDni: number,
        guarantorAddress: string
    ) {
        this.sale = {
            guarantorName: guarantorName || "No tiene garante",
            guarantorDni: guarantorDni || 0,
            guarantorAddress: guarantorAddress || "No tiene garante",
        };

        this.dialogForSeeGuarantor = true;
    }

    openNew() {
        this.saleDto = {
            employeeDni: this.dni,
        };
        this.submitted = false;
        this.dialog = true;
    }

    openChangePaymentDateDialog(saleId: number) {
        this.newPaymentDate = {};
        this.newPaymentDate.saleId = saleId;
        this.dialogForChangePaymentDate = true;
    }

    openPaymentDateDialog(saleId: number, customerName: string) {
        this.nextPaymentDate = {};
        this.nextPaymentDate.saleId = saleId;
        this.customer = { name: customerName };
        this.dialogForPaymentDate = true;
    }

    // Hide dialogs
    hideDialog() {
        this.dialog = false;
        this.submitted = false;
    }

    hideForSeePaymentDateChanged() {
        this.dialogForChangePaymentDate = false;
    }

    hideChangePaymentDateDialog() {
        this.dialogForSeePaymentDateChanged = false;
    }

    hidePaymentDateDialog() {
        this.dialogForPaymentDate = false;
    }

    hideDialogForSeeClient() {
        this.dialogForSeeClient = false;
    }

    hideDialogForSeeProduct() {
        this.dialogForSeeProduct = false;
    }

    hideDialogForSeeGuarantor() {
        this.dialogForSeeGuarantor = false;
    }

    remove() {
        this.deleteDialog = false;

        this._salesService.delete(this.sale?.saleId).subscribe({
            next: (sale) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro eliminado con éxito",
                    detail: sale.result?.toString(),
                    life: 3000,
                });

                this.loadSalesAndProfit();
            },
            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al eliminar la venta, inténtalo de nuevo.",
                    detail: error?.error?.result?.toString(),
                    life: 3000,
                });
            },
        });

        this.sale = {};
    }

    saveProduct() {
        this.submitted = false;
        this.dialog = false;

        if (this.isOpenForEdit) {
            this._salesService
                .update(this.saleDto, this.sale.saleId)
                .subscribe({
                    next: (data: CustomResponse) => {
                        this.messageService.add({
                            severity: "success",
                            summary: "Registro actualizado con éxito",
                            detail: data.result.toString(),
                            life: 3000,
                        });

                        this.loadSalesAndProfit();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: "error",
                            summary: "Hubo un error",
                            detail: `${error?.error?.result}`,
                            life: 3000,
                        });
                    },
                });
        } else {
            this._salesService.add(this.saleDto).subscribe({
                next: (data: CustomResponse) => {
                    this.messageService.add({
                        severity: "success",
                        summary: "Registro creado con éxito",
                        detail: data.result.toString(),
                        life: 3000,
                    });
                    this.loadSalesAndProfit();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: "error",
                        summary: "Hubo un error",
                        detail: `${error?.error?.result}`,
                        life: 3000,
                    });
                },
            });
        }
    }
}
