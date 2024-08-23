import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ReminderComponent } from "./reminder.component";

@NgModule({
    imports: [
        RouterModule.forChild([{ path: "", component: ReminderComponent }]),
    ],
    exports: [RouterModule],
})
export class ReminderRoutingModule {}
