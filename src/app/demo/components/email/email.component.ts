import { Component, OnInit } from "@angular/core";
import { MessageService } from "primeng/api";
import { EmailDto } from "../../contracts/Dtos/emailDto";
import { EmailService } from "../../service/email.service";
import { Customer } from "../../contracts/customer";
import { CustomerService } from "../../service/customer.service";
import { EmailConfigurationDto } from "../../contracts/Dtos/emailConfigurationDto";

@Component({
    templateUrl: "./email.component.html",
    styleUrl: "../../../../assets/demo/styles/email.scss",
})
export class EmailComponent implements OnInit {
    email: EmailDto = {};
    pieData: any = {};
    pieOptions: any = {};
    attachment: File;
    customers: Customer[];
    configEmailDialog: boolean = false;
    helpDialog: boolean = false;
    loading: boolean = false;
    emailConfigLoading: boolean = false;
    emailConfigurationDto: EmailConfigurationDto = {};

    constructor(
        private emailService: EmailService,
        private customerService: CustomerService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.customerService.get().subscribe({
            next: (customers) => {
                this.customers = customers.data;
            },
        });
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        this.attachment = input.files[0];
    }

    showHelpDialog() {
        this.helpDialog = true;
    }

    closeHelpDialog() {
        this.helpDialog = false;
    }

    showConfigEmailDialog() {
        this.configEmailDialog = true;
    }

    closeConfigEmailDialog() {
        this.configEmailDialog = false;
    }

    configEmail() {
        if (
            this.emailConfigurationDto.email === undefined ||
            this.emailConfigurationDto.email === "" ||
            this.emailConfigurationDto.password === undefined ||
            this.emailConfigurationDto.password === ""
        )
            this.messageService.add({
                severity: "error",
                summary: "El correo y/o contraseña no pueden ser nulos.",
                life: 3000,
            });
        else {
            this.emailConfigLoading = true;
            this.emailService
                .configEmail(this.emailConfigurationDto)
                .subscribe({
                    next: (configEmail) => {
                        this.messageService.add({
                            severity: "success",
                            summary: configEmail.message,
                            life: 10000,
                        });
                        this.emailConfigLoading = false;
                        this.closeConfigEmailDialog();
                    },
                    error: ({ error }) => {
                        this.messageService.add({
                            severity: "error",
                            summary: error.message,
                            life: 3000,
                        });
                    },
                });
        }
    }

    send() {
        if (
            this.email.message == undefined ||
            this.email.subject == undefined ||
            this.email.customers == undefined
        )
            this.messageService.add({
                severity: "error",
                summary:
                    "No se pueden enviar correos sin el asunto, mensaje y/o destinatario.",
                life: 3000,
            });
        else {
            this.loading = true;
            this.emailService.send(this.email, this.attachment).subscribe({
                next: (email) => {
                    this.loading = false;
                    this.messageService.add({
                        severity: "success",
                        summary: email?.message,
                        life: 3000,
                    });
                },
                error: ({ error }: any) => {
                    this.loading = true;
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
                    this.loading = false;
                },
            });
        }
    }
}
