import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Locale {
    country: string;
    language?: string;
}

@Injectable({
    providedIn: "root"
})
export class LanguageService {
    readonly selectedLocale = new BehaviorSubject<Locale | null>(null);
    selectedLocale$ = this.selectedLocale.asObservable();

    constructor() {
        const storedLocale = localStorage.getItem("locale");
        if (storedLocale) {
            this.selectedLocale.next(JSON.parse(storedLocale));
        }
    }

    setSelectedLocale(locale: Locale) {
        this.selectedLocale.next(locale);
        localStorage.setItem("locale", JSON.stringify(locale));
    }

    clearSelectedLocale() {
        this.selectedLocale.next(null);
        localStorage.removeItem("locale");
    }

    isLocaleSet(): boolean {
        return !!localStorage.getItem("locale");
    }
}
