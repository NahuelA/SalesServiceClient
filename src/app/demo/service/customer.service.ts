import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Customer } from "../contracts/customer";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { prodApi } from "src/app/layout/urlservice";

@Injectable()
export class CustomerService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${prodApi}client/`);
        return res;
    }

    getByDni(dni: number): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(
            `${prodApi}client/${dni}`
        );
        return res;
    }

    add(customer: Customer): Observable<CustomResponse> {
        const post = this.http
            .post<CustomResponse>(`${prodApi}client/`, customer)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }

    update(customer: Customer): Observable<CustomResponse> {
        const put = this.http.put<CustomResponse>(
            `${prodApi}client/${customer.clientId}`,
            customer
        );
        return put;
    }

    delete(id): Observable<CustomResponse> {
        const remove = this.http.delete<CustomResponse>(
            `${prodApi}client/${id}/?IsConfirmedDelete=true`
        );
        return remove;
    }
}
