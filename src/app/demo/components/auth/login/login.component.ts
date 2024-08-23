import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { MessageService } from "primeng/api";
import { LoginDto } from "src/app/demo/contracts/Dtos/loginDto";
import { AuthenticationService } from "src/app/demo/service/authentication.service";
import { Sleep } from "src/app/demo/utils/sleep";
import { LayoutService } from "src/app/layout/service/app.layout.service";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent {
    loginDto: LoginDto = {};
    password!: string;
    loading: boolean = false;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthenticationService,
        private messageService: MessageService,
        private cookieService: CookieService,
        private router: Router
    ) {}

    public login() {
        if (
            this.loginDto.email != "" &&
            this.loginDto.email != null &&
            this.loginDto.password != "" &&
            this.loginDto.password != null
        )
            this.authService.login(this.loginDto).subscribe({
                next: async (response) => {
                    this.messageService.add({
                        severity: "success",
                        summary: response.message,
                        life: 3000,
                    });

                    this.loading = true;
                    await Sleep.sleep(900);

                    this.cookieService.set("token", response.data.token);
                    this.router.navigateByUrl("/");
                    this.loading = false;
                },
                error: ({ error }) => {
                    if (error.errors !== null)
                        error?.errors?.map((x) => {
                            this.messageService.add({
                                severity: "error",
                                summary: x.errorMessage,
                                life: 4000,
                            });
                        });
                    else
                        this.messageService.add({
                            severity: "error",
                            summary: error.message,
                            life: 3000,
                        });
                },
            });
        else
            this.messageService.add({
                severity: "error",
                summary: "El correo y/o contraseña no pueden ser vacíos.",
                life: 3000,
            });
    }
}
