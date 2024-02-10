import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SaleDto } from "../contracts/Dtos/saleDto";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";

@Injectable()
export class SaleService {
    mainUri: string = "http://localhost:5117/api/";
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(limit: number): Observable<CustomResponse> {
        const sale = this.http.get<CustomResponse>(`${this.mainUri}sale`);
        return sale;
    }

    public getBySeller(limit: number, dni: number): Observable<CustomResponse> {
        let sale: any;

        if (dni === 0) {
            sale = this.http.get<CustomResponse>(`${this.mainUri}sale`);
            return sale;
        }

        sale = this.http.get<CustomResponse>(
            `${this.mainUri}sale/filterByEmployees/${dni}`
        );
        return sale;
    }

    add(sale: SaleDto): Observable<CustomResponse> {
        const newSale = this.http
            .post<CustomResponse>(`${this.mainUri}sale`, sale)
            ?.pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return newSale;
    }

    update(sale: SaleDto, id: number): Observable<CustomResponse> {
        const newSale = this.http
            .put<CustomResponse>(`${this.mainUri}sale/${id}`, sale)
            ?.pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return newSale;
    }

    markAsPaid(
        id: number,
        nextPaymentDate: Date | string
    ): Observable<CustomResponse> {
        const markAsPaid = this.http
            .put<CustomResponse>(
                `${this.mainUri}sale/markAsPaid/${id}`,
                nextPaymentDate
            )
            ?.pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return markAsPaid;
    }

    changePaymentDate(
        id: number,
        date: Date | string
    ): Observable<CustomResponse> {
        const changePaymentDate = this.http
            .put<CustomResponse>(
                `${this.mainUri}sale/changePaymentDate/${id}`,
                date
            )
            ?.pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return changePaymentDate;
    }
}
