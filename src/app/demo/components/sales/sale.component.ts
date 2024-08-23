import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
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
import { CustomerService } from "../../service/customer.service";
import { LayoutService } from "src/app/layout/service/app.layout.service";
import { EmployeeService } from "../../service/employee.service";
import { Employee } from "../../contracts/employee";
import { ProductService } from "../../service/product.service";
import { AnalyticsService } from "../../service/analytics.service";
import { DropdownFilterOptions } from "primeng/dropdown";

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
    existProductMsg: string = "";

    customer: Customer = {};
    employee: Employee = {};
    addCustomer: Customer = {};
    product: Product = {};
    customers: Customer[] | undefined;
    employees: Employee[] | undefined;

    selectedCustomer: Customer | undefined;
    selectedEmployee: Employee | undefined;

    filterValue: string | undefined = "";

    submitted: boolean = false;
    existCustomerBool: boolean = true;
    existProduct: boolean = true;
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
        private _productService: ProductService,
        private _route: ActivatedRoute,
        private analyticsService: AnalyticsService,
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
                this.loadSalesAndProfit();
            }
        );

        this._salesService.refresh$.subscribe(() => {
            this._salesService.getBySeller(1000, this.dni).subscribe((sale) => {
                this.sales = sale.data;
                this.title =
                    this.employee?.name ||
                    `${this.employee?.name} no tiene ventas`;
                this.loading = false;
            });
        });

        this._customerService.get().subscribe({
            next: (customer) => {
                this.customers = customer.data;
            },
        });

        this._employeeService.get().subscribe({
            next: (employee) => {
                this.employees = employee.data;
            },
        });
    }

    resetFunction(options: DropdownFilterOptions) {
        options.reset();
        this.filterValue = "";
    }

    customFilterFunction(event: KeyboardEvent, options: DropdownFilterOptions) {
        options.filter(event);
    }

    loadSalesAndProfit() {
        this._employeeService.getEmployeeByDni(this.dni).subscribe({
            next: (employee) => {
                this.employee = employee.data;
            },
        });

        if (!isNaN(this.dni)) {
            this._salesService.getBySeller(1000, this.dni).subscribe((sale) => {
                this.sales = sale.data;

                this.title =
                    this.sales?.at(0)?.employee?.name || this.employee?.name;
                this.loading = false;
            });

            this.analyticsService
                .getEmployeeOverview(this.dni, 2024)
                .subscribe((data: any) => {
                    this.employeeCollectionR = data.result.profit;
                    this.chartTitle = `Cobranza mensual de ${
                        this.sales?.at(0)?.employee?.name || this.employee?.name
                    }`;

                    this.labelChart = `Dinero cobrado por ${
                        this.sales?.at(0)?.employee?.name || this.employee?.name
                    }`;

                    this.initChart();
                });
        } else {
            this._salesService.get(1000).subscribe((sale) => {
                this.sales = sale.data;
                this.loading = false;
            });

            this.analyticsService.get(2024).subscribe((data: any) => {
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
                                summary: changePaymentDate.message,
                                life: 3000,
                            });
                            this.loadSalesAndProfit();
                        },
                        error: ({ error }: any) => {
                            this.messageService.add({
                                severity: "error",
                                summary: error.message,
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
                console.log(this.nextPaymentDate);
                this._salesService
                    .markAsPaid(
                        this.nextPaymentDate.saleId,
                        this.nextPaymentDate.date
                    )
                    .subscribe({
                        next: (markAsPaid) => {
                            if (markAsPaid.info)
                                this.messageService.add({
                                    severity: "info",
                                    summary: markAsPaid.message,
                                    life: 10000,
                                });

                            this.messageService.add({
                                severity: "success",
                                summary: markAsPaid.message,
                                life: 3000,
                            });

                            this.loadSalesAndProfit();
                        },
                        error: ({ error }: any) => {
                            console.log(error);
                            this.messageService.add({
                                severity: "error",
                                summary: error.message,
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

    getProductByCode() {
        this._productService.getByCode(this.saleDto.code).subscribe({
            next: (product) => {
                this.product = product.data;
                this.saleDto.detail = this.product.name;
                this.saleDto.price = this.product.price;
                this.saleDto.totalFees = this.product.totalFees;
                this.existProduct = true;
                this.existProductMsg = "";
            },
            error: ({ error }) => {
                this.product = {};
                this.existProduct = false;
                this.existProductMsg = error.message;
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
            customerDni: sale.customer?.dni,
            guarantorDni: sale.guarantorDni,
            guarantorName: sale.guarantorName,
            guarantorAddress: sale.guarantorAddress,
            detail: sale.detail,
            code: sale.code,
            amount: sale.amount,
            paymentDate: sale.paymentDate,
            date: sale.date,
            price: sale.price,
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
            error: ({ error }: any) => {
                this.existCustomerBool = false;
                this.existCustomerMsg = error.message;
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
                    summary: customer.message,
                    life: 3000,
                });
                this.existCustomerBool = true;
                this.existCustomerMsg = customer.message;
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
                this.existCustomerBool = false;
                this.existCustomerMsg = error.message;
            },
        });
    }

    openForSeeProduct(product: Product) {
        this.product = product;
        this.dialogForSeeProduct = true;
    }

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

    openChangePaymentDateDialog(saleId: string) {
        this.newPaymentDate = {};
        this.newPaymentDate.saleId = saleId;
        this.dialogForChangePaymentDate = true;
    }

    openPaymentDateDialog(saleId: string, customerName: string) {
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
                    summary: sale.message,
                    life: 3000,
                });

                this.loadSalesAndProfit();
            },
            error: ({ error }: any) => {
                this.messageService.add({
                    severity: "error",
                    summary: error.message,
                    life: 3000,
                });
            },
        });

        this.sale = {};
    }

    saveProduct() {
        this.submitted = false;
        this.dialog = false;
        this.saleDto.employeeDni = this.selectedEmployee?.dni;
        this.saleDto.customerDni = this.selectedCustomer?.dni;

        console.log(this.saleDto.detail);

        if (this.isOpenForEdit) {
            this._salesService
                .update(this.saleDto, this.sale.saleId)
                .subscribe({
                    next: (sale) => {
                        this.messageService.add({
                            severity: "success",
                            summary: sale.message,
                            life: 3000,
                        });
                        this.loadSalesAndProfit();
                        this.isOpenForEdit = false;
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
        } else {
            this._salesService.add(this.saleDto).subscribe({
                next: (sale) => {
                    this.messageService.add({
                        severity: "success",
                        summary: sale.message,
                        life: 3000,
                    });
                    this.loadSalesAndProfit();
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
    }
}
