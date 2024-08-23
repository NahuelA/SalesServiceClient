import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject } from "rxjs";
import { localApi } from "src/app/layout/urlservice";
import { EmailDto } from "../contracts/Dtos/emailDto";
import { EmailConfigurationDto } from "../contracts/Dtos/emailConfigurationDto";

@Injectable()
export class EmailService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<BaseResponse<EmailDto[]>> {
        const res = this.http.get<BaseResponse<EmailDto[]>>(
            `${localApi}email/`
        );
        return res;
    }

    send(emailDto: EmailDto, attachment: File): Observable<any> {
        var formData = new FormData();

        formData.append("attachment", attachment);
        formData.append("emailDto", JSON.stringify(emailDto));

        const post = this.http.post<any>(
            `${localApi}Email/sendMultiplesEmails/`,
            formData
        );
        return post;
    }

    configEmail(
        emailConfigurationDto: EmailConfigurationDto
    ): Observable<BaseResponse<string>> {
        const config = this.http.post<BaseResponse<string>>(
            `${localApi}email/configEmail`,
            emailConfigurationDto
        );
        return config;
    }
}
