import { CommonModule } from "@angular/common";
import { ProfileComponent } from "./profile.component";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { ToastModule } from "primeng/toast";
import { InputNumberModule } from "primeng/inputnumber";
import { DialogModule } from "primeng/dialog";
import { NgModule } from "@angular/core";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { ProfileRoutingModule } from "./profile-routing.module";
import { MessageService } from "primeng/api";
import { ProfileService } from "../../service/profile.service";
import { FormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProfileRoutingModule,
        ButtonModule,
        InputTextModule,
        ToastModule,
        InputNumberModule,
        DialogModule,
        InputGroupModule,
        InputGroupAddonModule,
        ToastModule,
        DialogModule,
    ],
    declarations: [ProfileComponent],
    providers: [MessageService, ProfileService],
})
export class ProfileModule {}
