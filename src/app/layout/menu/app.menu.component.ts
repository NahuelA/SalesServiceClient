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
                    {
                        label: "Correos",
                        icon: "pi pi-fw pi-envelope",
                        routerLink: ["/administrar-correos"],
                    },
                    {
                        label: "Agenda",
                        icon: "pi pi-fw pi-calendar-times",
                        routerLink: ["/recordatorios"],
                    },
                ],
            },
            {
                label: "Cuenta",
                items: [
                    {
                        label: "Perfil",
                        icon: "pi pi-fw pi-user",
                        routerLink: ["/cuenta/perfil"],
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
                        icon: "pi pi-fw pi-user-edit",
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
    }
}
