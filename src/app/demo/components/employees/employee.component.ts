import {
    Component,
    OnInit,
    ViewChild,
    ElementRef,
    OnDestroy,
} from "@angular/core";
import { Table } from "primeng/table";
import { MessageService, ConfirmationService } from "primeng/api";
import { EmployeeService } from "src/app/demo/service/employee.service";

import { Employee } from "src/app/demo/contracts/employee";
import { CustomResponse } from "../../contracts/response";
import { Subscription } from "rxjs";

@Component({
    templateUrl: "./employee.component.html",
    providers: [MessageService, ConfirmationService],
})
export class EmployeeComponent implements OnInit, OnDestroy {
    title: string = "Empleados";
    searchPlaceholder: string = "Buscar empleado";
    employees?: Employee[] = [];
    private _routeSubscription: Subscription;

    employee: Employee = {};
    submitted: boolean = false;
    dialog: boolean = false;

    selectedEmployee: Employee = {};

    idFrozen: boolean = false;

    loading: boolean = true;

    sector: any[] = [];

    @ViewChild("filter") filter!: ElementRef;

    constructor(
        private _employeeService: EmployeeService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this._employeeService.get().subscribe((employees: CustomResponse) => {
            this.employees = employees.result as Employee[];
            this.loading = false;
        });

        this.sector = [
            { label: "RRHH" },
            { label: "ADMINISTRADOR" },
            { label: "ANALISTA_FUNCIONAL" },
            { label: "COBRADOR_Y_VENDEDOR" },
            { label: "DEPOSITO" },
            { label: "GERENTE" },
            { label: "VENDEDOR" },
        ];

        this._routeSubscription = this._employeeService.refresh$.subscribe(
            () => {
                this._employeeService
                    .get()
                    .subscribe((employees: CustomResponse) => {
                        this.employees = employees.result as Employee[];
                        this.loading = false;
                    });
            }
        );
    }

    ngOnDestroy() {
        this._routeSubscription.unsubscribe();
    }

    openNew() {
        this.employee = {};
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

        this.employee.phoneNumber = this.employee?.phoneNumber?.toString();
        this.employee.country = "";
        this.employee.city = "";

        this._employeeService.add(this.employee).subscribe((employee) => {
            this.messageService.add({
                severity: "success",
                summary: "Registro creado con éxito",
                detail: employee.result.toString(),
                life: 3000,
            });

            if (employee.statusCode === 400)
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al registrar al empleado, inténtalo de nuevo.",
                    detail: employee.result.toString(),
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
