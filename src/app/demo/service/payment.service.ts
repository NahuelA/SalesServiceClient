import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaymentDto } from "../contracts/Dtos/paymentDto";
import { BaseResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { localApi } from "src/app/layout/urlservice";
import { Payment } from "../contracts/payment";

@Injectable()
export class PaymentService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<BaseResponse<Payment[]>> {
        const payments = this.http.get<BaseResponse<Payment[]>>(
            `${localApi}payment`
        );
        return payments;
    }

    add(payment: PaymentDto): Observable<BaseResponse<string>> {
        const newPayment = this.http
            .post<BaseResponse<string>>(`${localApi}payment`, payment)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return newPayment;
    }

    delete(code: string): Observable<BaseResponse<string>> {
        const newPayment = this.http
            .delete<BaseResponse<string>>(`${localApi}payment/${code}`)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return newPayment;
    }
}
