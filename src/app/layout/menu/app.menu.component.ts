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
    counter: number = 0;

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
                        label: "Comprobantes",
                        icon: "pi pi-fw pi-file",
                        routerLink: ["/comprobantes/"],
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
            this.employees = employee?.data;

            this.employees.map((emp, i) => {
                this.employeeMenuTarget.label = emp?.name;
                this.employeeMenuTarget.icon = "pi pi-fw pi-bookmark";
                this.employeeMenuTarget.routerLink = [`/ventas/${emp?.dni}`];

                if (this.counter == 0) this.employeeMenu.shift();

                if (this.counter < this.employees.length) {
                    this.employeeMenu?.push({ ...this.employeeMenuTarget });
                }
                this.counter++;
            });
        });

        this.model.push({
            label: "Ventas",
            items: this.employeeMenu,
        });
    }
}
