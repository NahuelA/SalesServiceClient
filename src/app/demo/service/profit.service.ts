import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { localApi } from "src/app/layout/urlservice";

@Injectable()
export class ProfitService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(year: number): Observable<BaseResponse<any>> {
        const res = this.http
            .get<BaseResponse<any>>(`${localApi}dashboard/?year=${year}`)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return res;
    }

    getEmployeeOverview(dni: number, year: number): Observable<BaseResponse<any>> {
        const res = this.http
            .get<BaseResponse<any>>(
                `${localApi}dashboard/employee/${dni}/${year}`
            )
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return res;
    }
}
