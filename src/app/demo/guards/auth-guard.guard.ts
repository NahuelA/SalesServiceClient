import { CanActivateFn, Router } from "@angular/router";
import { AuthenticationService } from "../service/authentication.service";
import { inject } from "@angular/core";
import { catchError, map, of, tap } from "rxjs";
import { BaseResponse } from "../contracts/Base/baseResponse";

export const authGuardGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthenticationService);
    const router = inject(Router);

    return authService.tokenIsValid().pipe(
        tap((isValid) => {
            if (!isValid) {
                router.navigateByUrl("cuenta/login");
            }
        }),
        map((isValid) => {
            return isValid;
        }),
        catchError((error: BaseResponse<boolean>) => {
            router.navigateByUrl("cuenta/login");
            return of(error.isFound);
        })
    );
};
