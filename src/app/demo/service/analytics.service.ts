import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject, tap } from "rxjs";
import { apiUrl } from "src/app/layout/urlservice";
import { SaleOverviewDto } from "../contracts/Dtos/saleOverviewDto";
import { CustomerOverviewDto } from "../contracts/Dtos/customerOverviewDto";

@Injectable()
export class AnalyticsService {
    private _refresh$ = new Subject<void>();

    constructor(private http: HttpClient) {}

    get refresh$() {
        return this._refresh$;
    }

    get(year: number): Observable<BaseResponse<any>> {
        const res = this.http
            .get<BaseResponse<any>>(`${apiUrl}dashboard/?year=${year}`)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return res;
    }

    getEmployeeOverview(
        dni: number,
        year: number
    ): Observable<BaseResponse<any>> {
        const res = this.http
            .get<BaseResponse<any>>(
                `${apiUrl}dashboard/employee/${dni}/${year}`
            )
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );

        return res;
    }

    saleOverview(month: number, year: number): Observable<SaleOverviewDto> {
        const res = this.http.get<SaleOverviewDto>(
            `${apiUrl}dashboard/saleOverview/`,
            {
                params: {
                    month: month,
                    year: year,
                },
            }
        );

        return res;
    }

    customerOverview(
        month: number,
        year: number
    ): Observable<CustomerOverviewDto> {
        const res = this.http.get<CustomerOverviewDto>(
            `${apiUrl}dashboard/customerOverview/`,
            {
                params: {
                    month: month,
                    year: year,
                },
            }
        );

        return res;
    }

    grossRevenueOverview(
        month: number,
        year: number
    ): Observable<CustomerOverviewDto> {
        const res = this.http.get<CustomerOverviewDto>(
            `${apiUrl}dashboard/grossRevenueOverview/`,
            {
                params: {
                    month: month,
                    year: year,
                },
            }
        );

        return res;
    }
}
