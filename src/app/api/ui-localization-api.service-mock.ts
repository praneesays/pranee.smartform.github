import { HttpContext } from "@angular/common/http";
import { Provider } from "@angular/core";
import {
    UiLocalizationClientBase,
    UiLocalizationConfiguration
} from "@generated-api-clients";
import { Observable, of } from "rxjs";
import { makeApiType } from "src2/app/_gen/helpers";
import { UiLocalizationApiService } from "./ui-localization-api.service";

export class UiLocalizationApiServiceMock extends UiLocalizationClientBase {
    static makeProvider(): Provider {
        return {
            provide: UiLocalizationApiService,
            useClass: UiLocalizationApiServiceMock
        };
    }

    override getLocalizationStrings(
        httpContext?: HttpContext
    ): Observable<any> {
        const ret = {
            USER_TYPE_HEADER_TEXT: "What best describes you?"
        };
        return of(ret);
    }
    override getLocalizationConfig(httpContext?: HttpContext) {
        const ret = makeApiType(UiLocalizationConfiguration, {
            regions: [
                {
                    englishName: "Asia Pacific",
                    countries: [
                        {
                            localizedName: "Australia",
                            englishName: "Australia",
                            languages: [
                                {
                                    localizedName: "English",
                                    englishName: "English",
                                    localeCode: "en-AU"
                                }
                            ]
                        },
                        {
                            localizedName: "भारत",
                            englishName: "India",
                            languages: [
                                {
                                    localizedName: "अंग्रेज़ी",
                                    englishName: "English",
                                    localeCode: "en-IN"
                                }
                            ]
                        }
                    ]
                },
                {
                    englishName: "Europe, Middle East & Africa (EMEA)",
                    countries: [
                        {
                            localizedName: "Deutschland",
                            englishName: "Germany",
                            languages: [
                                {
                                    localizedName: "Deutsch",
                                    englishName: "German",
                                    localeCode: "de-DE"
                                }
                            ]
                        },
                        {
                            localizedName: "United Kingdom",
                            englishName: "United Kingdom",
                            languages: [
                                {
                                    localizedName: "English",
                                    englishName: "English",
                                    localeCode: "en-GB"
                                }
                            ]
                        }
                    ]
                },
                {
                    englishName: "Latin America",
                    countries: [
                        {
                            localizedName: "Latam 1",
                            englishName: "Latam 1",
                            languages: [
                                {
                                    localizedName: "Español",
                                    englishName: "Spanish",
                                    localeCode: "es-L1"
                                }
                            ]
                        },
                        {
                            localizedName: "Latam 2",
                            englishName: "Latam 2",
                            languages: [
                                {
                                    localizedName: "Português",
                                    englishName: "Portuguese",
                                    localeCode: "pt-L2"
                                }
                            ]
                        }
                    ]
                },
                {
                    englishName: "North America",
                    countries: [
                        {
                            localizedName: "Canada",
                            englishName: "Canada",
                            languages: [
                                {
                                    localizedName: "English",
                                    englishName: "English",
                                    localeCode: "en-CA"
                                },
                                {
                                    localizedName: "Français",
                                    englishName: "French",
                                    localeCode: "fr-CA"
                                }
                            ]
                        },
                        {
                            localizedName: "United States",
                            englishName: "United States",
                            languages: [
                                {
                                    localizedName: "English",
                                    englishName: "English",
                                    localeCode: "en-US"
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return of(ret);
    }
}
