import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReminderComponent } from "./reminder.component";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { CalendarModule } from "primeng/calendar";
import { MultiSelectModule } from "primeng/multiselect";
import { MessagesModule } from "primeng/messages";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { ReminderRoutingModule } from "./reminder-routing.module";
import { FormsModule } from "@angular/forms";
import { TagModule } from "primeng/tag";

@NgModule({
    imports: [
        CommonModule,
        ReminderRoutingModule,
        ToastModule,
        MessagesModule,
        InputTextModule,
        MultiSelectModule,
        ButtonModule,
        CalendarModule,
        DialogModule,
        TableModule,
        FormsModule,
        ButtonModule,
    ],
    providers: [MessageService],
    declarations: [ReminderComponent],
})
export class ReminderModule {}
