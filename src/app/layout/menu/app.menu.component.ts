import { OnInit } from "@angular/core";
import { Component } from "@angular/core";
import { LayoutService } from "../service/app.layout.service";
import { EmployeeService } from "src/app/demo/service/employee.service";
import { Employee } from "src/app/demo/contracts/employee";
import { MenuItems } from "src/app/demo/contracts/model";

@Component({
    selector: "app-menu",
    templateUrl: "./app.menu.component.html",
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];
    employees: Employee[] = [];
    employeeMenuTarget: MenuItems = {};
    employeeMenu: [MenuItems] = [{}];

    constructor(
        public layoutService: LayoutService,
        private _employeeService: EmployeeService
    ) {}

    ngOnInit() {
        this.model = [
            /* Home section */
            {
                label: "Home",
                items: [
                    {
                        label: "Dashboard",
                        icon: "pi pi-fw pi-home",
                        routerLink: ["/"],
                    },
                ],
            },
            /* UI Components section */
            {
                label: "Menu",
                items: [
                    {
                        label: "Empleados",
                        icon: "pi pi-fw pi-briefcase",
                        routerLink: ["/empleados/"],
                    },
                    {
                        label: "Clientes",
                        icon: "pi pi-fw pi-user",
                        routerLink: ["/clientes/"],
                    },
                    {
                        label: "Productos",
                        icon: "pi pi-fw pi-box",
                        routerLink: ["/productos/"],
                    },
                    {
                        label: "Pagos",
                        icon: "pi pi-fw pi-money-bill",
                        routerLink: ["/pagos/"],
                    },
                    {
                        label: "Ventas",
                        icon: "pi pi-fw pi-cart-plus",
                        routerLink: ["/ventas/"],
                    },
                ],
            },
        ];

        this._employeeService.get().subscribe((employee) => {
            this.employees = employee?.result as Employee[];

            this.employees.map((emp) => {
                this.employeeMenuTarget.label = emp?.name;
                this.employeeMenuTarget.icon = "pi pi-fw pi-bookmark";
                this.employeeMenuTarget.routerLink = [`/ventas/${emp?.dni}`];

                this.employeeMenu?.push({ ...this.employeeMenuTarget });
            });
            this.employeeMenu?.shift();
        });

        this.model.push({
            label: "Ventas",
            items: this.employeeMenu,
        });
    }
}
