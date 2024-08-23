import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject, tap } from "rxjs";
import { localApi } from "src/app/layout/urlservice";
import { ProfileDto } from "../contracts/Dtos/profileDto";

@Injectable()
export class ProfileService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<ProfileDto> {
        const res = this.http.get<ProfileDto>(`${localApi}account/profile`);

        return res;
    }

    update(profileDto: ProfileDto): Observable<BaseResponse<any>> {
        const res = this.http.put<BaseResponse<any>>(
            `${localApi}account/profile`,
            profileDto
        );

        return res;
    }
}
