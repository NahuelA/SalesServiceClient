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
    updateDialog: boolean = false;
    deleteDialog: boolean = false;

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
        this._employeeService.get().subscribe((employees) => {
            this.employees = employees.data;
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
                this._employeeService.get().subscribe((employees) => {
                    this.employees = employees.data;
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

    openDeleteDialog(employee: Employee) {
        this.employee = employee;
        this.deleteDialog = true;
    }

    hideDeleteDialog() {
        this.deleteDialog = false;
    }

    openUpdateDialog(employee: Employee) {
        this.employee = employee;
        this.updateDialog = true;
    }

    hideUpdateDialog() {
        this.updateDialog = false;
    }

    update() {
        this.hideUpdateDialog();

        this.employee.phoneNumber = this.employee?.phoneNumber?.toString();

        this._employeeService.update(this.employee).subscribe({
            next: (employee) => {
                this.messageService.add({
                    severity: "success",
                    summary: employee.message,
                    life: 3000,
                });

                this.employee = {};
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

        this._employeeService.delete(this.employee).subscribe({
            next: (employee) => {
                this.messageService.add({
                    severity: "success",
                    summary: employee.message,
                    life: 3000,
                });

                this._employeeService.get().subscribe((employees) => {
                    this.employees = employees.data;
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

        this.employee = {};
    }

    saveProduct() {
        this.submitted = true;
        this.dialog = false;

        this.employee.phoneNumber = this.employee?.phoneNumber?.toString();

        this._employeeService.add(this.employee).subscribe({
            next: (employee) => {
                this.messageService.add({
                    severity: "success",
                    summary: employee.message,
                    life: 3000,
                });
                this.employee = {};
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
