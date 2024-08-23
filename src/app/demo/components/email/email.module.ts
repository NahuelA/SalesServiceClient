import { NgModule } from "@angular/core";
import { EmailComponent } from "./email.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { EmailRoutingModule } from "./email-routing.module";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { MultiSelectModule } from "primeng/multiselect";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { InputGroupModule } from "primeng/inputgroup";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessagesModule } from "primeng/messages";
import { CalendarModule } from "primeng/calendar";
import { MessageService } from "primeng/api";
import { DialogModule } from "primeng/dialog";
import { PasswordModule } from "primeng/password";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        EmailRoutingModule,
        ToastModule,
        MessagesModule,
        InputTextModule,
        InputTextareaModule,
        MultiSelectModule,
        InputGroupModule,
        InputGroupAddonModule,
        ButtonModule,
        CalendarModule,
        DialogModule,
        PasswordModule,
    ],
    providers: [MessageService],
    declarations: [EmailComponent],
})
export class EmailModule {}
