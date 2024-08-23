import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { CookieService } from "ngx-cookie-service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const cookie = inject(CookieService);

    const token = cookie.get("token");

    const authReq = req.clone({
        headers: req.headers.set("Authorization", `Bearer ${token}`),
    });

    return next(authReq);
};
