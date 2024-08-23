import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReceiptComponent } from "./receipt.component";
import { PaymentRoutingModule } from "./receipt-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        PaymentRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        InputTextareaModule,
        InputNumberModule,
        DialogModule,
        DropdownModule,
    ],
    declarations: [ReceiptComponent],
})
export class ReceiptModule {}
