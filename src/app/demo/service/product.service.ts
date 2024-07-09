import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../contracts/product";
import { BaseResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { prodApi } from "src/app/layout/urlservice";

@Injectable()
export class ProductService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<BaseResponse<Product[]>> {
        const res = this.http.get<BaseResponse<Product[]>>(
            `${prodApi}product`
        );
        return res;
    }

    getByCode(code: string): Observable<BaseResponse<Product>> {
        const res = this.http.get<BaseResponse<Product>>(
            `${prodApi}product/${code}`
        );
        return res;
    }

    add(product: Product): Observable<BaseResponse<string>> {
        const post = this.http
            .post<BaseResponse<string>>(`${prodApi}product`, product)
            ?.pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }

    delete(code: string): Observable<BaseResponse<string>> {
        const remove = this.http.delete<BaseResponse<string>>(
            `${prodApi}product/${code}`
        );

        return remove;
    }

    update(
        productId: string,
        product: Product
    ): Observable<BaseResponse<string>> {
        const put = this.http.put<BaseResponse<string>>(
            `${prodApi}product/${productId}`,
            product
        );

        return put;
    }
}
