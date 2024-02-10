import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../contracts/employee";
import { RouterModule } from "@angular/router";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";

@Injectable()
export class EmployeeService {
    mainUri: string = "http://localhost:5117/api/";

    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${this.mainUri}employee/`);
        return res;
    }

    getEmployeeByDni(dni: number): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(
            `${this.mainUri}employee/${dni}`
        );
        return res;
    }

    getEmployeesForMenu(limit: number): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${this.mainUri}employee`);
        return res;
    }

    add(employee: Employee): Observable<CustomResponse> {
        const post = this.http
            .post<CustomResponse>(`${this.mainUri}employee/`, employee)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }
}
