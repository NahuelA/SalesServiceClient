import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { CustomerComponent } from "./customer.component";
import { CustomerRoutingModule } from "./customer-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToggleButtonModule } from "primeng/togglebutton";
import { RippleModule } from "primeng/ripple";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { ToolbarModule } from "primeng/toolbar";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";

@NgModule({
    imports: [
        CommonModule,
        CustomerRoutingModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        InputNumberModule,
        DialogModule,
    ],
    declarations: [CustomerComponent],
})
export class CustomerModule {}
