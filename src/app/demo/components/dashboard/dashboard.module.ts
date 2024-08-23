import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { DashboardComponent } from "./dashboard.component";
import { ChartModule } from "primeng/chart";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { DashboardsRoutingModule } from "./dashboard-routing.module";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { AnalyticsService } from "../../service/analytics.service";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ChartModule,
        TableModule,
        ButtonModule,
        DashboardsRoutingModule,
        DialogModule,
        InputTextModule,
    ],
    providers: [AnalyticsService],
    declarations: [DashboardComponent],
})
export class DashboardModule {}
