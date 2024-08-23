import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";
import { RegisterModule } from "./register/register.module";
import { LoginModule } from "./login/login.module";

@NgModule({
    imports: [CommonModule, RegisterModule, LoginModule, AuthRoutingModule],
})
export class AuthModule {}
