import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ReferenceItem {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly quote: string;
}

@Component({
  selector: 'app-references',
  templateUrl: './references.html',
  styleUrl: './references.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class References {
  protected readonly title = 'References';

  protected readonly description =
    'I thrive both independently and as part of a team. Here’s what my colleagues have to say about working with me.';

  protected readonly references: readonly ReferenceItem[] = [
    {
      id: 'v-schuster',
      name: 'V. Schuster',
      role: 'Team Partner',
      quote:
        "Michael really kept the team together with his great organization and clear communication. We wouldn't have got this far without his commitment.",
    },
    {
      id: 'e-eichinger',
      name: 'E.Eichinger',
      role: 'Team Partner',
      quote:
        'Michi was a top team colleague at DA. His positive commitment and willingness to take on responsibility made a significant contribution to us achieving our goals.',
    },
    {
      id: 'i-nuber',
      name: 'I.Nuber',
      role: 'Frontend Engineer',
      quote:
        'It was a great pleasure to work with Michael. He knows how to push and encourage team members to present the best work possible, always adding something to brainstorm. Regarding the well-being of group members, he was always present and available to listen and help others, with a great sense of humor as well.',
    },
  ];
}
