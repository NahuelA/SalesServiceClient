import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ProductComponent } from "./product.component";
import { ProductRoutingModule } from "./product-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        ProductRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        ToolbarModule,
        InputTextareaModule,
        InputNumberModule,
        DialogModule,
    ],
    declarations: [ProductComponent],
})
export class ProductModule {}
