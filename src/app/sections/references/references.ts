import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

interface ReferenceItem {
  readonly id: string;
  readonly name: string;
}

@Component({
  selector: 'app-references',
  imports: [TranslatePipe],
  templateUrl: './references.html',
  styleUrl: './references.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class References {
  @ViewChild('detailsDialog')
  private detailsDialog?: ElementRef<HTMLDialogElement>;

  protected readonly selectedReference = signal<ReferenceItem | null>(null);

  protected readonly references: readonly ReferenceItem[] = [
    { id: 'v-schuster', name: 'M. Mustermann' },
    { id: 'e-eichinger', name: 'N. Musterfrau' },
    { id: 'i-nuber', name: 'I. Oernek' },
  ];

  /**
   * Opens the selected reference dialog.
   */
  protected openDetails(reference: ReferenceItem): void {
    const dialog = this.detailsDialog?.nativeElement;

    if (!dialog || dialog.open) {
      return;
    }

    this.selectedReference.set(reference);
    dialog.showModal();
  }

  /**
   * Closes the currently opened reference dialog.
   */
  protected closeDetails(): void {
    const dialog = this.detailsDialog?.nativeElement;

    if (dialog?.open) {
      dialog.close();
    }
  }

  /**
   * Closes the modal on clicks inside the dialog or on its backdrop.
   * Ignores the original click that opened the dialog.
   */
  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const dialog = this.detailsDialog?.nativeElement;

    if (!dialog?.open) {
      return;
    }

    if (event.composedPath().includes(dialog)) {
      this.closeDetails();
    }
  }

  /**
   * Clears the selected reference after the dialog closes.
   */
  protected onDialogClose(): void {
    this.selectedReference.set(null);
  }
}
