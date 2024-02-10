import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Customer } from "../contracts/customer";
import { CustomResponse } from "../contracts/response";
import { BehaviorSubject, Observable, Subject, tap } from "rxjs";

@Injectable()
export class CustomerService {
    mainUri: string = "http://localhost:5117/api/";

    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(`${this.mainUri}client/`);
        return res;
    }

    getByDni(dni: number): Observable<CustomResponse> {
        const res = this.http.get<CustomResponse>(
            `${this.mainUri}client/${dni}`
        );
        return res;
    }

    add(customer: Customer): Observable<CustomResponse> {
        const post = this.http
            .post<CustomResponse>(`${this.mainUri}client/`, customer)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }
}
