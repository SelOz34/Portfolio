import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';

import { LanguageSwitch, type Language } from '../language-switch/language-switch';

import { BurgerMenu } from '../burger-menu/burger-menu';

import { Navigation } from '../navigation/navigation';
import { LanguageService } from '../../../core/language.service';

type Line = [number, number, number, number];
type Pose = [Line, Line, Line];

function centeredPose(width: number, height: number, lines: Pose): Pose {
  const dx = (58 - width) / 2;
  const dy = (53 - height) / 2;

  return lines.map(([x1, y1, x2, y2]): Line => [x1 + dx, y1 + dy, x2 + dx, y2 + dy]) as Pose;
}

const BURGER_POSES: Pose[] = [
  // burger
  centeredPose(44, 38, [
    [2, 2, 42, 2],
    [2, 19, 42, 19],
    [2, 36, 42, 36],
  ]),

  // Transition
  centeredPose(44, 38, [
    [12, 2, 32, 2],
    [2, 19, 42, 19],
    [12, 36, 32, 36],
  ]),

  // Variant3
  centeredPose(44, 38, [
    [22, 2, 42, 2],
    [2, 19, 42, 19],
    [2, 36, 22, 36],
  ]),

  // Variant4
  centeredPose(58, 53, [
    [39.8169, 15.6733, 55.1378, 2.81759],
    [12.1582, 13.3892, 42.8, 39.1007],
    [2.81787, 49.6741, 18.1388, 36.8183],
  ]),

  // Variant5 (X)
  centeredPose(40, 32, [
    [20, 15.856, 35.3209, 3.0002],
    [4.67969, 3.14307, 35.3215, 28.8546],
    [5, 28.856, 20.3209, 16.0002],
  ]),

  // Variant6
  centeredPose(58, 53, [
    [39.8169, 15.6733, 55.1378, 2.81759],
    [12.1582, 13.3892, 42.8, 39.1007],
    [2.81787, 49.6741, 18.1388, 36.8183],
  ]),

  // Variant7
  centeredPose(44, 38, [
    [22, 2, 42, 2],
    [2, 19, 42, 19],
    [2, 36, 22, 36],
  ]),

  // Variant8
  centeredPose(44, 38, [
    [12, 2, 32, 2],
    [2, 19, 42, 19],
    [12, 36, 32, 36],
  ]),
];

function interpolatePose(start: Pose, end: Pose, progress: number): Pose {
  const easeOut = 1 - (1 - progress) ** 2;

  return start.map(
    (line, lineIndex): Line =>
      line.map(
        (value, coordinateIndex) => value + (end[lineIndex][coordinateIndex] - value) * easeOut,
      ) as Line,
  ) as Pose;
}

@Component({
  selector: 'app-header',
  imports: [LanguageSwitch, BurgerMenu, Navigation],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  @ViewChild('menuToggle')
  private menuToggle?: ElementRef<HTMLButtonElement>;

  @ViewChild(Navigation)
  private navigation?: Navigation;

  @ViewChild('siteHeader')
  private siteHeader?: ElementRef<HTMLElement>;

  protected readonly menuOpen = signal(false);
  protected readonly menuPhase = signal<'closed' | 'opening' | 'open' | 'closing'>('closed');
  protected readonly burgerLines = signal<Pose>(BURGER_POSES[0]);
  private readonly languageService = inject(LanguageService);
  protected readonly language = this.languageService.language;

  private animationFrame: number | null = null;
  private animationTimeout: ReturnType<typeof setTimeout> | null = null;
  private animating = false;

  private readonly headerBreakpoint = '(max-width: 768px)';

  private headerMediaQuery: MediaQueryList | null = null;

  private readonly handleLayoutChange = (): void => {
    this.resetMenuAfterLayoutChange();
  };

  private previousBodyOverflow: string | null = null;
  private pendingScrollTarget: string | null = null;

  protected toggleMenu(): void {
    if (this.animating) {
      return;
    }

    this.animateBurger(!this.menuOpen());
  }

  protected closeMenu(): void {
    if (this.menuOpen() && !this.animating) {
      this.animateBurger(false);
    }
  }

  protected navigateTo(sectionId: string): void {
    this.pendingScrollTarget = sectionId;

    if (this.menuOpen()) {
      if (!this.animating) {
        this.animateBurger(false);
      }

      return;
    }

    this.scrollToPendingTarget();
  }

  private scrollToPendingTarget(): void {
    const sectionId = this.pendingScrollTarget;
    this.pendingScrollTarget = null;

    if (!sectionId || typeof document === 'undefined') {
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
      block: 'start',
    });
  }

  protected setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
  }

  private animateBurger(opening: boolean): void {
    if (opening) {
      this.lockPageScroll();
    }
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      this.burgerLines.set(BURGER_POSES[opening ? 4 : 0]);
      this.menuOpen.set(opening);
      this.menuPhase.set(opening ? 'open' : 'closed');

      if (opening) {
        requestAnimationFrame(() => {
          this.navigation?.focusFirstLink();
        });
      } else {
        this.unlockPageScroll();
        this.menuToggle?.nativeElement.focus();
        this.scrollToPendingTarget();
      }

      return;
    }

    this.animating = true;
    this.menuPhase.set(opening ? 'opening' : 'closing');

    if (opening) {
      this.menuOpen.set(true);
    }

    const sequence = opening ? [0, 1, 2, 3, 4] : [4, 5, 6, 7, 0];

    let step = 0;

    const finish = (): void => {
      this.animating = false;

      if (opening) {
        this.menuPhase.set('open');
        this.navigation?.focusFirstLink();
      } else {
        this.menuOpen.set(false);
        this.menuPhase.set('closed');
        this.unlockPageScroll();
        this.menuToggle?.nativeElement.focus();
        this.scrollToPendingTarget();
      }
    };

    const runStep = (): void => {
      const start = BURGER_POSES[sequence[step]];
      const end = BURGER_POSES[sequence[step + 1]];
      const duration = opening && step === 0 ? 40 : 50;

      const startedAt = performance.now();

      const animateFrame = (now: number): void => {
        const progress = Math.min(1, (now - startedAt) / duration);

        this.burgerLines.set(interpolatePose(start, end, progress));

        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(animateFrame);
          return;
        }

        this.burgerLines.set(end);
        step++;

        if (step === 4) {
          finish();
          return;
        }

        this.animationTimeout = setTimeout(runStep, 10);
      };

      this.animationFrame = requestAnimationFrame(animateFrame);
    };

    runStep();
  }

  private lockPageScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (this.previousBodyOverflow !== null) {
      return;
    }

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  private unlockPageScroll(): void {
    if (typeof document === 'undefined') {
      return;
    }

    if (this.previousBodyOverflow === null) {
      return;
    }

    document.body.style.overflow = this.previousBodyOverflow;
    this.previousBodyOverflow = null;
  }

  @HostListener('document:keydown', ['$event'])
  protected handleMenuKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen()) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      this.closeMenu();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const header = this.siteHeader?.nativeElement;

    if (!header) {
      return;
    }

    const focusableElements = Array.from(
      header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    ).filter((element) => element.getClientRects().length > 0 && !element.closest('[inert]'));

    if (focusableElements.length === 0) {
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!focusableElements.some((element) => element === activeElement)) {
      event.preventDefault();
      first.focus();
    }
  }

  private getInitialLanguage(): Language {
    if (typeof window === 'undefined') {
      return 'de';
    }

    return window.localStorage.getItem('portfolio-language') === 'en' ? 'en' : 'de';
  }

  private resetMenuAfterLayoutChange(): void {
    if (!this.menuOpen() && !this.animating) {
      return;
    }

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }

    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    this.animating = false;

    this.burgerLines.set(BURGER_POSES[0]);
    this.menuPhase.set('closed');
    this.menuOpen.set(false);

    this.pendingScrollTarget = null;

    this.unlockPageScroll();

    this.menuToggle?.nativeElement.focus();
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.headerMediaQuery = window.matchMedia(this.headerBreakpoint);

    this.headerMediaQuery.addEventListener('change', this.handleLayoutChange);
  }

  ngOnDestroy(): void {
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
    }

    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
    }

    this.headerMediaQuery?.removeEventListener('change', this.handleLayoutChange);

    this.unlockPageScroll();
  }
}
