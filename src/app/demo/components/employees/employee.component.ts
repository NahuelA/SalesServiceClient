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
                    summary: "Registro actualizado con éxito",
                    detail: employee.result?.toString(),
                    life: 3000,
                });

                this.employee = {};
            },

            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al actualizar al empleado, inténtalo de nuevo.",
                    detail: error.result?.toString(),
                    life: 3000,
                });

                console.log(error);
            },
        });
    }

    remove() {
        this.deleteDialog = false;

        this._employeeService.delete(this.employee).subscribe({
            next: (employee) => {
                this.messageService.add({
                    severity: "success",
                    summary: "Registro eliminado con éxito",
                    detail: employee.result?.toString(),
                    life: 3000,
                });

                this._employeeService.get().subscribe((employees) => {
                    this.employees = employees.result as Employee[];
                    this.loading = false;
                });
            },
            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al eliminar al empleado, inténtalo de nuevo.",
                    detail: error?.error?.result?.toString(),
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
                    summary: "Registro creado con éxito",
                    detail: employee.result?.toString(),
                    life: 3000,
                });
                this.employee = {};
            },

            error: (error) => {
                this.messageService.add({
                    severity: "error",
                    summary:
                        "Hubo un error al registrar al empleado, inténtalo de nuevo.",
                    detail: error.result?.toString(),
                    life: 3000,
                });
            },
        });
    }
}
