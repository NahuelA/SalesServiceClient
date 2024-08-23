import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReceiptComponent } from "./receipt.component";

@NgModule({
    imports: [
        RouterModule.forChild([{ path: "", component: ReceiptComponent }]),
    ],
    exports: [RouterModule],
})
export class PaymentRoutingModule {}
