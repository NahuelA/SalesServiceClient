import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Payment } from "../contracts/payment";
import { PaymentDto } from "../contracts/Dtos/paymentDto";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";

@Injectable()
export class PaymentService {
    mainUri: string = "http://localhost:5117/api/";

    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<any> {
        const payments = this.http.get<CustomResponse>(
            `${this.mainUri}payment`
        );
        return payments;
    }

    add(payment: PaymentDto): Observable<any> {
        const newPayment = this.http
            .post(`${this.mainUri}payment`, payment)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return newPayment;
    }
}
