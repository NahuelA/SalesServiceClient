import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SaleComponent } from "./sale.component";
import { SaleRoutingModule } from "./sale-routing.module";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { ConfirmPopupModule } from "primeng/confirmpopup";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ChartModule } from "primeng/chart";
import { AnalyticsService } from "../../service/analytics.service";

@NgModule({
    imports: [
        CommonModule,
        ConfirmPopupModule,
        ConfirmDialogModule,
        SaleRoutingModule,
        CalendarModule,
        FormsModule,
        TableModule,
        ButtonModule,
        InputTextModule,
        DropdownModule,
        ToastModule,
        InputTextareaModule,
        InputNumberModule,
        DialogModule,
        ChartModule,
    ],
    providers: [AnalyticsService],
    declarations: [SaleComponent],
})
export class SaleModule {}
