import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SaleComponent } from "./sale.component";

@NgModule({
    imports: [
        RouterModule.forChild([{ path: "", component: SaleComponent }]),
        RouterModule.forChild([{ path: ":dni", component: SaleComponent }]),
    ],
    exports: [RouterModule],
})
export class SaleRoutingModule {}
