import {
    HttpContext,
    HttpContextToken,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs";

export const OVERRIDE_LOCALE_TOKEN = new HttpContextToken<string | null>(
    () => null
);

@Injectable()
export class AddAcceptLanguageHttpInterceptor implements HttpInterceptor {
    static getOverrideLocaleHttpContext(lang: string): HttpContext {
        return new HttpContext().set(OVERRIDE_LOCALE_TOKEN, lang);
    }
    constructor(private readonly translateService: TranslateService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const lang =
            req.context.get(OVERRIDE_LOCALE_TOKEN) ??
            this.translateService.currentLang;
        if (!lang) {
            return next.handle(req);
        }

        const clonedRequest = req.clone({
            headers: req.headers.append("Accept-Language", lang)
        });

        return next.handle(clonedRequest);
    }
}
