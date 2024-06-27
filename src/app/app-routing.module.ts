import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { NotfoundComponent } from "./demo/components/notfound/notfound.component";
import { AppLayoutComponent } from "./layout/app.layout.component";

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
                        },
                        {
                            path: "empleados",
                            loadChildren: () =>
                                import(
                                    "./demo/components/employees/employee.module"
                                ).then((m) => m.EmployeeModule),
                        },
                        {
                            path: "clientes",
                            loadChildren: () =>
                                import(
                                    "./demo/components/clients/client.module"
                                ).then((m) => m.ClientModule),
                        },
                        {
                            path: "productos",
                            loadChildren: () =>
                                import(
                                    "./demo/components/products/product.module"
                                ).then((m) => m.ProductModule),
                        },
                        {
                            path: "pagos",
                            loadChildren: () =>
                                import(
                                    "./demo/components/payments/payment.module"
                                ).then((m) => m.PaymentModule),
                        },
                        {
                            path: "ventas",
                            loadChildren: () =>
                                import(
                                    "./demo/components/sales/sale.module"
                                ).then((m) => m.SaleModule),
                        },
                        {
                            path: "pages",
                            loadChildren: () =>
                                import(
                                    "./demo/components/pages/pages.module"
                                ).then((m) => m.PagesModule),
                        },
                    ],
                },
                {
                    path: "auth",
                    loadChildren: () =>
                        import("./demo/components/auth/auth.module").then(
                            (m) => m.AuthModule
                        ),
                },
                { path: "notfound", component: NotfoundComponent },
                { path: "**", redirectTo: "/notfound" },
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
