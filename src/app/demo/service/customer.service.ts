import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Customer } from "../contracts/customer";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject, tap } from "rxjs";
import { localApi } from "src/app/layout/urlservice";

@Injectable()
export class CustomerService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<BaseResponse<Customer[]>> {
        const res = this.http.get<BaseResponse<Customer[]>>(
            `${localApi}customer/`
        );
        return res;
    }

    getByDni(dni: number): Observable<BaseResponse<Customer>> {
        const res = this.http.get<BaseResponse<Customer>>(
            `${localApi}customer/${dni}`
        );
        return res;
    }

    add(customer: Customer): Observable<BaseResponse<string>> {
        const post = this.http
            .post<BaseResponse<string>>(`${localApi}customer/`, customer)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }

    update(customer: Customer): Observable<BaseResponse<string>> {
        const put = this.http.put<BaseResponse<string>>(
            `${localApi}customer/${customer.oldDni}`,
            customer
        );
        return put;
    }

    delete(dni: number): Observable<BaseResponse<string>> {
        const remove = this.http.delete<BaseResponse<string>>(
            `${localApi}customer/${dni}/`
        );
        return remove;
    }
}
