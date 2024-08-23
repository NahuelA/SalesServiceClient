import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { AppLayoutComponent } from "./layout/app.layout.component";
import { authGuardGuard } from "./demo/guards/auth-guard.guard";

@NgModule({
    imports: [
        RouterModule.forRoot(
            [
                {
                    path: "",
                    component: AppLayoutComponent,
                    children: [
                        {
                            path: "",
                            loadChildren: () =>
                                import(
                                    "./demo/components/dashboard/dashboard.module"
                                ).then((m) => m.DashboardModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "empleados",
                            loadChildren: () =>
                                import(
                                    "./demo/components/employees/employee.module"
                                ).then((m) => m.EmployeeModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "clientes",
                            loadChildren: () =>
                                import(
                                    "./demo/components/customer/customer.module"
                                ).then((m) => m.CustomerModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "productos",
                            loadChildren: () =>
                                import(
                                    "./demo/components/products/product.module"
                                ).then((m) => m.ProductModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "comprobantes",
                            loadChildren: () =>
                                import(
                                    "./demo/components/receipt/receipt.module"
                                ).then((m) => m.ReceiptModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "ventas",
                            loadChildren: () =>
                                import(
                                    "./demo/components/sales/sale.module"
                                ).then((m) => m.SaleModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "cuenta/perfil",
                            loadChildren: () =>
                                import(
                                    "./demo/components/profile/profile.module"
                                ).then((m) => m.ProfileModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "administrar-correos",
                            loadChildren: () =>
                                import(
                                    "./demo/components/email/email.module"
                                ).then((m) => m.EmailModule),
                            canActivate: [authGuardGuard],
                        },
                        {
                            path: "recordatorios",
                            loadChildren: () =>
                                import(
                                    "./demo/components/reminder/reminder.module"
                                ).then((m) => m.ReminderModule),
                            canActivate: [authGuardGuard],
                        },
                        // {
                        //     path: "correos",
                        //     loadChildren: () =>
                        //         import(
                        //             "./demo/components/sales/sale.module"
                        //         ).then((m) => m.SaleModule),
                        //     canActivate: [authGuardGuard],
                        // },
                        // {
                        //     path: "recordatorios",
                        //     loadChildren: () =>
                        //         import(
                        //             "./demo/components/sales/sale.module"
                        //         ).then((m) => m.SaleModule),
                        //     canActivate: [authGuardGuard],
                        // },
                    ],
                },
                {
                    path: "cuenta",
                    loadChildren: () =>
                        import("./demo/components/auth/auth.module").then(
                            (m) => m.AuthModule
                        ),
                },
                { path: "**", redirectTo: "/" },
            ],
            {
                scrollPositionRestoration: "enabled",
                anchorScrolling: "enabled",
                onSameUrlNavigation: "reload",
            }
        ),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule {}
