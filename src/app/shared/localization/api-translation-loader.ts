import { Location } from "@angular/common";
import { Routes } from "@angular/router";
import {
    LocalizeParser,
    LocalizeRouterSettings
} from "@gilsdav/ngx-translate-router";
import { TranslateLoader, TranslateService } from "@ngx-translate/core";
import { firstValueFrom, Observable } from "rxjs";
import { UiLocalizationApiService } from "src/app/api/ui-localization-api.service";
import { AddAcceptLanguageHttpInterceptor } from "./add-accept-language.interceptor";

export class ApiTranslationLoader implements TranslateLoader {
    constructor(private readonly uiLocalizationApi: UiLocalizationApiService) {}

    getTranslation(lang: string): Observable<any> {
        return this.uiLocalizationApi.getLocalizationStrings(
            AddAcceptLanguageHttpInterceptor.getOverrideLocaleHttpContext(lang)
        );
    }
}

export class ApiLocalizeParser extends LocalizeParser {
    constructor(
        translate: TranslateService,
        location: Location,
        settings: LocalizeRouterSettings,
        private readonly uiLocalizationApi: UiLocalizationApiService
    ) {
        super(translate, location, settings);
    }

    async load(routes: Routes): Promise<any> {
        const resp = await firstValueFrom(
            this.uiLocalizationApi.getLocalizationConfig()
        );

        this.locales = resp.regions.flatMap((region) =>
            region.countries.flatMap((country) =>
                country.languages.map((lang) => lang.localeCode)
            )
        );

        await this.init(routes);
    }
}
