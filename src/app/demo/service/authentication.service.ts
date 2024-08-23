import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseResponse } from "../contracts/Base/baseResponse";
import { Observable, Subject, tap } from "rxjs";
import { apiUrl } from "src/app/layout/urlservice";
import { User } from "../contracts/user";
import { LoginDto } from "../contracts/Dtos/loginDto";
import { CookieService } from "ngx-cookie-service";
import { TokenDto } from "../contracts/Dtos/tokenDto";

@Injectable()
export class AuthenticationService {
    private _refresh$ = new Subject<void>();

    constructor(
        private http: HttpClient,
        private cookieService: CookieService
    ) {}

    get refresh$() {
        return this._refresh$;
    }

    tokenIsValid(): Observable<boolean> {
        var tokenDto: TokenDto = { token: this.cookieService.get("token") };

        const post = this.http.post<boolean>(
            `${apiUrl}account/tokenValidation`,
            tokenDto
        );
        return post;
    }

    register(user: User): Observable<BaseResponse<string>> {
        const post = this.http
            .post<BaseResponse<string>>(`${apiUrl}account/register`, user)
            .pipe(
                tap(() => {
                    this._refresh$.next();
                })
            );
        return post;
    }

    login(login: LoginDto): Observable<BaseResponse<TokenDto>> {
        const post = this.http.post<BaseResponse<TokenDto>>(
            `${apiUrl}account/login`,
            login
        );

        return post;
    }
}
