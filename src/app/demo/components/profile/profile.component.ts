import { Component, OnInit } from "@angular/core";
import { ProfileDto } from "../../contracts/Dtos/profileDto";
import { MessageService } from "primeng/api";
import { ProfileService } from "../../service/profile.service";

@Component({
    templateUrl: "./profile.component.html",
    styleUrl: "../../../../assets/demo/styles/profile.scss",
})
export class ProfileComponent implements OnInit {
    profile: ProfileDto = {};
    updateProfileDialog: boolean = false;

    constructor(
        private _messageService: MessageService,
        private _profileSerivce: ProfileService
    ) {}

    ngOnInit(): void {
        this._profileSerivce.get().subscribe({
            next: (profile) => {
                this.profile = profile;
            },
        });
    }

    showUpdateProfileDialog() {
        this.updateProfileDialog = true;
    }

    closeUpdateProfileDialog() {
        this.updateProfileDialog = false;
    }

    update() {
        this._profileSerivce.update(this.profile).subscribe({
            next: (profile) => {
                this._messageService.add({
                    severity: "success",
                    summary: profile.message,
                    life: 3000,
                });
            },
            error: (error) => {
                if (error?.errors !== null)
                    error?.errors?.map((x) => {
                        this._messageService.add({
                            severity: "error",
                            summary: x?.errorMessage,
                            life: 4000,
                        });
                    });
                else
                    this._messageService.add({
                        severity: "error",
                        summary: error?.message,
                        life: 3000,
                    });
            },
        });
    }
}
