import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SaleDto } from "../contracts/Dtos/saleDto";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { prodApi } from "src/app/layout/urlservice";

@Injectable()
export class SaleService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(limit: number): Observable<CustomResponse> {
        const sale = this.http.get<CustomResponse>(`${prodApi}sale`);
        return sale;
    }

    public getBySeller(limit: number, dni: number): Observable<CustomResponse> {
        let sale: any;

        if (dni === 0) {
            sale = this.http.get<CustomResponse>(`${prodApi}sale`);
            return sale;
        }

        sale = this.http
            .get<CustomResponse>(`${prodApi}sale/filterByEmployees/${dni}`);

        return sale;
    }

    add(sale: SaleDto): Observable<CustomResponse> {
        const newSale = this.http.post<CustomResponse>(`${prodApi}sale`, sale);

        return newSale;
    }

    delete(id): Observable<CustomResponse> {
        const remove = this.http.delete<CustomResponse>(
            `${prodApi}sale/${id}/?IsConfirmedDelete=true`
        );

        return remove;
    }

    update(sale: SaleDto, id: number): Observable<CustomResponse> {
        const newSale = this.http.put<CustomResponse>(
            `${prodApi}sale/${id}`,
            sale
        );

        return newSale;
    }

    markAsPaid(
        id: number,
        nextPaymentDate: Date | string
    ): Observable<CustomResponse> {
        const markAsPaid = this.http.put<CustomResponse>(
            `${prodApi}sale/markAsPaid/${id}`,
            nextPaymentDate
        );

        return markAsPaid;
    }

    changePaymentDate(
        id: number,
        date: Date | string
    ): Observable<CustomResponse> {
        const changePaymentDate = this.http.put<CustomResponse>(
            `${prodApi}sale/changePaymentDate/${id}`,
            date
        );
        return changePaymentDate;
    }
}
