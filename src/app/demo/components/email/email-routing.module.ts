import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EmailComponent } from "./email.component";

@NgModule({
    imports: [RouterModule.forChild([{ path: "", component: EmailComponent }])],
    exports: [RouterModule],
})
export class EmailRoutingModule {}
