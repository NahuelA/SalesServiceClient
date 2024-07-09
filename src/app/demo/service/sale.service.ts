import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SaleDto } from "../contracts/Dtos/saleDto";
import { BaseResponse } from "../contracts/response";
import { Observable, Subject } from "rxjs";
import { localApi } from "src/app/layout/urlservice";
import { Sale } from "../contracts/sale";

@Injectable()
export class SaleService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(limit: number): Observable<BaseResponse<Sale[]>> {
        const sale = this.http.get<BaseResponse<Sale[]>>(`${localApi}sale`);
        return sale;
    }

    public getBySeller(
        limit: number,
        dni: number
    ): Observable<BaseResponse<Sale[]>> {
        let sale: any;

        if (dni === 0) {
            sale = this.http.get<BaseResponse<Sale[]>>(`${localApi}sale`);
            return sale;
        }

        sale = this.http.get<BaseResponse<Sale[]>>(
            `${localApi}sale/filterByEmployees/${dni}`
        );

        return sale;
    }

    add(sale: SaleDto): Observable<BaseResponse<string>> {
        const newSale = this.http.post<BaseResponse<string>>(
            `${localApi}sale`,
            sale
        );

        return newSale;
    }

    delete(saleId: number): Observable<BaseResponse<string>> {
        const remove = this.http.delete<BaseResponse<string>>(
            `${localApi}sale/${saleId}/`
        );

        return remove;
    }

    update(sale: SaleDto, saleId: number): Observable<BaseResponse<string>> {
        const newSale = this.http.put<BaseResponse<string>>(
            `${localApi}sale/${saleId}`,
            sale
        );

        return newSale;
    }

    markAsPaid(
        saleId: number,
        nextPaymentDate: Date | string
    ): Observable<BaseResponse<string>> {
        const markAsPaid = this.http.put<BaseResponse<string>>(
            `${localApi}sale/markAsPaid/${saleId}`,
            nextPaymentDate
        );

        return markAsPaid;
    }

    changePaymentDate(
        saleId: number,
        date: Date | string
    ): Observable<BaseResponse<string>> {
        const changePaymentDate = this.http.put<BaseResponse<string>>(
            `${localApi}sale/changePaymentDate/${saleId}`,
            date
        );
        return changePaymentDate;
    }
}
