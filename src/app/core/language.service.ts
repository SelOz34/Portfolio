import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import type { Language } from '../layout/components/language-switch/language-switch';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly translateService = inject(TranslateService);

  readonly language = signal<Language>(this.getInitialLanguage());

  constructor() {
    this.translateService.addLangs(['de', 'en']);
    this.translateService.use(this.language());
    this.updateDocumentLanguage(this.language());
  }

  setLanguage(language: Language): void {
    if (this.language() === language) {
      return;
    }

    this.language.set(language);
    this.translateService.use(language);
    this.updateDocumentLanguage(language);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('portfolio-language', language);
    }
  }

  private getInitialLanguage(): Language {
    if (typeof window === 'undefined') {
      return 'de';
    }

    return window.localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'de';
  }

  private updateDocumentLanguage(language: Language): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }
}
