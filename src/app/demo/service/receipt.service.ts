import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReceiptDto } from "../contracts/Dtos/receiptDto";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject, tap } from "rxjs";
import { apiUrl } from "src/app/layout/urlservice";
import { Receipt } from "../contracts/receipt";

@Injectable()
export class ReceiptService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<BaseResponse<Receipt[]>> {
        const receipt = this.http.get<BaseResponse<Receipt[]>>(
            `${apiUrl}receipt`
        );
        return receipt;
    }

    add(receipt: ReceiptDto): Observable<BaseResponse<string>> {
        const newReceipt = this.http
            .post<BaseResponse<string>>(`${apiUrl}receipt`, receipt)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return newReceipt;
    }

    delete(code: string): Observable<BaseResponse<string>> {
        const receipt = this.http
            .delete<BaseResponse<string>>(`${apiUrl}receipt/${code}`)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return receipt;
    }
}
