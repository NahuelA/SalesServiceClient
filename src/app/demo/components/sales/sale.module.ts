import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SaleComponent } from "./sale.component";
import { SaleRoutingModule } from "./sale-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToggleButtonModule } from "primeng/togglebutton";
import { RippleModule } from "primeng/ripple";
import { MultiSelectModule } from "primeng/multiselect";
import { DropdownModule } from "primeng/dropdown";
import { ProgressBarModule } from "primeng/progressbar";
import { ToastModule } from "primeng/toast";
import { SliderModule } from "primeng/slider";
import { RatingModule } from "primeng/rating";
import { FileUploadModule } from "primeng/fileupload";
import { ToolbarModule } from "primeng/toolbar";
import { InputTextareaModule } from "primeng/inputtextarea";
import { RadioButtonModule } from "primeng/radiobutton";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ChartModule } from "primeng/chart";

@NgModule({
    imports: [
        CommonModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        SaleRoutingModule,
        CalendarModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        FileUploadModule,
        ToolbarModule,
        InputTextareaModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        ChartModule,
    ],
    declarations: [SaleComponent],
})
export class SaleModule {}
