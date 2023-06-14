import { Component } from '@angular/core';
import { LanguageService, Locale } from 'src/app/services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent  {
  locale: Locale | null = null;

  constructor(private languageService: LanguageService) {
    this.locale = this.languageService.getSelectedLocale();
  }

  isLocaleSet(): boolean {
    return this.languageService.isLocaleSet();
  }
}
