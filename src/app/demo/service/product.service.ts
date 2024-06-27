import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Product } from "../contracts/product";
import { CustomResponse } from "../contracts/response";
import { Observable, Subject, tap } from "rxjs";
import { prodApi } from "src/app/layout/urlservice";

@Injectable()
export class ProductService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<any> {
        const res = this.http.get<CustomResponse>(`${prodApi}product`);
        return res;
    }

    add(product: Product): Observable<any> {
        const post = this.http.post(`${prodApi}product`, product)?.pipe(
            tap(() => {
                this._refresh$.next();
            })
        );
        return post;
    }

    getProductsSmall() {
        return this.http
            .get<any>("assets/demo/data/products-small.json")
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProducts() {
        return this.http
            .get<any>("assets/demo/data/products.json")
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProductsMixed() {
        return this.http
            .get<any>("assets/demo/data/products-mixed.json")
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }

    getProductsWithOrdersSmall() {
        return this.http
            .get<any>("assets/demo/data/products-orders-small.json")
            .toPromise()
            .then((res) => res.data as Product[])
            .then((data) => data);
    }
}
