import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, signal } from '@angular/core';
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
    { id: 'v-schuster', name: 'V. Schuster' },
    { id: 'e-eichinger', name: 'E.Eichinger' },
    { id: 'i-nuber', name: 'I.Nuber' },
  ];

  protected openDetails(reference: ReferenceItem): void {
    this.selectedReference.set(reference);
    this.detailsDialog?.nativeElement.showModal();
  }

  protected closeDetails(): void {
    this.detailsDialog?.nativeElement.close();
  }

  protected onDialogClose(): void {
    this.selectedReference.set(null);
  }
}
