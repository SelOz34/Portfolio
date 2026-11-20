import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageService } from '../../core/language.service';
import {
  LanguageSwitch,
  type Language,
} from '../../layout/components/language-switch/language-switch';

@Component({
  selector: 'app-legal-notice',
  imports: [RouterLink, TranslatePipe, LanguageSwitch],
  templateUrl: './legal-notice.html',
  styleUrl: './legal-notice.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice {
  private readonly languageService = inject(LanguageService);

  protected readonly language = this.languageService.language;

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }
}
