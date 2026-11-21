import { Component, ElementRef, OnDestroy, input, output, signal, viewChild } from '@angular/core';
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
export class Navigation implements OnDestroy {
  readonly language = input.required<Language>();
  readonly menuPhase = input.required<MenuPhase>();

  readonly navigate = output<NavigationTarget>();

  protected readonly activeTarget = signal<NavigationTarget | null>(null);

  private readonly firstMenuLink = viewChild<ElementRef<HTMLAnchorElement>>('firstMenuLink');

  private readonly animationDuration = 550;

  private navigationTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Focuses the first navigation link.
   */
  focusFirstLink(): void {
    this.firstMenuLink()?.nativeElement.focus();
  }

  /**
   * Navigates to the selected section after the mobile link animation.
   */
  navigateTo(target: NavigationTarget): void {
    if (this.menuPhase() !== 'open' || this.activeTarget() !== null) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const mobileViewport = window.matchMedia('(max-width: 768px)').matches;

    const touchInput = window.matchMedia('(hover: none), (pointer: coarse)').matches;

    if (reducedMotion || (!mobileViewport && !touchInput)) {
      this.navigate.emit(target);
      return;
    }

    this.activeTarget.set(target);

    this.navigationTimeout = setTimeout(() => {
      this.navigationTimeout = null;

      if (this.menuPhase() === 'open') {
        this.navigate.emit(target);
      } else {
        this.activeTarget.set(null);
      }
    }, this.animationDuration);
  }

  /**
   * Clears pending navigation when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.navigationTimeout !== null) {
      clearTimeout(this.navigationTimeout);
      this.navigationTimeout = null;
    }
  }
}
