import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree
} from "@angular/router";
import { Observable } from "rxjs";
import { territories } from "../components/locale-selector/locale-selector.component";

@Injectable({
    providedIn: "root"
})
export class CountryGuard implements CanActivate {
    constructor(private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const countryCode = route.paramMap.get("countryCode");

        if (countryCode) {
            const isValidCountry = territories.some((territory) =>
                territory.countries.some(
                    (country) => country.code.trim() === countryCode.trim()
                )
            );

            if (!isValidCountry) {
                this.router.navigate(["/"]);
                return false;
            }
        }

        return true;
    }
}
