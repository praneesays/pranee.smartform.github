import { Component, OnInit } from "@angular/core";
import { FormGroup, FormGroupDirective } from "@angular/forms";
import { Router } from "@angular/router";
import { LanguageService, Locale } from "src/app/services/language.service";

export interface Territory {
    name: string;
    countries: Country[];
}

export interface Country {
    code: string;
    name: string;
    languages: Language[];
}

export interface Language {
    code?: string;
    name: string;
}

export const territories: Territory[] = [
    {
        name: "Asia Pacific",
        countries: [
            {
                code: "australia",
                name: "Australia",
                languages: [{ name: "English" }]
            },
            {
                code: "india",
                name: "India",
                languages: [{ name: "English" }]
            }
        ]
    },
    {
        name: "Europe, Middle East & Africa (EMEA)",
        countries: [
            {
                code: "germany",
                name: "Germany",
                languages: [{ name: "Deutsch" }]
            },
            {
                code: "uk",
                name: "United Kingdom",
                languages: [{ name: "English" }]
            }
        ]
    },
    {
        name: "North America",
        countries: [
            {
                code: "canada",
                name: "Canada",
                languages: [
                    { name: "English" },
                    { code: "fr", name: "Français" }
                ]
            },
            {
                code: "us",
                name: "United States",
                languages: [{ name: "English" }]
            }
        ]
    }
];

@Component({
    selector: "app-locale-selector",
    templateUrl: "./locale-selector.component.html",
    styleUrls: ["./locale-selector.component.scss"]
})
export class LocaleSelectorComponent implements OnInit {
    localeForm!: FormGroup;
    territories: Territory[] = territories;

    // territories: Territory[] = [
    //     {
    //         name: "North America",
    //         countries: [
    //             {
    //                 code: "ca",
    //                 name: "Canada",
    //                 languages: [
    //                     { name: "English" },
    //                     { code: "fr", name: "Français" }
    //                 ]
    //             },
    //             {
    //                 code: "us",
    //                 name: "United States",
    //                 languages: [{ name: "English" }]
    //             }
    //         ]
    //     }
    // ];

    languages: Language[] = [
        { name: "Germany", code: "DEUTSCH" },
        { name: "United Kingdom", code: "ENGLISH" },
        { name: "Australia", code: "ENGLISH" },
        { name: "India", code: "ENGLISH" }
    ];

    // constructor(private rootFormGroup: FormGroupDirective, private languageService: LanguageService) {}
    constructor(
        private languageService: LanguageService,
        private router: Router
    ) {}

    ngOnInit() {
        // this.localeForm = this.rootFormGroup.control;
        this.languageService.clearSelectedLocale();
    }

    navigateToHome(countryCode: string, languageCode?: string) {
        if (languageCode) {
            this.router.navigate([countryCode, languageCode, "home"]);
        } else {
            this.router.navigate([countryCode, "home"]);
        }
    }

    selectLocale(country: string, language?: string) {
        const locale: Locale = {
            country: country,
            language: language
        };
        this.languageService.setSelectedLocale(locale);
        this.navigateToHome(country, language);
    }

    // countries: Country[] = [
    //   { country: 'United States', code: 'US' },
    //   { country: 'Canada', code: 'CA' },
    //   { country: 'United Kingdom', code: 'GB' },
    //   { country: 'Germany', code: 'DE' },
    //   { country: 'France', code: 'FR' },
    //   { country: 'Spain', code: 'ES' },
    //   { country: 'Italy', code: 'IT' },
    //   { country: 'Australia', code: 'AU' },
    //   { country: 'Brazil', code: 'BR' },
    //   { country: 'India', code: 'IN' }
    // ];

    // languages: Language[] = [
    //   { language: 'English', code: 'en' },
    //   { language: 'Spanish', code: 'es' },
    //   { language: 'German', code: 'de' },
    //   { language: 'Hindi', code: 'hi' },
    //   { language: 'French', code: 'fr' },
    //   { language: 'Portuguese', code: 'pt' }
    // ];
}
