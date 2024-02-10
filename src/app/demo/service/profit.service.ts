import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";

@Injectable()
export class ProfitService {
    mainUri: string = "http://localhost:5117/api/";

    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(year: number): Observable<CustomResponse> {
        const res = this.http
            .get<CustomResponse>(`${this.mainUri}dashboard/?year=${year}`)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return res;
    }

    getEmployeeOverview(dni: number, year: number): Observable<CustomResponse> {
        const res = this.http
            .get<CustomResponse>(
                `${this.mainUri}dashboard/employee/${dni}/${year}`
            )
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return res;
    }
}
