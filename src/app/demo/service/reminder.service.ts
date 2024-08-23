import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject, tap } from "rxjs";
import { apiUrl } from "src/app/layout/urlservice";
import { ReminderDto } from "../contracts/Dtos/reminderDto";

@Injectable()
export class ReminderService {
    constructor(private http: HttpClient) {}

    sendReminder(reminder: ReminderDto): Observable<BaseResponse<string>> {
        const res = this.http.post<BaseResponse<string>>(
            `${apiUrl}reminder/`,
            reminder
        );

        return res;
    }

    get(): Observable<BaseResponse<ReminderDto[]>> {
        const reminder = this.http.get<BaseResponse<ReminderDto[]>>(
            `${apiUrl}reminder/`
        );

        return reminder;
    }
}
