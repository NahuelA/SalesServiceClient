import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SaleDto } from "../contracts/Dtos/saleDto";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject } from "rxjs";
import { apiUrl } from "src/app/layout/urlservice";
import { Sale } from "../contracts/sale";

@Injectable()
export class SaleService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(limit: number): Observable<BaseResponse<Sale[]>> {
        const sale = this.http.get<BaseResponse<Sale[]>>(`${apiUrl}sale`);
        return sale;
    }

    public getBySeller(
        limit: number,
        dni: number
    ): Observable<BaseResponse<Sale[]>> {
        let sale: any;

        if (dni === 0) {
            sale = this.http.get<BaseResponse<Sale[]>>(`${apiUrl}sale`);
            return sale;
        }

        sale = this.http.get<BaseResponse<Sale[]>>(
            `${apiUrl}sale/filterByEmployees/${dni}`
        );

        return sale;
    }

    add(sale: SaleDto): Observable<BaseResponse<string>> {
        const newSale = this.http.post<BaseResponse<string>>(
            `${apiUrl}sale`,
            sale
        );

        return newSale;
    }

    delete(saleId: string): Observable<BaseResponse<string>> {
        const remove = this.http.delete<BaseResponse<string>>(
            `${apiUrl}sale/${saleId}/`
        );

        return remove;
    }

    update(sale: SaleDto, saleId: string): Observable<BaseResponse<string>> {
        const newSale = this.http.put<BaseResponse<string>>(
            `${apiUrl}sale/${saleId}`,
            sale
        );

        return newSale;
    }

    markAsPaid(
        saleId: string,
        nextPaymentDate: Date | string
    ): Observable<BaseResponse<string>> {
        const markAsPaid = this.http.put<BaseResponse<string>>(
            `${apiUrl}sale/markAsPaid/${saleId}`,
            nextPaymentDate
        );

        return markAsPaid;
    }

    changePaymentDate(
        saleId: string,
        date: Date | string
    ): Observable<BaseResponse<string>> {
        const changePaymentDate = this.http.put<BaseResponse<string>>(
            `${apiUrl}sale/changePaymentDate/${saleId}`,
            date
        );
        return changePaymentDate;
    }
}
