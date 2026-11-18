import { Component, input, output } from '@angular/core';

export type Language = 'de' | 'en';

@Component({
  selector: 'app-language-switch',
  templateUrl: './language-switch.html',
  styleUrl: './language-switch.scss',
})
export class LanguageSwitch {
  readonly language = input.required<Language>();
  readonly languageChange = output<Language>();

  selectLanguage(language: Language): void {
    this.languageChange.emit(language);
  }
}
