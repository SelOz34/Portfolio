import { ChangeDetectionStrategy, Component, OnDestroy, input, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

type ArrowPosition = 'left' | 'right';

@Component({
  selector: 'app-section-arrow',
  imports: [TranslatePipe],
  templateUrl: './section-arrow.html',
  styleUrl: './section-arrow.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionArrow implements OnDestroy {
  readonly position = input.required<ArrowPosition>();
  readonly target = input.required<string>();
  readonly label = input.required<string>();

  protected readonly isAnimating = signal(false);

  private pointerType = '';
  private animationTimeout: ReturnType<typeof setTimeout> | null = null;

  protected onPointerDown(event: PointerEvent): void {
    this.pointerType = event.pointerType;
  }

  /**
   * Starts the touch animation before scrolling to the target.
   */
  protected onArrowClick(event: MouseEvent): void {
    if (this.isAnimating()) {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouch =
      event.detail !== 0 &&
      (this.pointerType === 'touch' ||
        this.pointerType === 'pen' ||
        window.matchMedia('(hover: none)').matches);

    this.pointerType = '';

    if (!isTouch || reducedMotion) {
      this.scrollToTarget();
      return;
    }

    this.isAnimating.set(true);

    this.animationTimeout = setTimeout(() => {
      this.finishAnimation();
    }, 800);
  }

  /**
   * Completes navigation after the visible arrow animation ends.
   */
  protected onAnimationEnd(event: AnimationEvent): void {
    if (!this.isAnimating()) {
      return;
    }

    const element = event.target;

    if (element instanceof Element && element.classList.contains('section-arrow__tip')) {
      this.finishAnimation();
    }
  }

  private finishAnimation(): void {
    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    this.isAnimating.set(false);
    this.scrollToTarget();
  }

  /**
   * Scrolls instantly to the target section.
   */
  private scrollToTarget(): void {
    const section = document.getElementById(this.target());

    if (!section) {
      return;
    }

    const headerOffset = window.matchMedia('(max-width: 768px)').matches ? 92 : 0;

    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: 'instant',
    });
  }

  ngOnDestroy(): void {
    if (this.animationTimeout !== null) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }
  }
}
