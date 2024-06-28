import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../contracts/employee";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { localApi } from "src/app/layout/urlservice";

@Injectable()
export class EmployeeService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${localApi}employee/`);
        return res;
    }

    getEmployeeByDni(dni: number): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${localApi}employee/${dni}`);
        return res;
    }

    getEmployeesForMenu(limit: number): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${localApi}employee`);
        return res;
    }

    add(employee: Employee): Observable<CustomResponse> {
        const post = this.http
            .post<CustomResponse>(`${localApi}employee/`, employee)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }

    update(employee: Employee): Observable<CustomResponse> {
        const put = this.http.put<CustomResponse>(
            `${localApi}employee/${employee.employeeId}`,
            employee
        );
        return put;
    }

    delete(employee: Employee): Observable<CustomResponse> {
        const remove = this.http
            .delete<CustomResponse>(
                `${localApi}employee/${employee.employeeId}/?=IsConfirmedDelete=true`
            )
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return remove;
    }
}
