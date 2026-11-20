import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../core/language.service';
import {
  LanguageSwitch,
  type Language,
} from '../../layout/components/language-switch/language-switch';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink, TranslatePipe, LanguageSwitch],
  templateUrl: './privacy-policy.html',
  styleUrl: './privacy-policy.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicy {
  private readonly languageService = inject(LanguageService);

  protected readonly language = this.languageService.language;

  protected readonly sections = [
    'controller',
    'hosting',
    'logs',
    'contact',
    'storage',
    'external',
    'retention',
    'rights',
    'authority',
  ] as const;

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }
}
