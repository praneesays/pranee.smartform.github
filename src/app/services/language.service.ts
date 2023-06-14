import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Locale {
  country: string;
  language?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private selectedLocale = new BehaviorSubject<Locale | null>(null);

  selectedLocale$ = this.selectedLocale.asObservable();

  seeSelectedLocale(locale: Locale) {
    this.selectedLocale.next(locale);
    localStorage.setItem('locale', JSON.stringify(locale));
  }

  clearSelectedLocale() {
    this.selectedLocale.next(null);
    localStorage.removeItem('locale');
  }

  isLocaleSet(): boolean {
    return localStorage.getItem('locale') !== null;
  }

  getSelectedLocale(): Locale | null {
    return this.selectedLocale.getValue();
  }
}
