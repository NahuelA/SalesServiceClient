import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Employee } from "../contracts/employee";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";
import { apiUrl } from "src/app/layout/urlservice";

@Injectable()
export class EmployeeService {
    private _refresh$ = new Subject<void>();
    private employeesSubject: BehaviorSubject<BaseResponse<Employee[]>> =
        new BehaviorSubject<BaseResponse<Employee[]>>({
            isSuccess: true,
            isFound: true,
            message: "",
            data: [],
        });

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<BaseResponse<Employee[]>> {
        this.http
            .get<BaseResponse<Employee[]>>(`${apiUrl}employee/`)
            .subscribe({
                next: (employee) => {
                    this.employeesSubject.next(employee);
                },
                error: ({ error }) => {
                    this.employeesSubject.next(error);
                },
            });

        return this.employeesSubject.asObservable();
    }

    getEmployeeByDni(dni: number): Observable<BaseResponse<Employee>> {
        const res = this.http.get<BaseResponse<Employee>>(
            `${apiUrl}employee/${dni}`
        );
        return res;
    }

    getEmployeesForMenu(limit: number): Observable<BaseResponse<Employee[]>> {
        const res = this.http
            .get<BaseResponse<Employee[]>>(`${apiUrl}employee`)
            .subscribe({
                next: (employee) => {
                    this.employeesSubject.next(employee);
                },
                error: ({ error }) => {
                    this.employeesSubject.next(error);
                },
            });

        return this.employeesSubject.asObservable();
    }

    add(employee: Employee): Observable<BaseResponse<string>> {
        const post = this.http
            .post<BaseResponse<string>>(`${apiUrl}employee/`, employee)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        this.employeesSubject.next({
            isSuccess: true,
            isFound: true,
            message: "",
            data: [],
        });
        return post;
    }

    update(employee: Employee): Observable<BaseResponse<string>> {
        const put = this.http.put<BaseResponse<string>>(
            `${apiUrl}employee/${employee.employeeId}`,
            employee
        );
        return put;
    }

    delete(employee: Employee): Observable<BaseResponse<string>> {
        const remove = this.http
            .delete<BaseResponse<string>>(`${apiUrl}employee/${employee.dni}/`)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return remove;
    }
}
