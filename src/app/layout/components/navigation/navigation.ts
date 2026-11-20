import { Component, ElementRef, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import type { Language } from '../language-switch/language-switch';

export type NavigationTarget = 'about' | 'skills' | 'portfolio';
export type MenuPhase = 'closed' | 'opening' | 'open' | 'closing';

@Component({
  selector: 'app-navigation',
  imports: [TranslatePipe],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  readonly language = input.required<Language>();
  readonly menuPhase = input.required<MenuPhase>();

  readonly navigate = output<NavigationTarget>();

  private readonly firstMenuLink = viewChild<ElementRef<HTMLAnchorElement>>('firstMenuLink');

  focusFirstLink(): void {
    this.firstMenuLink()?.nativeElement.focus();
  }

  navigateTo(target: NavigationTarget): void {
    this.navigate.emit(target);
  }
}
