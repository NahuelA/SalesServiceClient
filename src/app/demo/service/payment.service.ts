import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { PaymentDto } from "../contracts/Dtos/paymentDto";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { localApi } from "src/app/layout/urlservice";

@Injectable()
export class PaymentService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<any> {
        const payments = this.http.get<CustomResponse>(
            `${localApi}payment`
        );
        return payments;
    }

    add(payment: PaymentDto): Observable<any> {
        const newPayment = this.http
            .post(`${localApi}payment`, payment)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return newPayment;
    }
}
