import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "registrarme",
                component: RegisterComponent,
            },
            {
                path: "login",
                component: LoginComponent,
            },
            { path: "**", redirectTo: "/cuenta/login" },
        ]),
    ],
    exports: [RouterModule],
})
export class AuthRoutingModule {}
